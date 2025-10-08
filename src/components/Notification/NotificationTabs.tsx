"use client"

interface NotificationTabsProps {
  activeTab: "requests" | "likes"
  onTabChange: (tab: "requests" | "likes") => void
  requestCount?: number
}

export default function NotificationTabs({ activeTab, onTabChange, requestCount }: NotificationTabsProps) {
  return (
    <div className="mx-4 mb-6" style={{ width: '361px', height: '38px' }}>
      {/* Outer pill container with sliding background */}
      <div className="relative rounded-full p-1 h-full" style={{ backgroundColor: '#1C1C1C' }}>
        {/* Sliding background indicator */}
        <div
          className="absolute left-1 rounded-full transition-transform duration-300 ease-out"
          style={{
            backgroundColor: '#111111',
            width: 'calc(50% - 0.25rem)',
            height: '34px',
            top: '2px',
            transform: activeTab === "requests" ? 'translateX(0.03125rem)' : 'translateX(calc(100% + 0.125rem))',
          }}
        />
        
        {/* Button container */}
        <div className="relative grid grid-cols-2 h-full">
          <button
            onClick={() => onTabChange("requests")}
            className="relative z-10 flex items-center justify-center px-4 font-normal"
            style={{ fontFamily: 'Inter', fontSize: '16px' }}
          >
            <span className={activeTab === "requests" ? "text-white" : "text-gray-400"}>
              Requests
            </span>
            {requestCount && requestCount > 0 && (
              <span 
                className="inline-flex items-center justify-center text-sm font-semibold leading-none ml-2"
                style={{ 
                  fontFamily: 'Inter',
                  width: '24px',
                  height: '20px',
                  padding: '2px 7px',
                  borderRadius: '30px',
                  backgroundColor: '#1BEA7B',
                  color: 'black'
                }}
              >
                {requestCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("likes")}
            className="relative z-10 flex items-center justify-center px-4 font-normal"
            style={{ fontFamily: 'Inter', fontSize: '16px' }}
          >
            <span className={activeTab === "likes" ? "text-white" : "text-gray-400"}>
              Likes
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
