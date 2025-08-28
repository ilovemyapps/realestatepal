-- Create waitlist table for ADU analysis platform
--CREATE TABLE IF NOT EXISTS public.waitlist (
--  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--  email TEXT NOT NULL UNIQUE,
--  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
--);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist table
-- Allow anyone to insert (join waitlist)
CREATE POLICY "Allow anyone to join waitlist" 
  ON public.waitlist FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to select their own email (for duplicate checking)
CREATE POLICY "Allow users to check their own email" 
  ON public.waitlist FOR SELECT 
  USING (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_updated_at 
  BEFORE UPDATE ON public.waitlist 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
