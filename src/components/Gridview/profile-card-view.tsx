import { ProfileActionButton } from "./profile-action-button"
import { GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfileAvatar from "@/components/Common/ProfileAvatar"

export interface Profile {
  id: number
  name: string
  university: string
  year: string
  image: string
  status: "connect" | "remove" | "request" | "requested" | "connected"
}

interface ProfileCardViewProps {
  profiles: Profile[]
  onConnectionAction?: (profileId: string, action: 'connect' | 'remove' | 'accept' | 'reject') => void
}

export function ProfileCardView({ profiles, onConnectionAction }: ProfileCardViewProps) {
  const navigate = useNavigate()
  
  const handleConnectionAction = (profileId: number, action: 'connect' | 'remove' | 'accept' | 'reject') => {
    if (onConnectionAction) {
      onConnectionAction(profileId.toString(), action)
    }
  }

  const handleProfileClick = (profile: Profile) => {
    // Navigate to the profile page using the name (lowercase, no spaces)
    const profileName = profile.name.toLowerCase().replace(/\s+/g, '')
    navigate(`/${profileName}`)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {profiles.map((profile) => (
        <div 
          key={profile.id} 
          className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          style={{ 
            width: '173px', 
            height: '289px',
            backgroundColor: '#111111',
            borderRadius: '12px',
            border: '1px solid #292929',
            borderImage: 'none'
          }}
          onClick={() => handleProfileClick(profile)}
        >
          <div className="relative flex justify-center items-center" style={{ height: '182px' }}>
            <ProfileAvatar
              profileImage={profile.image}
              userId={profile.id.toString()}
              alt={profile.name}
              className="object-cover"
              style={{ width: '143px', height: '152px', borderRadius: '12px' }}
              loading="lazy"
              decoding="async"
            />
            <div 
              className="absolute"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '8px'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600', // Semi Bold
                  fontSize: '15px',
                  lineHeight: 'auto',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}
              >
                Year {profile.year}
              </span>
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
                <GraduationCap 
                  className="w-3 h-3 flex-shrink-0" 
                  style={{ color: '#FBBC05' }}
                />
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'regular',
                    fontSize: '12px',
                    lineHeight: 'auto',
                    letterSpacing: '0%',
                    color: '#1BEA7B',
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
              onClick={(e) => {
                e.stopPropagation() // Prevent triggering profile navigation
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
