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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full justify-items-center">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="overflow-hidden cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full max-w-[180px] sm:max-w-[190px] md:max-w-[200px]"
          style={{
            backgroundColor: '#111111',
            borderRadius: '16px',
            border: '1px solid #292929',
            aspectRatio: '0.6'
          }}
          onClick={() => handleProfileClick(profile)}
        >
          <div className="relative flex justify-center items-center p-3" style={{ height: '60%' }}>
            <ProfileAvatar
              profileImage={profile.image}
              userId={profile.id.toString()}
              alt={profile.name}
              className="object-cover w-full h-full"
              style={{ borderRadius: '12px' }}
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full"
            >
              <span
                className="text-white text-sm font-semibold"
              >
                Year {profile.year}
              </span>
            </div>
          </div>

          <div className="px-3 pb-3 flex flex-col justify-between" style={{ height: '40%' }}>
            <div className="text-center space-y-1">
              <h3
                className="font-bold text-base sm:text-lg text-green-400 truncate"
              >
                {profile.name}
              </h3>

              <div className="flex items-center justify-center gap-1">
                <GraduationCap
                  className="w-3 h-3 flex-shrink-0 text-yellow-400"
                />
                <span
                  className="text-xs sm:text-sm text-green-400 truncate max-w-[90%]"
                  title={profile.university}
                >
                  {(() => {
                    const words = profile.university.trim().split(/\s+/);
                    if (words.length > 3) {
                      return words.slice(0, 3).join(' ') + '...';
                    }
                    return profile.university;
                  })()}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <ProfileActionButton
                status={profile.status}
                onClick={(e) => {
                  e?.stopPropagation()
                  const action = profile.status === 'connect' ? 'connect' :
                               profile.status === 'connected' ? 'remove' :
                               profile.status === 'request' ? 'accept' : 'connect'
                  handleConnectionAction(profile.id, action)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
