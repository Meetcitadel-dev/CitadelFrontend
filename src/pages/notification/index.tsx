"use client"

import { useState, useEffect } from "react"
import NotificationTabs from "@/components/Notification/NotificationTabs"
import Navbar from "@/components/Common/navbar";
import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationItem from "@/components/Notification/NotificationItem"
import RequestItem from "@/components/Notification/RequestItem"
import LoadingSpinner from "@/components/Notification/LoadingSpinner"
import { fetchNotifications, handleConnectionRequest } from "@/lib/api"
import type { ConnectionRequestNotification, AdjectiveNotification } from "@/types"

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<"requests" | "likes">("likes")
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestNotification[]>([])
  const [adjectiveNotifications, setAdjectiveNotifications] = useState<AdjectiveNotification[]>([])
  const [requestCount, setRequestCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        const response = await fetchNotifications(token || undefined)
        
        if (response.success) {
          setConnectionRequests(response.connectionRequests)
          setAdjectiveNotifications(response.adjectiveNotifications)
          setRequestCount(response.requestCount)
        } else {
          setError('Failed to load notifications')
        }
      } catch (err) {
        setError('Error loading notifications')
        console.error('Error fetching notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  // Handle accept connection request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      setProcessingRequest(requestId)
      const token = localStorage.getItem('token')
      const response = await handleConnectionRequest(
        { requestId, action: 'accept' },
        token || undefined
      )
      
      if (response.success) {
        // Update the request status in local state
        setConnectionRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: 'accepted' as const }
              : req
          )
        )
        // Update request count
        setRequestCount(prev => Math.max(0, prev - 1))
      } else {
        setError('Failed to accept request')
      }
    } catch (err) {
      setError('Error accepting request')
      console.error('Error accepting request:', err)
    } finally {
      setProcessingRequest(null)
    }
  }

  // Handle reject connection request
  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingRequest(requestId)
      const token = localStorage.getItem('token')
      const response = await handleConnectionRequest(
        { requestId, action: 'reject' },
        token || undefined
      )
      
      if (response.success) {
        // Update the request status in local state
        setConnectionRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: 'rejected' as const }
              : req
          )
        )
        // Update request count
        setRequestCount(prev => Math.max(0, prev - 1))
      } else {
        setError('Failed to reject request')
      }
    } catch (err) {
      setError('Error rejecting request')
      console.error('Error rejecting request:', err)
    } finally {
      setProcessingRequest(null)
    }
  }

  // Retry loading notifications
  const retryLoadNotifications = () => {
    setError(null)
    setLoading(true)
    // This will trigger the useEffect to reload
    setConnectionRequests([])
    setAdjectiveNotifications([])
    setRequestCount(0)
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white pt-4">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading notifications..." />
        </div>
        <Navbar navItems={navItems} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white pt-4">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div 
            className="text-red-500 text-center mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            {error}
          </div>
          <button 
            onClick={retryLoadNotifications}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
            style={{ fontFamily: 'Inter' }}
          >
            Try Again
          </button>
        </div>
        <Navbar navItems={navItems} />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white pt-4">
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      </div>

      <NotificationTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        requestCount={requestCount} 
      />

      <div className="pb-20">
        {activeTab === "likes" ? (
          <div>
            {adjectiveNotifications.length > 0 ? (
              adjectiveNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <div 
                className="text-center py-8 text-gray-400"
                style={{ fontFamily: 'Inter' }}
              >
                No adjective notifications yet
              </div>
            )}
          </div>
        ) : (
          <div>
            {connectionRequests.length > 0 ? (
              connectionRequests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  isProcessing={processingRequest === request.id}
                />
              ))
            ) : (
              <div 
                className="text-center py-8 text-gray-400"
                style={{ fontFamily: 'Inter' }}
              >
                No connection requests yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navbar navItems={navItems} />
    </div>
  )
}
