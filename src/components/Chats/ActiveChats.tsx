
// import ChatHeader from "./ChatHeader"
// import SearchBar from "./SearchBar"
// import TabNavigation from "./TabNavigation"
// import ChatItem from "./ChatItem"
// import BottomNavigation from "./BottomNavigation"

import ChatHeader from "./ChatHeader"
import ChatItem from "./ChatItem"
import SearchBar from "./SearchBar"
import TabNavigation from "./TabNavigation"

interface ActiveChatsProps {
  activeTab: "active" | "matches"
  setActiveTab: (tab: "active" | "matches") => void
  onChatSelect: (chatId: string) => void
}

export default function ActiveChats({ activeTab, setActiveTab, onChatSelect }: ActiveChatsProps) {
  const activeChatsData = [
    {
      id: "1",
      name: "Alexandra Daddario",
      message: "Request Sent!",
      time: "10:30 AM",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    {
      id: "2",
      name: "Benedict Cumberbatch",
      message: "Let's catch up later.",
      time: "9:15 AM",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    {
      id: "3",
      name: "Chris Hemsworth",
      message: "See you soon!",
      time: "Yesterday",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    {
      id: "4",
      name: "Daisy Ridley",
      message: "Can you send me the files?",
      time: "Yesterday",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: true,
    },
    {
      id: "5",
      name: "Emma Stone",
      message: "Got it, thanks!",
      time: "2 days ago",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
    {
      id: "6",
      name: "Finn Wolfhard",
      message: "Perfect!",
      time: "2 days ago",
      avatar: "/placeholder.svg?height=48&width=48",
      isOnline: false,
    },
  ]

  return (
    <div className="pb-20">
      <ChatHeader />
      <SearchBar />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} activeCount={12} matchesCount={1} />
      <div className="space-y-0">
        {activeChatsData.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            message={chat.message}
            time={chat.time}
            avatar={chat.avatar}
            isOnline={chat.isOnline}
            onClick={() => onChatSelect(chat.id)}
          />
        ))}
      </div>
      {/* <BottomNavigation /> */}
    </div>
  )
}
