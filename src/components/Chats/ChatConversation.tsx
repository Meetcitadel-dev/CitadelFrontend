"use client"

import { useState } from "react"
import { ArrowLeft, MoreVertical, Mic, Send } from "lucide-react"
// import ChatDropdown from "./ChatDropdown"
import BlockUserModal from "./BlockUserModal"
import ChatDropdown from "./ChatDropdown"

interface ChatConversationProps {
  onBack: () => void
}

interface Message {
  id: string
  text: string
  isSent: boolean
  time?: string
}

export default function ChatConversation({ onBack }: ChatConversationProps) {
  const messages: Message[] = [
    {
      id: "1",
      text: "Hey, how are you?",
      isSent: false,
      time: "Today 8:00 AM",
    },
    {
      id: "2",
      text: "I'm good, thanks! How about you?",
      isSent: true,
      time: "Today 11:20 AM",
    },
    {
      id: "3",
      text: "Doing well, thanks!",
      isSent: false,
    },
    {
      id: "4",
      text: "Did you finish the project?",
      isSent: false,
    },
    {
      id: "5",
      text: "Yes, I did. Sent it over this morning.",
      isSent: true,
    },
    {
      id: "6",
      text: "Great! I'll review it today.",
      isSent: false,
    },
    {
      id: "7",
      text: "Thanks!",
      isSent: true,
    },
    {
      id: "8",
      text: "How's the project coming?",
      isSent: true,
    },
    {
      id: "9",
      text: "ETA?",
      isSent: true,
    },
  ]

  const [inputValue, setInputValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-800">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="Ananya Verma"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h1 className="text-lg font-semibold flex-1">Ananya Verma</h1>
        <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <ChatDropdown
          onClose={() => setShowDropdown(false)}
          onBlockUser={() => {
            setShowBlockModal(true)
            setShowDropdown(false)
          }}
        />
      )}

      {/* Block User Modal */}
      {showBlockModal && <BlockUserModal onClose={() => setShowBlockModal(false)} />}

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={message.id}>
            {message.time && <div className="text-center text-gray-400 text-sm mb-4">{message.time}</div>}
            <div className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.isSent ? "bg-green-600 text-white ml-12" : "bg-gray-800 text-white mr-12"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Send a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-800 rounded-full py-3 px-4 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            {inputValue.trim() ? <Send className="w-6 h-6 text-black" /> : <Mic className="w-6 h-6 text-black" />}
          </button>
        </div>
      </div>
    </div>
  )
}
