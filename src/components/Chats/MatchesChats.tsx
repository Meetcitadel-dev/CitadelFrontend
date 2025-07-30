"use client"

import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import ChatItem from "./ChatItem"
import SearchBar from "./SearchBar"
import TabNavigation from "./TabNavigation"
import { fetchMatchedConversations } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

interface MatchesChatsProps {
  activeTab: "active" | "matches"
  setActiveTab: (tab: "active" | "matches") => void
  onChatSelect: (chatId: string, userId: string) => void
}

interface Conversation {
  id: string;
  userId: string;
  name: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  unreadCount: number;
}

export default function MatchesChats({ activeTab, setActiveTab, onChatSelect }: MatchesChatsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Remove duplicate conversations by id
  const uniqueConversations = Array.from(
    new Map(conversations.map(item => [item.id, item])).values()
  );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await fetchMatchedConversations(token)
        
        if (response.success) {
          setConversations(response.conversations)
        } else {
          setError('Failed to load matches')
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
        setError('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

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
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <div className="pb-20">
        <ChatHeader />
        <SearchBar />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={0} matchesCount={conversations.length} />
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading matches...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pb-20">
        <ChatHeader />
        <SearchBar />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={0} matchesCount={0} />
        <div className="flex items-center justify-center py-8">
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
    <div className="pb-20">
      <ChatHeader />
      <SearchBar />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={0} matchesCount={uniqueConversations.length} />
      <div className="space-y-0">
        {uniqueConversations.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No matches yet</div>
              <div className="text-sm">Start matching with people to see conversations here</div>
            </div>
          </div>
        ) : (
          uniqueConversations.map((conversation) => (
            <ChatItem
              key={conversation.id}
              name={conversation.name}
              message={conversation.lastMessage || "No messages yet"}
              time={conversation.lastMessageTime ? formatTime(conversation.lastMessageTime) : ""}
              avatar={conversation.profileImage || "/placeholder.svg?height=48&width=48"}
              isOnline={conversation.isOnline}
              unreadCount={conversation.unreadCount}
              onClick={() => onChatSelect(conversation.id, conversation.userId)}
            />
          ))
        )}
      </div>
    </div>
  )
}
