"use client"

import { Plus } from "lucide-react"
import { Button } from "../../ui/button"
import ProfileAvatar from "@/components/Common/ProfileAvatar"

interface Connection {
  id: string
  name: string
  location: string
  avatar?: string
}

interface ConnectionItemProps {
  connection: Connection
  isSelected: boolean
  onAdd: () => void
}

export default function ConnectionItem({ connection, isSelected, onAdd }: ConnectionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-900">
      <div className="flex items-center gap-3">
        <ProfileAvatar
          profileImage={connection.avatar}
          userId={connection.id}
          alt={connection.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-green-400 font-medium">{connection.name}</h3>
          <p className="text-gray-400 text-sm">{connection.location}</p>
        </div>
      </div>
      <Button
        onClick={onAdd}
        size="sm"
        className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black w-8 h-8 p-0 rounded"
        disabled={isSelected}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
