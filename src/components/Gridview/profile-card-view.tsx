import { ProfileActionButton } from "./profile-action-button"
import { GraduationCap } from "lucide-react"

export interface Profile {
  id: number
  name: string
  university: string
  year: string
  image: string
  status: "connect" | "remove" | "request" | "connected"
}

interface ProfileCardViewProps {
  profiles: Profile[]
}

export function ProfileCardView({ profiles }: ProfileCardViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {profiles.map((profile) => (
        <div key={profile.id} className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={200}
              height={240}
              className="w-full h-60 object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-white text-sm font-medium">{profile.year}</span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-green-400 font-semibold text-lg mb-1">{profile.name}</h3>

            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              <span
                className="text-gray-300 text-sm"
                style={{
                  maxWidth: '120px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '1rem',
                }}
                title={profile.university}
              >
                {(() => {
                  const words = profile.university.trim().split(/\s+/);
                  if (words.length > 3) {
                    // Truncate to first 3 words and add ellipsis
                    return words.slice(0, 3).join(' ') + '...';
                  }
                  return profile.university;
                })()}
              </span>
            </div>

            <ProfileActionButton status={profile.status} />
          </div>
        </div>
      ))}
    </div>
  )
}
