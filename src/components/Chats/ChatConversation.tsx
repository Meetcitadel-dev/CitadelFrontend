"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, MoreVertical, Mic, Send } from "lucide-react"
import BlockUserModal from "./BlockUserModal"
import ChatDropdown from "./ChatDropdown"
import { fetchConversationMessages, sendMessage, markMessagesAsRead, getConversationByUserId, getConversationById, fetchUserProfileByName } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import { chatSocketService } from "@/lib/socket"
import { useWebSocket } from "@/lib/hooks/useWebSocket"

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
  const [connectionMethod, setConnectionMethod] = useState<'websocket' | 'polling' | 'none'>('none')
  const { isConnected } = useWebSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    let cleanupPolling: (() => void) | undefined;
    let isInitialized = false;

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
        if (!token) return

        // If we have userId, try to get conversation info
        if (userId) {
          const response = await getConversationByUserId(userId, token)
          
          if (response.success && response.conversation) {
            setConversationInfo(response.conversation)
            return
          }
        }
        
        // Fallback: try to get user profile by ID if userId exists
        if (userId) {
          try {
            const userProfileResponse = await fetchUserProfileByName(userId, token)
            
            if (userProfileResponse.success && userProfileResponse.data) {
              setConversationInfo({
                id: conversationId || '',
                userId: userId,
                name: userProfileResponse.data.name,
                profileImage: undefined
              })
              return
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError)
          }
        }
        
        // Final fallback: try to get conversation details by conversation ID
        if (conversationId && !userId) {
          try {
            const conversationResponse = await getConversationById(conversationId, token)
            
            if (conversationResponse.success && conversationResponse.conversation) {
              setConversationInfo(conversationResponse.conversation)
              return
            }
          } catch (error) {
            console.error('Error fetching conversation details:', error)
          }
          
          // Fallback: try to get conversation details from the messages
          try {
            const messagesResponse = await fetchConversationMessages(conversationId, token)
            if (messagesResponse.success && messagesResponse.messages.length > 0) {
              // Look for messages from other users to get their info
              const otherUserMessages = messagesResponse.messages.filter(msg => !msg.isSent)
              if (otherUserMessages.length > 0) {
                setConversationInfo({
                  id: conversationId,
                  userId: 'unknown',
                  name: `User`,
                  profileImage: undefined
                })
                return
              }
            }
          } catch (error) {
            console.error('Error fetching messages for fallback:', error)
          }
          
          // Last resort: show conversation ID
          setConversationInfo({
            id: conversationId,
            userId: 'unknown',
            name: `Chat ${conversationId.slice(0, 8)}...`,
            profileImage: undefined
          })
        }
      } catch (error) {
        console.error('Error fetching conversation info:', error)
      }
    }

    // Initialize WebSocket connection
    const initializeWebSocket = () => {
      if (isInitialized) {
        return;
      }
      
      chatSocketService.connect()
      
      // Remove any existing listeners first
      chatSocketService.off('new_message')
      chatSocketService.off('message_status')
      
      // Listen for new messages
      chatSocketService.onNewMessage((data) => {
        if (data.conversationId === conversationId) {
          const newMessage: Message = {
            id: data.message.id,
            text: data.message.text,
            isSent: false, // Message from other user
            timestamp: data.message.timestamp,
            status: data.message.status
          }
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => 
              msg.id === data.message.id || 
              (msg.text === data.message.text && Math.abs(new Date(msg.timestamp).getTime() - new Date(data.message.timestamp).getTime()) < 1000)
            )
            if (messageExists) {
              return prev
            }
            return [...prev, newMessage]
          })
        }
      })

      // Listen for message status updates
      chatSocketService.onMessageStatusUpdate((data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        ))
      })

      // Join the conversation room
      if (conversationId) {
        chatSocketService.joinConversation(conversationId)
      }
      
      isInitialized = true;
    }

    // Polling mechanism for real-time updates (fallback)
    const startPolling = () => {
      const pollInterval = setInterval(async () => {
        if (!conversationId) return
        
        try {
          const token = getAuthToken()
          if (!token) return

          const response = await fetchConversationMessages(conversationId, token)
          if (response.success) {
            setMessages(prev => {
              // Only update if there are new messages
              const newMessages = response.messages
              const currentMessageIds = new Set(prev.map(msg => msg.id))
              const hasNewMessages = newMessages.some(msg => !currentMessageIds.has(msg.id))
              
              if (hasNewMessages) {
                return newMessages
              }
              return prev
            })
          }
        } catch (error) {
          console.error('Error polling messages:', error)
        }
      }, 3000) // Poll every 3 seconds

      return () => clearInterval(pollInterval)
    }

    if (conversationId) {
      fetchMessages()
      
      // Try WebSocket first, fallback to polling
      try {
        initializeWebSocket()
        setConnectionMethod('websocket')
      } catch (error) {
        setConnectionMethod('polling')
        cleanupPolling = startPolling()
      }
    }
    
    // Always try to fetch conversation info, even without userId
    fetchConversationInfo()

    // Cleanup function
    return () => {
      if (conversationId) {
        chatSocketService.leaveConversation(conversationId)
        chatSocketService.off('new_message')
        chatSocketService.off('message_status')
        chatSocketService.off('user_status')
      }
      if (cleanupPolling) {
        cleanupPolling()
      }
      isInitialized = false;
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

      // Send message via REST API for persistence first
      const response = await sendMessage(conversationId, messageText, token)
      
      if (response.success) {
        const newMessage: Message = {
          id: response.message.id,
          text: response.message.text,
          isSent: true,
          timestamp: response.message.timestamp,
          status: 'sent'
        }
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => 
            msg.text === messageText && 
            Math.abs(new Date(msg.timestamp).getTime() - new Date(response.message.timestamp).getTime()) < 1000
          )
          if (messageExists) {
            return prev
          }
          return [...prev, newMessage]
        })
        
        // Then send via WebSocket for real-time delivery to other users
        chatSocketService.sendMessage(conversationId, messageText)
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
    <div className="bg-black min-h-screen text-white relative">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center px-4 py-4">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <img
            src={conversationInfo?.profileImage || "/placeholder.svg?height=40&width=40"}
            alt={conversationInfo?.name || "User"}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {conversationInfo?.name || userId || "User"}
            </h1>
            <div className="flex items-center text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Online' : 'Connecting...'}
            </div>
          </div>
          <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>
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

      {/* Messages - Scrollable with proper spacing */}
      <div className="pt-20 pb-24 px-4 py-4 space-y-4 overflow-y-auto h-screen">
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
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-black border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-4">
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
