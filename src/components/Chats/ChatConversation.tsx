"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, MoreVertical, Mic, Send } from "lucide-react"
import BlockUserModal from "./BlockUserModal"
import ChatDropdown from "./ChatDropdown"
import { fetchConversationMessages, sendMessage, markMessagesAsRead, getConversationByUserId } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

interface ChatConversationProps {
  onBack: () => void
  conversationId?: string
  userId?: string
}

interface Message {
  id: string
  text: string
  isSent: boolean
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

interface ConversationInfo {
  id: string
  userId: string
  name: string
  profileImage?: string
}

export default function ChatConversation({ onBack, conversationId, userId }: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        if (!conversationId) {
          console.error('No conversation ID provided')
          return
        }

        const response = await fetchConversationMessages(conversationId, token)
        
        if (response.success) {
          setMessages(response.messages)
          // Mark messages as read
          await markMessagesAsRead(conversationId, token)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchConversationInfo = async () => {
      try {
        const token = getAuthToken()
        if (!token || !userId) return

        const response = await getConversationByUserId(userId, token)
        console.log('getConversationByUserId response:', response) // Debug log
        if (response.success && response.conversation) {
          setConversationInfo(response.conversation)
        }
      } catch (error) {
        console.error('Error fetching conversation info:', error)
      }
    }

    if (conversationId) {
      fetchMessages()
    }
    
    if (userId) {
      fetchConversationInfo()
    }
  }, [conversationId, userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId || sending) return

    const messageText = inputValue.trim()
    setInputValue("")
    setSending(true)

    try {
      const token = getAuthToken()
      if (!token) return

      const response = await sendMessage(conversationId, messageText, token)
      
      if (response.success) {
        const newMessage: Message = {
          id: response.message.id,
          text: response.message.text,
          isSent: true,
          timestamp: response.message.timestamp,
          status: 'sent'
        }
        setMessages(prev => [...prev, newMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Revert input value if sending failed
      setInputValue(messageText)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const shouldShowTime = (message: Message, index: number) => {
    if (index === 0) return true
    
    const currentTime = new Date(message.timestamp)
    const previousTime = new Date(messages[index - 1].timestamp)
    const diffInMinutes = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60)
    
    return diffInMinutes > 5
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-white">Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-800">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <img
          src={conversationInfo?.profileImage || "/placeholder.svg?height=40&width=40"}
          alt={conversationInfo?.name || "User"}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h1 className="text-lg font-semibold flex-1">{conversationInfo?.name || "User"}</h1>
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
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id}>
              {shouldShowTime(message, index) && (
                <div className="text-center text-gray-400 text-sm mb-4">
                  {formatTime(message.timestamp)}
                </div>
              )}
              <div className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.isSent ? "bg-green-600 text-white ml-12" : "bg-gray-800 text-white mr-12"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 ${message.isSent ? 'text-green-200' : 'text-gray-400'}`}>
                    {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
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
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="w-full bg-gray-800 rounded-full py-3 px-4 text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sending}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inputValue.trim() ? (
              <Send className="w-6 h-6 text-black" />
            ) : (
              <Mic className="w-6 h-6 text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
