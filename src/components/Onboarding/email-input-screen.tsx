import type React from "react"

import { useState } from "react"
// ... existing code ...
import { sendEmailOTP } from '@/lib/api'

interface EmailInputScreenProps {
  value?: string
  onContinue: (email: string) => void
  onBack?: () => void
}

export default function EmailInputScreen({ value, onContinue, onBack }: EmailInputScreenProps) {
  const [email, setEmail] = useState(value || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Now: .edu or .org can be anywhere in the email
  const isCollegeEmail = (email: string) => {
    return isValidEmail(email) && (email.includes('.edu') || email.includes('.org'))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError("")
    setSuccess("")
  }

  const handleContinue = async () => {
    setError("")
    setSuccess("")
    if (!isCollegeEmail(email)) {
      setError("Please use your university email (.edu or .org)")
      return
    }
    setLoading(true)
    try {
      const res = await sendEmailOTP(email)
      if (res.success) {
        setSuccess("OTP sent to your university email.")
        setTimeout(() => {
          setSuccess("")
          onContinue(email)
        }, 1000)
      } else {
        setError(res.message || "Failed to send OTP. Try again.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const isEmailComplete = email && isCollegeEmail(email)

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 8px', paddingTop: 32, height: 56 }}>
                <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, marginRight: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '0 16px', marginBottom: 24, marginTop: 30 }}>
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Your email</h1>
      </div>

      {/* Email Input */}
      <div style={{ padding: '0 16px', marginBottom: 0 }}>
        <input
          type="email"
          placeholder="Sign up with your university email ID"
          value={email}
          onChange={handleEmailChange}
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 400,
            letterSpacing: '-0.2px',
          }}
        />
        {/* Notification */}
        {error && <div style={{ color: '#ff5555', marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', marginTop: 8 }}>{success}</div>}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={handleContinue}
          disabled={!isEmailComplete || loading}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isEmailComplete && !loading ? '#22FF88' : '#232323',
            color: isEmailComplete && !loading ? '#000' : '#888',
            border: 'none',
            opacity: isEmailComplete && !loading ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isEmailComplete && !loading ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {loading ? 'Sending OTP...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
