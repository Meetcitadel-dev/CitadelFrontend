"use client"

interface ChatItemProps {
  name: string
  message: string
  time: string
  avatar: string
  isOnline?: boolean
  onClick?: () => void
}

export default function ChatItem({ name, message, time, avatar, isOnline = false, onClick }: ChatItemProps) {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-900 cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img src={avatar || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-lg object-cover" />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
        )}
      </div>
      <div className="flex-1 ml-3">
        <div className="flex items-center justify-between">
          <h3 className="text-green-500 font-medium">{name}</h3>
          <span className="text-gray-400 text-sm">{time}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">{message}</p>
      </div>
      {isOnline && <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>}
    </div>
  )
}
