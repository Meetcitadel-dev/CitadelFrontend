
// import ChatHeader from "./ChatHeader"
// import SearchBar from "./SearchBar"
// import TabNavigation from "./TabNavigation"
// import ChatItem from "./ChatItem"
// import BottomNavigation from "./BottomNavigation"

import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import ChatItem from "./ChatItem"
import SearchBar from "./SearchBar"
import TabNavigation from "./TabNavigation"
import { fetchActiveConversations, fetchGroupChats } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import type { GroupChat } from "@/types"

interface ActiveChatsProps {
  activeTab: "active" | "matches"
  setActiveTab: (tab: "active" | "matches") => void
  onChatSelect: (chatId: string, isGroup?: boolean) => void
  onPlusClick?: () => void
  // Provide a way for parent to receive a function to update unread counts locally
  onUnreadCountUpdate?: (fn: (chatId: string, unreadCount: number, isGroup: boolean) => void) => void
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

interface ChatItem {
  id: string;
  name: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isGroup: boolean;
  isOnline?: boolean;
}

export default function ActiveChats({ activeTab, setActiveTab, onChatSelect, onPlusClick, onUnreadCountUpdate }: ActiveChatsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [groupChats, setGroupChats] = useState<GroupChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        // Fetch both individual conversations and group chats
        const [conversationsResponse, groupsResponse] = await Promise.all([
          fetchActiveConversations(token),
          fetchGroupChats(token)
        ])
        
        if (conversationsResponse.success) {
          // Sort conversations by lastMessageTime (latest first)
          const sortedConversations = conversationsResponse.conversations.sort((a, b) => {
            if (!a.lastMessageTime && !b.lastMessageTime) return 0;
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
          });
          setConversations(sortedConversations)
        }

        if (groupsResponse.success) {
          // Sort group chats by lastMessageTime (latest first)
          const sortedGroupChats = groupsResponse.groups.sort((a, b) => {
            if (!a.lastMessage?.timestamp && !b.lastMessage?.timestamp) return 0;
            if (!a.lastMessage?.timestamp) return 1;
            if (!b.lastMessage?.timestamp) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
          });
          setGroupChats(sortedGroupChats)
        }

        if (!conversationsResponse.success && !groupsResponse.success) {
          setError('Failed to load conversations')
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
        setError('Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Remove refreshTrigger dependency

  // Function to update unread count locally (WhatsApp-style)
  const updateUnreadCount = (chatId: string, unreadCount: number, isGroup: boolean) => {
    if (isGroup) {
      setGroupChats(prev => prev.map(group => 
        group.id === chatId ? { ...group, unreadCount } : group
      ))
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === chatId ? { ...conv, unreadCount } : conv
      ))
    }
  }

  // Expose the update function to parent component (parent should store it as a value)
  useEffect(() => {
    if (onUnreadCountUpdate) {
      // Pass a stable wrapper; no dependencies so it won't change every render
      onUnreadCountUpdate((chatId, unreadCount, isGroup) => {
        updateUnreadCount(chatId, unreadCount, isGroup)
      })
    }
  }, [onUnreadCountUpdate])

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

  // Combine and sort all chats (individual conversations + group chats)
  // First, let's check if conversations already include groups to avoid duplicates
  const individualConversations = conversations.filter(conv => !conv.id.startsWith('group_'));
  const existingGroupIds = new Set(individualConversations.map(conv => conv.id));
  
  // Only add group chats that don't already exist in conversations
  const uniqueGroupChats = groupChats.filter(group => !existingGroupIds.has(group.id));
  
  const allChats: ChatItem[] = [
    ...individualConversations.map(conv => ({
      id: conv.id,
      name: conv.name,
      profileImage: conv.profileImage,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      isGroup: false,
      isOnline: conv.isOnline
    })),
    ...uniqueGroupChats.map(group => ({
      id: group.id,
      name: group.name,
      profileImage: group.avatar,
      lastMessage: group.lastMessage?.content,
      lastMessageTime: group.lastMessage?.timestamp ? new Date(group.lastMessage.timestamp).toISOString() : undefined,
      unreadCount: group.unreadCount,
      isGroup: true,
      isOnline: false
    }))
  ].sort((a, b) => {
    if (!a.lastMessageTime && !b.lastMessageTime) return 0;
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  // Remove any remaining duplicates by ID
  const uniqueChats = allChats.filter((chat, index, self) => 
    index === self.findIndex(c => c.id === chat.id)
  );

  if (loading) {
    return (
      <div className="pb-20">
        <ChatHeader onPlusClick={onPlusClick} />
        <SearchBar />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={uniqueChats.length} matchesCount={0} />
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading conversations...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pb-20">
        <ChatHeader onPlusClick={onPlusClick} />
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
      <ChatHeader onPlusClick={onPlusClick} />
      <SearchBar />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={uniqueChats.length} matchesCount={0} />
      <div className="space-y-0">
        {uniqueChats.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No active conversations</div>
              <div className="text-sm">Start connecting with people to see conversations here</div>
            </div>
          </div>
        ) : (
          uniqueChats.map((chat) => (
            <ChatItem
              key={chat.id}
              name={chat.name}
              message={chat.lastMessage || "No messages yet"}
              time={chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ""}
              avatar={chat.profileImage || "/placeholder.svg?height=48&width=48"}
              isOnline={chat.isOnline || false}
              unreadCount={chat.unreadCount}
              onClick={() => onChatSelect(chat.id, chat.isGroup)}
            />
          ))
        )}
      </div>
    </div>
  )
}
