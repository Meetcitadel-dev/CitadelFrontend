

import { useState } from "react"
import CreateGroupScreen from "./create-group-screen"
import EditGroupScreen from "./edit-group-screen"

interface GroupChatAppProps {
  onBack: () => void
  onGroupCreated?: (groupId: string) => void
}

export default function GroupChatApp({ onBack, onGroupCreated }: GroupChatAppProps) {
  const [currentScreen, setCurrentScreen] = useState<"create" | "edit">("create")
  const [groupId, setGroupId] = useState<string>("")

  const handleGroupCreated = (newGroupId: string) => {
    setGroupId(newGroupId)
    setCurrentScreen("edit")
    onGroupCreated?.(newGroupId)
  }

  const handleBackToCreate = () => {
    setCurrentScreen("create")
    setGroupId("")
  }

  const handleBackToChats = () => {
    onBack()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {currentScreen === "create" ? (
        <CreateGroupScreen 
          onBack={handleBackToChats} 
          onGroupCreated={handleGroupCreated} 
        />
      ) : (
        <EditGroupScreen 
          onBack={handleBackToCreate} 
          groupId={groupId}
          onGroupUpdated={() => {
            // Optionally refresh the chat list
            onGroupCreated?.(groupId)
          }}
        />
      )}
    </div>
  )
}
