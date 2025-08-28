import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function ensureWaitlistTable(supabase: any) {
  const createTableSQL = `
    -- Create waitlist table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.waitlist (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
    );

    -- Enable RLS
    ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow anyone to join waitlist
    DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
    CREATE POLICY "Anyone can join waitlist" ON public.waitlist
      FOR INSERT WITH CHECK (true);

    -- Create policy to allow reading for service operations
    DROP POLICY IF EXISTS "Service can read waitlist" ON public.waitlist;
    CREATE POLICY "Service can read waitlist" ON public.waitlist
      FOR SELECT USING (true);

    -- Create index for email lookups
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

    -- Create updated_at trigger
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = TIMEZONE('utc'::text, NOW());
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_waitlist_updated_at ON public.waitlist;
    CREATE TRIGGER update_waitlist_updated_at
        BEFORE UPDATE ON public.waitlist
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `

  try {
    const { error } = await supabase.rpc("exec_sql", { sql: createTableSQL })
    if (error) {
      // If rpc doesn't work, try direct SQL execution
      const { error: directError } = await supabase.from("_").select("*").limit(0)
      // This will fail but we can catch it and try a different approach
      console.log("Table creation attempted")
    }
  } catch (error) {
    console.log("Table creation handled:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingEmail, error: checkError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email.toLowerCase())
      .single()

    if (checkError && checkError.message?.includes("Could not find the table")) {
      console.log("Waitlist table not found, attempting to create it...")

      // For now, return a more helpful error message with instructions
      return NextResponse.json(
        {
          error:
            "Database setup required. Please run the SQL script in scripts/001_create_waitlist.sql to create the waitlist table.",
        },
        { status: 503 },
      )
    }

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing email:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Insert new email
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email: email.toLowerCase() }])
      .select()
      .single()

    if (error && error.message?.includes("Could not find the table")) {
      console.error("Waitlist table not found on insert:", error)
      return NextResponse.json(
        {
          error: "Service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }

    if (error) {
      console.error("Error inserting email:", error)
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully joined waitlist", data }, { status: 201 })
  } catch (error) {
    console.error("Waitlist API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
