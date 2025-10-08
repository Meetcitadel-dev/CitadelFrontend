"use client"

interface NotificationTabsProps {
  activeTab: "requests" | "likes"
  onTabChange: (tab: "requests" | "likes") => void
  requestCount?: number
}

export default function NotificationTabs({ activeTab, onTabChange, requestCount }: NotificationTabsProps) {
  return (
    <div className="flex mx-4 mb-6" style={{ width: '361px', height: '38px' }}>
      <button
        onClick={() => onTabChange("requests")}
        className={`flex-1 px-4 rounded-l-full font-medium relative flex items-center justify-center ${
          activeTab === "requests" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
        }`}
        style={{ fontFamily: 'Inter', fontSize: '16px' }}
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
        className={`flex-1 px-4 rounded-r-full font-medium flex items-center justify-center ${
          activeTab === "likes" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
        }`}
        style={{ fontFamily: 'Inter', fontSize: '16px' }}
      >
        Likes
      </button>
    </div>
  )
}
