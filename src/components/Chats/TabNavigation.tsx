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
    <div className="px-4 mb-6">
      <div className="flex bg-gray-800 rounded-full p-1">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "active" ? "bg-green-500 text-black" : "text-gray-400"
          }`}
        >
          Active
          {activeTab === "active" && activeCount > 0 && (
            <span className="bg-black text-green-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "matches" ? "bg-green-500 text-black" : "text-gray-400"
          }`}
        >
          Matches
          {activeTab === "matches" && matchesCount > 0 && (
            <span className="bg-black text-green-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
