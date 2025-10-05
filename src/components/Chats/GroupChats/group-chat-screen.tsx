
import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, MoreVertical, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ChatMessage from "./chat-message"
import GroupOptionsMenu from "./group-options-menu"
import { fetchGroupMessages, sendGroupMessage, markGroupMessagesAsRead, getCurrentUserProfile } from "@/lib/api"
import { getRandomDefaultAvatar } from "@/lib/profileAvatar"
import { getAuthToken } from "@/lib/utils"
import { chatSocketService } from "@/lib/socket"

interface GroupChatScreenProps {
  onBack: () => void
  groupId: string
  groupName: string
  groupAvatar?: string
  memberCount: number
  onHeaderClick?: () => void // New prop for header click navigation
  onUnreadCountChange?: () => void // New prop to notify parent of unread count changes
}

interface Message {
  id: string
  text: string
  timestamp: string
  senderId: string
  senderName: string
  senderAvatar: string
  isCurrentUser: boolean
}

export default function GroupChatScreen({ onBack, groupId, groupName, groupAvatar, memberCount, onHeaderClick, onUnreadCountChange }: GroupChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await getCurrentUserProfile(token)
        if (response.success && response.data) {
          setCurrentUserId(response.data.id.toString())
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    getCurrentUser()
  }, [])

  // Connect to WebSocket and join group room
  useEffect(() => {
    
    
    // Don't connect here - connection is managed by parent component
    // Just join the group room
    chatSocketService.joinGroup(groupId)

    // Cleanup function
    return () => {
      
      chatSocketService.off('group-message')
      chatSocketService.off('group-updated')
      chatSocketService.leaveGroup(groupId)
      
      // Mark messages as read when leaving the chat
      const markAsReadOnExit = async () => {
        try {
          const token = getAuthToken()
          if (token) {
            await markGroupMessagesAsRead(groupId, token)
            
            
            // Notify parent component of unread count change
            if (onUnreadCountChange) {
              onUnreadCountChange()
            }
          }
        } catch (error) {
          console.error('Error marking messages as read on exit:', error)
        }
      }
      
      markAsReadOnExit()
    }
  }, [groupId])

  // Set up event listeners (separate useEffect to avoid re-registering on currentUserId changes)
  useEffect(() => {
    if (!currentUserId) return

    // Listen for new group messages
    const handleGroupMessage = (data: {
      groupId: string;
      message: {
        id: string;
        content: string;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
        timestamp: string;
      };
    }) => {
      
      if (data.groupId === groupId) {
        
        // Check if this message is already in the list to prevent duplicates
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === data.message.id)
          if (messageExists) {
            
            return prev
          }

          // Determine if message belongs to current user
          const isActuallyCurrentUser = String(data.message.senderId) === String(currentUserId)

          const newMsg: Message = {
            id: data.message.id,
            text: data.message.content,
            timestamp: formatMessageTime(data.message.timestamp),
            senderId: data.message.senderId,
            senderName: data.message.senderName,
            senderAvatar: data.message.senderAvatar || "",
            isCurrentUser: isActuallyCurrentUser
          }
          
          
          // Notify parent component of unread count change if message is from another user
          if (!newMsg.isCurrentUser && onUnreadCountChange) {
            
            onUnreadCountChange()
          }
          
          return [...prev, newMsg]
        })
      } else {
        
      }
    }

    // Listen for group updates
    const handleGroupUpdated = (data: {
      groupId: string;
      group: {
        id: string;
        name: string;
        description?: string;
        avatar?: string;
        memberCount: number;
      };
    }) => {
      if (data.groupId === groupId) {
        // You can update group info here if needed
        
      }
    }

    // Listen for unread count updates
    const handleUnreadCountUpdate = (data: {
      groupId?: string;
      conversationId?: string;
      unreadCount: number;
    }) => {
      if (data.groupId === groupId && onUnreadCountChange) {
        
        onUnreadCountChange()
      }
    }

    // Set up event listeners
    
    chatSocketService.onGroupMessage(handleGroupMessage)
    chatSocketService.onGroupUpdated(handleGroupUpdated)
    chatSocketService.onUnreadCountUpdate(handleUnreadCountUpdate)

    // Cleanup function
    return () => {
      
      chatSocketService.off('group-message')
      chatSocketService.off('group-updated')
      chatSocketService.off('unread-count-update')
    }
  }, [groupId, currentUserId])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          setError('Authentication required')
          return
        }

        const response = await fetchGroupMessages(groupId, token)
        
        if (response.success && response.messages) {
          // Convert API messages to local format
          const convertedMessages: Message[] = response.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            timestamp: formatMessageTime(msg.timestamp),
            senderId: msg.senderId,
            senderName: msg.senderName,
            senderAvatar: msg.senderAvatar || "",
            isCurrentUser: currentUserId ? String(msg.senderId) === String(currentUserId) : false
          }))
          
          setMessages(convertedMessages)
          
          // Mark messages as read
          await markGroupMessagesAsRead(groupId, token)
          
          // Notify parent component of unread count change
          if (onUnreadCountChange) {
            onUnreadCountChange()
          }
        } else {
          setError('Failed to load messages')
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch messages if we have the current user ID
    if (currentUserId) {
      fetchMessages()
    }
  }, [groupId, currentUserId])

  const formatMessageTime = (timestamp: string | Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && !sending) {
      try {
        setSending(true)
        
        // Send message via WebSocket for real-time delivery
        
        chatSocketService.sendGroupMessage(groupId, newMessage.trim())
        
        // Also send via REST API for persistence
        const token = getAuthToken()
        if (!token) {
          setError('Authentication required')
          return
        }

        const response = await sendGroupMessage(groupId, newMessage.trim(), token)
        
        if (response.success && response.message) {
          // Add the new message to the list (it will also come via WebSocket)
          const newMsg: Message = {
            id: response.message.id,
            text: response.message.content,
            timestamp: formatMessageTime(response.message.timestamp),
            senderId: response.message.senderId,
            senderName: response.message.senderName,
            senderAvatar: response.message.senderAvatar || "",
            isCurrentUser: true // This message is definitely from current user
          }
          
          setMessages(prev => {
            // Check if message already exists (from WebSocket)
            const messageExists = prev.some(msg => msg.id === response.message.id)
            if (messageExists) {
              
              return prev
            }
            
            
            return [...prev, newMsg]
          })
          
          setNewMessage("")
        } else {
          setError('Failed to send message')
        }
      } catch (error) {
        console.error('Error sending message:', error)
        setError('Failed to send message')
      } finally {
        setSending(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <img
              src={groupAvatar || "/images/profile.png"}
              alt={groupName}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <h1 className="text-xl font-medium">{groupName}</h1>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-white">Loading messages...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <img
              src={groupAvatar || "/images/profile.png"}
              alt={groupName}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <h1 className="text-xl font-medium">{groupName}</h1>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-400 text-center">
            <div className="mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-500 text-black px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
          onClick={onHeaderClick}
        >
          <img
            src={groupAvatar || getRandomDefaultAvatar()}
            alt={groupName}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
          <h1 className="text-xl font-medium">{groupName}</h1>
        </div>
        <MoreVertical className="w-6 h-6 cursor-pointer" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            // Show timestamp for first message or when time changes
            const showTimestamp = message.timestamp !== "" || index === 0
            const prevMessage = index > 0 ? messages[index - 1] : null
            const showTime = showTimestamp && (!prevMessage || prevMessage.timestamp !== message.timestamp)

            return (
              <div key={`${message.id}-${index}`}>
                {showTime && message.timestamp && (
                  <div className="text-center text-gray-400 text-sm mb-4">{message.timestamp}</div>
                )}
                <ChatMessage message={message} />
              </div>
            )
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Send a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full pr-12"
              disabled={sending}
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            className="bg-green-500 hover:bg-green-600 w-12 h-12 rounded-full p-0 disabled:opacity-50"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-black" />
            )}
          </Button>
        </div>
      </div>

      {/* Options Menu */}
      {showOptionsMenu && (
        <GroupOptionsMenu groupName={groupName} memberCount={memberCount} onClose={() => setShowOptionsMenu(false)} />
      )}
    </div>
  )
}
