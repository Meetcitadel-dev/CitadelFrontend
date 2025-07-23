"use client"

import { useState } from "react"
import NotificationTabs from "@/components/Notification/NotificationTabs"
import Navbar from "@/components/Common/navbar";
import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "@/components/Notification/NotificationItem"
import RequestItem from "@/components/Notification/RequestItem"

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<"requests" | "likes">("likes")
  const navigate = useNavigate();

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: false },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: false },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: false },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: true },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: false },
  ];

  const notifications = [
    { count: 12, text: "found you", highlight: "funny", timeAgo: "Tap to find out who!" },
    { count: 15, text: "found you", highlight: "creative", timeAgo: "2 days ago" },
    { count: 54, text: "found you", highlight: "handsome", timeAgo: "9 hours ago" },
    { count: 22, text: "found you", highlight: "nice", timeAgo: "1 day ago" },
  ]

  const requests = [
    { name: "Deniyal Shifer", location: "IIT Delhi", isConnected: false },
    { name: "Aisha Kumar", location: "IIT Bombay", isConnected: false },
    { name: "Rahul Verma", location: "IIT Kanpur", isConnected: false },
    { name: "Meena Reddy", location: "IIT Madras", isConnected: false },
    { name: "Deniyal Shifer", location: "IIT Delhi", isConnected: true },
  ]

  return (
    <div className="bg-black min-h-screen text-white pt-4">
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      </div>

      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} requestCount={12} />

      <div className="pb-20">
        {activeTab === "likes" ? (
          <div>
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                count={notification.count}
                text={notification.text}
                highlight={notification.highlight}
                timeAgo={notification.timeAgo}
              />
            ))}
          </div>
        ) : (
          <div>
            {requests.map((request, index) => (
              <RequestItem
                key={index}
                name={request.name}
                location={request.location}
                isConnected={request.isConnected}
                onAccept={() => console.log("Accept", request.name)}
                onReject={() => console.log("Reject", request.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navbar navItems={navItems} />
    </div>
  )
}
