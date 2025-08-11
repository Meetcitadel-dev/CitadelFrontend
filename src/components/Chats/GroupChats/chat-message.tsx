interface Message {
    id: string
    text: string
    timestamp: string
    senderId: string
    senderName: string
    senderAvatar: string
    isCurrentUser: boolean
  }
  
  interface ChatMessageProps {
    message: Message
  }
  
  export default function ChatMessage({ message }: ChatMessageProps) {
    if (message.isCurrentUser) {
      // Current user's messages (right side, green)
      return (
        <div className="flex justify-end">
          <div className="bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[80%]">
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      )
    }
  
    // Other users' messages (left side, gray with profile picture)
    return (
      <div className="flex items-start gap-2">
        <img
          src={message.senderAvatar || "/placeholder.svg"}
          alt={message.senderName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="bg-gray-800 text-white rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]">
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    )
  }
  