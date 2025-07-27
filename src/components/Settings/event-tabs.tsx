

interface EventTabsProps {
  activeTab: "upcoming" | "past"
  onTabChange: (tab: "upcoming" | "past") => void
}

export default function EventTabs({ activeTab, onTabChange }: EventTabsProps) {
  return (
    <div className="flex gap-8 px-4 mb-6">
      <button
        onClick={() => onTabChange("upcoming")}
        className={`pb-2 text-base font-medium relative ${activeTab === "upcoming" ? "text-white" : "text-gray-400"}`}
      >
        Upcoming
        {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
      </button>
      <button
        onClick={() => onTabChange("past")}
        className={`pb-2 text-base font-medium relative ${activeTab === "past" ? "text-white" : "text-gray-400"}`}
      >
        Past
        {activeTab === "past" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
      </button>
    </div>
  )
}
