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
          className="overflow-hidden"
          style={{ 
            width: '173px', 
            height: '289px',
            backgroundColor: '#111111',
            borderRadius: '12px',
            border: '1px solid #292929',
            borderImage: 'none'
          }}
        >
          <div className="relative flex justify-center items-center" style={{ height: '182px' }}>
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={143}
              height={152}
              className="object-cover"
              style={{ width: '143px', height: '152px', borderRadius: '12px' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-white text-xs font-medium">{profile.year}</span>
            </div>
          </div>

          <div className="px-3 pb-3" style={{ height: '107px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="text-center">
              <h3 
                className="mb-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  lineHeight: 'auto',
                  letterSpacing: '0%',
                  color: '#1BEA7B',
                  textAlign: 'center'
                }}
              >
                {profile.name}
              </h3>

              <div className="flex items-center justify-center gap-1 mb-2">
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
