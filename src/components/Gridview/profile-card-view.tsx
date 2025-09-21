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
  onConnectionAction?: (profileId: string, action: 'connect' | 'remove' | 'accept' | 'reject') => void
}

export function ProfileCardView({ profiles, onConnectionAction }: ProfileCardViewProps) {
  const handleConnectionAction = (profileId: number, action: 'connect' | 'remove' | 'accept' | 'reject') => {
    if (onConnectionAction) {
      onConnectionAction(profileId.toString(), action)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {profiles.map((profile) => (
        <div 
          key={profile.id} 
          className="bg-gray-900 rounded-2xl overflow-hidden"
          style={{ width: '173px', height: '289px' }}
        >
          <div className="relative">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={173}
              height={200}
              className="w-full object-cover"
              style={{ height: '200px' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-white text-xs font-medium">{profile.year}</span>
            </div>
          </div>

          <div className="p-3" style={{ height: '89px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="text-green-400 font-semibold text-sm mb-1 truncate">{profile.name}</h3>

              <div className="flex items-center gap-1 mb-2">
                <GraduationCap className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <span
                  className="text-gray-300 text-xs"
                  style={{
                    maxWidth: '120px',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
            </div>

            <ProfileActionButton 
              status={profile.status} 
              onClick={() => {
                const action = profile.status === 'connect' ? 'connect' : 
                             profile.status === 'connected' ? 'remove' : 
                             profile.status === 'request' ? 'accept' : 'connect'
                handleConnectionAction(profile.id, action)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
