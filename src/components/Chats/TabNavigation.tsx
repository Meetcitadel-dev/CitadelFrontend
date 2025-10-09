"use client"

interface TabNavigationProps {
  activeTab: "active" | "matches"
  setActiveTab: (tab: "active" | "matches") => void
  activeCount?: number
  matchesCount?: number
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  activeCount = 12,
  matchesCount = 1,
}: TabNavigationProps) {
  return (
    <div className="mx-4 mb-6" style={{ width: '361px', height: '38px' }}>
      <div className="relative rounded-full p-1 h-full" style={{ backgroundColor: '#1C1C1C' }}>
        <div
          className="absolute left-1 rounded-full transition-transform duration-300 ease-out"
          style={{
            backgroundColor: '#111111',
            width: 'calc(50% - 0.25rem)',
            height: '34px',
            top: '2px',
            transform: activeTab === "active" ? 'translateX(0.03125rem)' : 'translateX(calc(100% + 0.125rem))',
          }}
        />

        <div className="relative grid grid-cols-2 h-full">
          <button
            onClick={() => setActiveTab("active")}
            className="relative z-10 flex items-center justify-center px-4 font-normal"
            style={{ fontFamily: 'Inter', fontSize: '16px' }}
          >
            <span className={activeTab === "active" ? "text-white" : "text-gray-400"}>
              Active
            </span>
            {activeCount > 0 && (
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
                {activeCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className="relative z-10 flex items-center justify-center px-4 font-normal"
            style={{ fontFamily: 'Inter', fontSize: '16px' }}
          >
            <span className={activeTab === "matches" ? "text-white" : "text-gray-400"}>
              Matches
            </span>
            {matchesCount > 0 && (
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
                {matchesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
