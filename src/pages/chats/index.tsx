
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ActiveChats from "../../components/Chats/ActiveChats"
import MatchesChats from "../../components/Chats/MatchesChats"
import ChatConversation from "../../components/Chats/ChatConversation"
import GroupChatApp from "../../components/Chats/GroupChats"
import GroupChatScreen from "../../components/Chats/GroupChats/group-chat-screen"
import EditGroupScreen from "../../components/Chats/GroupChats/edit-group-screen"
import Navbar from "../../components/Common/navbar"
import { Search, Calendar, MessageCircle, Bell, User, ArrowLeft } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { getConversationByUserId, fetchGroupChat } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import { chatSocketService } from "@/lib/socket"
import type { GroupChat } from "@/types"

export default function ChatApp() {
  const [activeTab, setActiveTab] = useState<"active" | "matches">("matches")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedChatType, setSelectedChatType] = useState<"individual" | "group">("individual")
  const [showGroupChat, setShowGroupChat] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null)
  const [showEditGroup, setShowEditGroup] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  // Initialize WebSocket connection when component mounts
  useEffect(() => {
    chatSocketService.connect()
    
    // Cleanup on unmount
    return () => {
      chatSocketService.disconnect()
    }
  }, [])

  // Handle URL parameters for direct chat access
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) {
      setSelectedUserId(userParam);
      // Fetch conversation for this user
      const fetchConversation = async () => {
        try {
          const token = getAuthToken();
          if (!token) return;

          const response = await getConversationByUserId(userParam, token);
          if (response.success && response.conversation) {
            setSelectedChat(response.conversation.id);
            setSelectedChatType("individual");
          }
        } catch (error) {
          console.error('Error fetching conversation:', error);
        }
      };
      fetchConversation();
    }
  }, [searchParams]);

  const handlePlusClick = () => {
    setShowGroupChat(true);
  };

  const handleGroupChatBack = () => {
    setShowGroupChat(false);
  };

  const handleGroupCreated = (groupId: string) => {
    // Group was created successfully, you can optionally refresh the chat list
    // or navigate to the group chat
    console.log('Group created:', groupId);
  };

  const handleChatSelect = async (chatId: string, isGroup?: boolean) => {
    setSelectedChat(chatId);
    setSelectedChatType(isGroup ? "group" : "individual");
    
    if (isGroup) {
      // Fetch group details for the group chat screen
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetchGroupChat(chatId, token);
        if (response.success && response.group) {
          setSelectedGroup(response.group);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    } else {
      setSelectedUserId(chatId); // For individual chats, chatId is the userId
    }
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
    setSelectedUserId(null);
    setSelectedChatType("individual");
    setSelectedGroup(null);
    setShowEditGroup(false);
  };

  const handleHeaderClick = (conversationInfo: any) => {
    if (selectedChatType === "group" && selectedGroup) {
      setShowEditGroup(true);
    } else if (conversationInfo?.name) {
      // For individual chats, navigate to user profile page using the name
      navigate(`/user-profile/${conversationInfo.name}`);
    }
  };

  const handleBackFromEditGroup = () => {
    setShowEditGroup(false);
  };

  if (showGroupChat) {
    return (
      <GroupChatApp 
        onBack={handleGroupChatBack}
        onGroupCreated={handleGroupCreated}
      />
    );
  }

  if (selectedChat) {
    // Show edit group if header was clicked for group chat (check this first)
    if (showEditGroup && selectedGroup) {
      return (
        <EditGroupScreen
          onBack={handleBackFromEditGroup}
          groupId={selectedChat!}
          onGroupUpdated={() => {
            // Optionally refresh the group data
            console.log('Group updated');
          }}
        />
      );
    }

    if (selectedChatType === "group" && selectedGroup) {
      return (
        <GroupChatScreen
          onBack={handleBackToChats}
          groupId={selectedChat}
          groupName={selectedGroup.name}
          groupAvatar={selectedGroup.avatar || ""}
          memberCount={selectedGroup.memberCount}
          onHeaderClick={() => setShowEditGroup(true)}
        />
      );
    }

    if (selectedChatType === "group" && !selectedGroup) {
      // Loading state for group
      return (
        <div className="bg-black min-h-screen text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-white mb-4">Loading group chat...</div>
            <button 
              onClick={handleBackToChats}
              className="bg-green-500 text-black px-4 py-2 rounded-lg"
            >
              Back to Chats
            </button>
          </div>
        </div>
      );
    }

    return (
      <ChatConversation 
        onBack={handleBackToChats} 
        conversationId={selectedChat}
        userId={selectedUserId || undefined}
        isFromMatches={activeTab === "matches"}
        isGroupChat={selectedChatType === "group"}
        onHeaderClick={handleHeaderClick}
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {activeTab === "active" ? (
        <ActiveChats 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onChatSelect={handleChatSelect}
          onPlusClick={handlePlusClick}
        />
      ) : (
        <MatchesChats
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onChatSelect={(chatId, userId) => {
            setSelectedChat(chatId);
            setSelectedUserId(userId);
            setSelectedChatType("individual");
          }}
          onPlusClick={handlePlusClick}
        />
      )}
      <Navbar navItems={navItems} />
    </div>
  )
}
