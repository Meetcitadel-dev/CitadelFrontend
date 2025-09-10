"use client"

interface NotificationTabsProps {
  activeTab: "requests" | "likes"
  onTabChange: (tab: "requests" | "likes") => void
  requestCount?: number
}

export default function NotificationTabs({ activeTab, onTabChange, requestCount }: NotificationTabsProps) {
  return (
    <div className="flex mx-4 mb-6">
      <button
        onClick={() => onTabChange("requests")}
        className={`flex-1 py-3 px-4 rounded-l-full text-sm font-medium relative ${
          activeTab === "requests" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
        }`}
        style={{ fontFamily: 'Inter' }}
      >
        Requests
        {requestCount && requestCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            style={{ fontFamily: 'Inter' }}
          >
            {requestCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange("likes")}
        className={`flex-1 py-3 px-4 rounded-r-full text-sm font-medium ${
          activeTab === "likes" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
        }`}
        style={{ fontFamily: 'Inter' }}
      >
        Likes
      </button>
    </div>
  )
}
