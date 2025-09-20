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
          <div className="text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[80%]" style={{ backgroundColor: '#133422' }}>
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
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className="text-white rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]" style={{ backgroundColor: '#1C1C1C' }}>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    )
  }
  