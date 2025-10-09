"use client"

import { useState } from "react"
import { Send, X } from "lucide-react"

interface BlockUserModalProps {
  onClose: () => void
}

export default function BlockUserModal({ onClose }: BlockUserModalProps) {
  const [reason, setReason] = useState("")
  const maxLength = 200

  const handleSubmit = () => {
    // Handle block user submission
    console.log("Blocking user with reason:", reason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Block User Box - positioned at top */}
      <div className="absolute top-32 left-4 right-4 bg-gray-900 rounded-xl border border-gray-700 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white text-lg font-medium">Block user</h2>
          <button onClick={handleSubmit} className="text-green-500 hover:text-green-400 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="relative">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, maxLength))}
              placeholder="State the reason why."
              className="w-full h-24 bg-gray-800 text-white placeholder-gray-400 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-600"
              maxLength={maxLength}
            />
            <div className="absolute bottom-2 right-2 text-gray-400 text-xs">
              {reason.length}/{maxLength}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
