import Connecting1 from '@/assets/sign up animation 1 (1).png'
import Rectangle4 from '@/assets/Rectangle 4.png'
import Rectangle2 from '@/assets/Rectangle 2.png'
import Rectangle1 from '@/assets/a man teaching, realistic man image, cinemtic, man wearing casual clothes.png'
import Rectangle3 from '@/assets/Rectangle 3.png'
// removed wavylines assets; using inline SVG for waves

interface ConnectStudentsScreenProps {
  onContinue: () => void
  onLogin: () => void
}

export default function ConnectStudentsScreen({ onContinue, onLogin }: ConnectStudentsScreenProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Profile Images Container */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '52px',
          width: '286px',
          height: '345px',
          position: 'relative'
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
          justifyContent: 'center'
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
          background: '#1BEA7B'
        }}
      >
        <button
          onClick={onContinue}
          style={{
            color: '#000',
            fontSize: '16px',
            fontWeight: '600',
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
          textAlign: 'center'
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

      

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden" style={{ pointerEvents: 'none', bottom: '-20px' }}>
          <svg
            viewBox="0 0 400 180"
            className="w-full h-full"
            preserveAspectRatio="none"
            style={{ transform: 'scale(1.2)', transformOrigin: '50% 100%' }}
          >
            {/* Multiple parallel wavy lines flowing horizontally - positioned lower and larger */}
            <path d="M-50,80 Q50,70 150,80 T350,80 T550,80" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,95 Q50,85 150,95 T350,95 T550,95" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,110 Q50,100 150,110 T350,110 T550,110" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,125 Q50,115 150,125 T350,125 T550,125" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,140 Q50,130 150,140 T350,140 T550,140" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,155 Q50,145 150,155 T350,155 T550,155" stroke="#1bea7b" strokeWidth="8" fill="none" />
            <path d="M-50,170 Q50,160 150,170 T350,170 T550,170" stroke="#1bea7b" strokeWidth="8" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  )
}
