import { useState, useEffect } from "react"
import ResponsiveChatList from "@/components/Chat/ResponsiveChatList"
import ResponsiveChatInterface from "@/components/Chat/ResponsiveChatInterface"
import ResponsiveButton from "@/components/ui/ResponsiveButton"
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  PlusIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline"
import { getCurrentUserProfile } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import { chatSocketService } from "@/lib/socket"

interface ChatConversation {
  id: string;
  userId: string;
  name: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  unreadCount: number;
}

export default function ChatApp() {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [showChatList, setShowChatList] = useState(true)

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await getCurrentUserProfile(token)
        if (response.success) {
          // Join user room for global notifications
          chatSocketService.joinUserRoom(response.data.id.toString())
        }
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }

    getCurrentUser()
  }, [])

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setShowChatList(false)
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    setShowChatList(true)
  }

  const handleCreateGroup = () => {
    // TODO: Implement group creation
    console.log('Create group chat')
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/50 backdrop-blur-md">
        {selectedConversation ? (
          <div className="flex items-center gap-3">
            <ResponsiveButton
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="lg:hidden hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </ResponsiveButton>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Chats</h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Chats</h1>
            </div>
            <div className="flex gap-2">
              <ResponsiveButton
                variant="outline"
                size="sm"
                onClick={handleCreateGroup}
                className="hidden sm:flex items-center gap-2 border-green-500/50 hover:bg-green-500/10 hover:border-green-500"
              >
                <UserGroupIcon className="h-4 w-4" />
                <span>New Group</span>
              </ResponsiveButton>
              <ResponsiveButton
                variant="outline"
                size="sm"
                onClick={handleCreateGroup}
                className="sm:hidden border-green-500/50 hover:bg-green-500/10"
              >
                <PlusIcon className="h-4 w-4" />
              </ResponsiveButton>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List - Desktop Sidebar / Mobile Full Screen */}
        <div className={`${
          showChatList
            ? 'flex'
            : 'hidden lg:flex'
        } w-full lg:w-80 xl:w-96 flex-col border-r border-white/10 bg-black/30`}>
          <ResponsiveChatList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        {/* Chat Interface - Desktop Main / Mobile Full Screen */}
        <div className={`${
          selectedConversation
            ? 'flex'
            : 'hidden lg:flex'
        } flex-1 flex-col bg-black`}>
          {selectedConversation ? (
            <ResponsiveChatInterface
              conversationId={selectedConversation.id}
              userId={selectedConversation.userId}
              userName={selectedConversation.name}
              userAvatar={selectedConversation.profileImage}
              isOnline={selectedConversation.isOnline}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="mb-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Select a conversation</h3>
                <p className="text-white/70 text-sm sm:text-base">
                  Choose a conversation from the list to start chatting with your connections
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}