import { Plus } from "lucide-react"

interface ChatHeaderProps {
  onPlusClick?: () => void
}

export default function ChatHeader({ onPlusClick }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="text-2xl font-bold text-white">Messages</h1>
      <button 
        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
        onClick={onPlusClick}
      >
        <Plus className="w-5 h-5 text-black" />
      </button>
    </div>
  )
}
