import { useState } from "react"
import Contactimg from '@/assets/1e10bdd1afdcc6bfb91f29a8440a94b1f71cf64b.png'
import ScaledCanvas from './ScaledCanvas'

interface FindFriendsScreenProps {
  onAllowContacts: () => void
  onSkip: () => void
}

export default function FindFriendsScreen({ onAllowContacts, onSkip }: FindFriendsScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAllowContacts = async () => {
    setIsLoading(true)
    // Simulate contact permission request
    try {
      // Here you would typically request contact permissions
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      onAllowContacts()
    } catch (error) {
      console.error('Contact permission error:', error)
      // Even if permission fails, continue to next screen
      onAllowContacts()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <ScaledCanvas>
      <div className="w-[390px] h-[844px] bg-black text-white flex flex-col">
             {/* Main content */}
               <div className="flex-1 flex flex-col">
          {/* Title with exact Figma specifications - positioned absolutely */}
                     <div 
             className="text-center px-4"
             style={{
               position: 'absolute',
               top: '72px',
               left: '50%',
               transform: 'translateX(-50%)',
               width: '251px',
               display: '-webkit-box',
               WebkitBoxOrient: 'vertical',
               WebkitLineClamp: 2,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               textAlign: 'center',
               zIndex: 10
             }}
           >
             <p 
               style={{
                 color: '#FFF',
                 textAlign: 'center',
                 fontFamily: '"Roboto Serif"',
                 fontSize: '36px',
                 fontStyle: 'normal',
                 fontWeight: 600,
                 lineHeight: 'normal',
                 margin: 0
               }}
             >
               Let's find your friends
             </p>
           </div>

          {/* Contact Image with exact Figma specifications */}
          <div 
            className="flex justify-center"
            style={{
              marginTop: '147px'
            }}
          >
            <div
              style={{
                width: '343px',
                height: '423px',
                flexShrink: 0,
                background: `url(${Contactimg}) transparent 50% / contain no-repeat`
              }}
            />
                    </div>

          {/* Bottom section with buttons */}
          <div className="mt-auto px-4 pb-6">
           {/* Skip Anyway Button - 16px above Allow button */}
           <div className="text-center mb-4">
             <button
               onClick={handleSkip}
               disabled={isLoading}
               className="text-center transition-all duration-200"
               style={{
                 background: 'transparent',
                 color: '#FFF',
                 border: 'none',
                 cursor: isLoading ? 'not-allowed' : 'pointer',
                 fontFamily: 'Inter',
                 fontSize: '17px',
                 fontStyle: 'normal',
                 fontWeight: 400,
                 lineHeight: '135%',
                 padding: 0
               }}
             >
               Skip anyways
             </button>
           </div>

                       {/* Allow Contacts Button - Bottom */}
            <div>
              <button
                onClick={handleAllowContacts}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-full text-lg font-semibold transition-all duration-200"
                style={{
                  background: isLoading ? '#232323' : '#22FF88',
                  color: isLoading ? '#888' : '#FFF',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontFamily: '"Roboto Serif", serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {isLoading ? 'Loading...' : 'Allow contacts'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScaledCanvas>
    )
  }
