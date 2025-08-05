"use client"

interface ChatDropdownProps {
  onClose: () => void
  onBlockUser: () => void
  onMoveToActive?: () => void
  showMoveToActive?: boolean
}

export default function ChatDropdown({ onClose, onBlockUser, onMoveToActive, showMoveToActive = false }: ChatDropdownProps) {
  const handleOptionClick = (option: string) => {
    if (option === "Block user") {
      onBlockUser()
    } else if (option === "Move to active" && onMoveToActive) {
      onMoveToActive()
    } else {
      // Handle other options
      console.log(`Selected: ${option}`)
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Menu - positioned in corner */}
      <div className="absolute top-14 right-4 z-50 bg-gray-900 rounded-lg shadow-lg border border-gray-700 w-48">
        <div className="py-1">
          {showMoveToActive && (
            <button
              onClick={() => handleOptionClick("Move to active")}
              className="w-full px-4 py-2.5 text-left text-white text-sm hover:bg-gray-800 transition-colors"
            >
              Move to active
            </button>
          )}
          <button
            onClick={() => handleOptionClick("Block user")}
            className="w-full px-4 py-2.5 text-left text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Block user
          </button>
          <button
            onClick={() => handleOptionClick("Report user")}
            className="w-full px-4 py-2.5 text-left text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Report user
          </button>
          <button
            onClick={() => handleOptionClick("Mute notifications")}
            className="w-full px-4 py-2.5 text-left text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Mute notifications
          </button>
        </div>
      </div>
    </>
  )
}
