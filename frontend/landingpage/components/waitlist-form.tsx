"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface WaitlistFormProps {
  placeholder: string
  buttonText: string
  loadingText: string
  successMessage: string
  errorMessages: {
    required: string
    invalid: string
    duplicate: string
    generic: string
    network: string
  }
  className?: string
}

export function WaitlistForm({
  placeholder,
  buttonText,
  loadingText,
  successMessage,
  errorMessages,
  className = "",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus("error")
      setMessage(errorMessages.required)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage(errorMessages.invalid)
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(successMessage)
        setEmail("")
      } else {
        setStatus("error")
        if (response.status === 409) {
          setMessage(errorMessages.duplicate)
        } else {
          setMessage(data.error || errorMessages.generic)
        }
      }
    } catch (error) {
      setStatus("error")
      setMessage(errorMessages.network)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2 mb-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="bg-white border-[#8B7355]/20 text-[#4A3728] placeholder:text-[#8B7355]/60"
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            className="bg-[#CC6B3D] hover:bg-[#B85A2E] hover:scale-105 hover:shadow-lg text-white px-6 transition-all duration-200 ease-in-out"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
