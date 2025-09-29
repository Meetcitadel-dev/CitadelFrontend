import { useState } from "react"
import { Search } from "lucide-react"
import SettingsHeader from "./settings-header"
import UserCard from "./user-card"


interface BlockedUsersScreenProps {
  onBack?: () => void
}

export default function BlockedUsersScreen({ onBack }: BlockedUsersScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<Array<{
    id: number
    name: string
    location: string
    profileImage: string
    isBlocked: boolean
  }>>([])

  const handleToggleBlock = (userId: number) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user)))
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Blocked Users" onBack={onBack} />
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-lg border-none outline-none"
          />
        </div>
      </div>
      <div>
        {users.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-400">
            No blocked users.
          </div>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              location={user.location}
              profileImage={user.profileImage}
              isBlocked={user.isBlocked}
              onToggleBlock={() => handleToggleBlock(user.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
