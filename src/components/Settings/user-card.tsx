
import ProfileAvatar from "@/components/Common/ProfileAvatar"

interface UserCardProps {
  name: string
  location: string
  profileImage: string
  userId: string
  isBlocked: boolean
  onToggleBlock: () => void
}

export default function UserCard({ name, location, profileImage, userId, isBlocked, onToggleBlock }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <ProfileAvatar
            profileImage={profileImage}
            userId={userId}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-green-400 text-base font-medium">{name}</h3>
          <p className="text-gray-400 text-sm">{location}</p>
        </div>
      </div>
      <button
        onClick={onToggleBlock}
        className={`px-4 py-2 rounded-md text-sm font-medium border ${
          isBlocked ? "border-red-500 text-red-500 bg-transparent" : "border-green-500 text-green-500 bg-transparent"
        }`}
      >
        {isBlocked ? "Unblock" : "Block"}
      </button>
    </div>
  )
}
