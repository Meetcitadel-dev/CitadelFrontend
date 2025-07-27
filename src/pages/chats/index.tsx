
import { useState } from "react"
import ActiveChats from "../../components/Chats/ActiveChats"
import MatchesChats from "../../components/Chats/MatchesChats"
import ChatConversation from "../../components/Chats/ChatConversation"
import Navbar from "../../components/Common/navbar"
import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function ChatApp() {
  const [activeTab, setActiveTab] = useState<"active" | "matches">("matches")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  if (selectedChat) {
    return <ChatConversation onBack={() => setSelectedChat(null)} />
  }

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {activeTab === "active" ? (
        <ActiveChats activeTab={activeTab} setActiveTab={setActiveTab} onChatSelect={setSelectedChat} />
      ) : (
        <MatchesChats activeTab={activeTab} setActiveTab={setActiveTab} onChatSelect={setSelectedChat} />
      )}
      <Navbar navItems={navItems} />
    </div>
  )
}
