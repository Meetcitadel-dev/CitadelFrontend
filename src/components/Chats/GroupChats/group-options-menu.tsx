"use client"

interface GroupOptionsMenuProps {
  groupName: string
  memberCount: number
  onClose: () => void
  onAddMembers?: () => void
  onExitGroup?: () => void
  onMoveToMatches?: () => void
  onMuteNotifications?: () => void
}

export default function GroupOptionsMenu({ 
  groupName, 
  memberCount, 
  onClose,
  onAddMembers,
  onExitGroup,
  onMoveToMatches,
  onMuteNotifications
}: GroupOptionsMenuProps) {
  const menuOptions = [
    { label: "Add members", action: onAddMembers },
    { label: "Exit group", action: onExitGroup },
    { label: "Move to matches", action: onMoveToMatches },
    { label: "Mute notifications", action: onMuteNotifications }
  ]

  const handleOptionClick = (action?: () => void) => {
    if (action) {
      action()
    }
    onClose()
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 bg-gray-900 rounded-lg p-4 min-w-[200px]">
        {/* Group Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-green-400">EN</span>
          </div>
          <div>
            <h3 className="text-white font-medium">{groupName}</h3>
            <p className="text-gray-400 text-sm">{memberCount} members</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-1">
          {menuOptions.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 text-white hover:bg-gray-800 rounded transition-colors"
              onClick={() => handleOptionClick(option.action)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
