
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { verifyOTP } from '@/lib/api'
import { setAuthToken } from '@/lib/utils'

interface OTPInputScreenProps {
  email: string
  onContinue: () => void
}

export default function OTPInputScreen({ email, onContinue }: OTPInputScreenProps) {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError("")
    setSuccess("")

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const isOTPComplete = otp.every((digit) => digit !== "")

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

        const handleContinue = async () => {
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const code = otp.join("")
      const res = await verifyOTP(email, code)
      if (res.success) {
        // Store the access token from the tokens object
        if (res.tokens && res.tokens.accessToken) {
          setAuthToken(res.tokens.accessToken)
        }
        setSuccess("OTP verified!")
        setTimeout(() => {
          setSuccess("")
          onContinue()
        }, 1000)
      } else {
        setError(res.message || "Invalid OTP. Try again.")
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 8px', paddingTop: 32, height: 56 }}>
        <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 0 }}>
          <ChevronLeft size={24} color="white" />
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Enter OTP</h1>
      </div>

      {/* OTP Input Boxes */}
      <div style={{ padding: '0 16px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16 }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                width: 56,
                height: 56,
                background: '#232323',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "'Roboto Serif', serif",
                outline: 'none',
                boxShadow: 'none',
                transition: 'border 0.2s',
                margin: 0,
                padding: 0,
                letterSpacing: '0',
              }}
              className="otp-input"
            />
          ))}
        </div>
        {/* Notification */}
        {error && <div style={{ color: '#ff5555', marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', marginTop: 8 }}>{success}</div>}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={handleContinue}
          disabled={!isOTPComplete || loading}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isOTPComplete && !loading ? '#22FF88' : '#232323',
            color: isOTPComplete && !loading ? '#000' : '#888',
            border: 'none',
            opacity: isOTPComplete && !loading ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isOTPComplete && !loading ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
