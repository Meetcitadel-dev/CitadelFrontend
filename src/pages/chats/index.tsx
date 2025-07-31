
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ActiveChats from "../../components/Chats/ActiveChats"
import MatchesChats from "../../components/Chats/MatchesChats"
import ChatConversation from "../../components/Chats/ChatConversation"
import Navbar from "../../components/Common/navbar"
import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { getConversationByUserId } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

export default function ChatApp() {
  const [activeTab, setActiveTab] = useState<"active" | "matches">("matches")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
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
          }
        } catch (error) {
          console.error('Error fetching conversation:', error);
        }
      };
      fetchConversation();
    }
  }, [searchParams]);

  if (selectedChat) {
    return (
      <ChatConversation 
        onBack={() => {
          setSelectedChat(null);
          setSelectedUserId(null);
          navigate('/chats');
        }} 
        conversationId={selectedChat}
        userId={selectedUserId || undefined}
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {activeTab === "active" ? (
        <ActiveChats activeTab={activeTab} setActiveTab={setActiveTab} onChatSelect={setSelectedChat} />
      ) : (
        <MatchesChats
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onChatSelect={(chatId, userId) => {
            setSelectedChat(chatId);
            setSelectedUserId(userId);
          }}
        />
      )}
      <Navbar navItems={navItems} />
    </div>
  )
}
