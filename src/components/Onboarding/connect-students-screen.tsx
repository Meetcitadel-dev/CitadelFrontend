import Rectangle4 from '@/assets/Rectangle 4.png'
import Rectangle2 from '@/assets/Rectangle 2.png'
import Rectangle1 from '@/assets/a man teaching, realistic man image, cinemtic, man wearing casual clothes.png'
import Rectangle3 from '@/assets/Rectangle 3.png'
import wavy2Svg from '@/assets/wavy2.svg'
import { useEffect, useState } from 'react'

interface ConnectStudentsScreenProps {
  onContinue: () => void
  onLogin: () => void
}

export default function ConnectStudentsScreen({ onContinue, onLogin }: ConnectStudentsScreenProps) {
  // Design reference size (based on the Figma/static layout)
  const DESIGN_WIDTH = 390
  const DESIGN_HEIGHT = 844

  const [scale, setScale] = useState(1)

  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth
      const scaleX = vw / DESIGN_WIDTH
      // Fill width to avoid left/right gaps; allow vertical overflow (clipped at top)
      // This keeps the wavy bottom aligned to viewport bottom when we anchor the canvas
      const s = scaleX
      setScale(s)
    }
    computeScale()
    window.addEventListener('resize', computeScale)
    return () => window.removeEventListener('resize', computeScale)
  }, [])
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Scaled design canvas to keep proportions constant across screens */}
      <div
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'bottom center'
        }}
      >
      {/* Profile Images Container */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '52px',
          width: '286px',
          height: '345px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Rectangle 4 - positioned at 42px from top, 36px from left */}
        <div
          style={{
            position: 'absolute',
            top: '42px',
            left: '36px',
            width: '102px',
            height: '134px',
            borderRadius: '60px 60px 0 60px',
            background: `url(${Rectangle4}) lightgray 0px -1.892px / 100% 114.253% no-repeat`,
            flexShrink: 0
          }}
        />

        {/* Rectangle 1 - positioned at top-right corner, touching top and right sides */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '133.451px',
            height: '176px',
            borderRadius: '60px 60px 60px 0',
            background: `url(${Rectangle1}) lightgray 50% / cover no-repeat`,
            flexShrink: 0,
            aspectRatio: '69/91'
          }}
        />
        
        {/* Rectangle 2 - positioned at bottom-left corner, touching bottom and left sides */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '138px',
            height: '159px',
            borderRadius: '60px 0 60px 60px',
            background: `url(${Rectangle2}) lightgray 50% / cover no-repeat`,
            flexShrink: 0
          }}
        />

        {/* Rectangle 3 - positioned 40.5px from right, 37px from bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '37px',
            right: '40.5px',
            width: '93px',
            height: '122px',
            borderRadius: '0 60px 60px 60px',
            background: `url(${Rectangle3}) lightgray 50% / cover no-repeat`,
            flexShrink: 0
          }}
        />

        {/* Decorative SVG - positioned 157px from top, 19px from left */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="21" 
          viewBox="0 0 18 21" 
          fill="none"
          style={{
            position: 'absolute',
            top: '157px',
            left: '19px'
          }}
        >
          <path d="M1 20.0909L16.8182 1" stroke="white"/>
          <path d="M1.00005 9.99981L15.7276 10.818" stroke="white"/>
          <path d="M6.85301 3.19041L13.0001 18.4545" stroke="white"/>
        </svg>
      </div>

      {/* Text Container - 30px below the image container */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '427px', // 52px (image container top) + 345px (image container height) + 30px (gap)
          width: '344px',
          height: '142px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <h1 
          style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"Roboto Serif"',
            fontSize: '36px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '44px',
            flexShrink: 0,
            margin: 0,
            padding: 0,
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          Connect with<br />
          students across<br />
          universities
        </h1>
      </div>

      {/* Let's go Button - 20px below the text container */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '589px', // 427px (text container top) + 142px (text container height) + 20px (gap)
          display: 'flex',
          width: '238px',
          height: '50px',
          padding: '14.5px 16px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          borderRadius: '48px',
          background: '#1BEA7B',
          zIndex: 10
        }}
      >
        <button
          onClick={onContinue}
          style={{
            color: '#000',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Inter',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Let's go
        </button>
      </div>

      {/* Login Link - 14px below the button */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '653px', // 589px (button top) + 50px (button height) + 14px (gap)
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <span 
          style={{
            overflow: 'hidden',
            color: 'rgba(255, 255, 255, 0.70)',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '135%'
          }}
        >
          Already a user?{" "}
          <button
            onClick={onLogin}
            style={{
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              color: '#FFF',
              textOverflow: 'ellipsis',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '135%',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationSkipInk: 'none',
              textDecorationThickness: 'auto',
              textUnderlineOffset: 'auto',
              textUnderlinePosition: 'from-font',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              margin: 0
            }}
          >
            Login
          </button>
        </span>
      </div>

      

      {/* Wavy Pattern at Bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full"
        style={{ 
          height: '150px',
          overflow: 'hidden'
        }}
      >
        <img 
          src={wavy2Svg} 
          alt="Wavy pattern"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'bottom',
            pointerEvents: 'none'
          }}
        />
      </div>
      </div>
    </div>
  )
}
