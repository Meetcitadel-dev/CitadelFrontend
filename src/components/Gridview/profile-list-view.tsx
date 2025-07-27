import { X } from "lucide-react"

interface Profile {
  id: number
  name: string
  university: string
  year: string
  image: string
  status: "connect" | "remove" | "request" | "connected"
}

interface ProfileListViewProps {
  profiles: Profile[]
}

export function ProfileListView({ profiles }: ProfileListViewProps) {
  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex items-center gap-4 bg-gray-900 rounded-2xl p-4">
          <div className="relative">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-green-400 font-semibold text-lg mb-1">{profile.name}</h3>
            <p className="text-gray-400 text-sm">{profile.university}</p>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
