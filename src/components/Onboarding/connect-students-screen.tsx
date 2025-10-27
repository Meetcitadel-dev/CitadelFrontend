import Rectangle4 from '@/assets/Rectangle 4.png'
import Rectangle2 from '@/assets/Rectangle 2.png'
import Rectangle1 from '@/assets/a man teaching, realistic man image, cinemtic, man wearing casual clothes.png'
import Rectangle3 from '@/assets/Rectangle 3.png'
import wavy2Svg from '@/assets/wavy2.svg'

interface ConnectStudentsScreenProps {
  onContinue: () => void
  onLogin: () => void
}

export default function ConnectStudentsScreen({ onContinue, onLogin }: ConnectStudentsScreenProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Responsive Container */}
      <div className="w-full max-w-md mx-auto h-screen flex flex-col relative">
      {/* Profile Images Container */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-[73%] max-w-[286px]"
        style={{
          top: '52px',
          height: '345px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Rectangle 4 */}
        <div
          className="absolute w-[36%] aspect-[0.76] rounded-[60px]"
          style={{
            top: '12%',
            left: '13%',
            borderRadius: '60px 60px 0 60px',
            backgroundImage: `url(${Rectangle4})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Rectangle 1 - top-right */}
        <div
          className="absolute w-[47%] aspect-[0.76] rounded-[60px]"
          style={{
            top: '0px',
            right: '0px',
            borderRadius: '60px 60px 60px 0',
            backgroundImage: `url(${Rectangle1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Rectangle 2 - bottom-left */}
        <div
          className="absolute w-[48%] aspect-[0.87] rounded-[60px]"
          style={{
            bottom: '0px',
            left: '0px',
            borderRadius: '60px 0 60px 60px',
            backgroundImage: `url(${Rectangle2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Rectangle 3 - bottom-right */}
        <div
          className="absolute w-[33%] aspect-[0.76] rounded-[60px]"
          style={{
            bottom: '11%',
            right: '14%',
            borderRadius: '0 60px 60px 60px',
            backgroundImage: `url(${Rectangle3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Decorative SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="21"
          viewBox="0 0 18 21"
          fill="none"
          className="absolute w-[6%] h-auto"
          style={{
            top: '45%',
            left: '7%'
          }}
        >
          <path d="M1 20.0909L16.8182 1" stroke="white"/>
          <path d="M1.00005 9.99981L15.7276 10.818" stroke="white"/>
          <path d="M6.85301 3.19041L13.0001 18.4545" stroke="white"/>
        </svg>
      </div>

      {/* Text Container */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[344px] px-4"
        style={{
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}
      >
        {/* <h1
          className="text-white text-center text-3xl sm:text-4xl font-bold leading-tight"
          style={{
            fontFamily: '"Roboto Serif"',
            margin: 0,
            padding: 0
          }}
        >
          Connect with<br />
          students across<br />
          universities
        </h1> */}
      </div>

      {/* Login Link */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 text-center"
        style={{
          bottom: '180px',
          zIndex: 10
        }}
      >
        <span
          className="text-white/70 text-sm font-semibold"
          style={{
            fontFamily: 'Inter'
          }}
        >
          Already a user?{" "}
          <button
            onClick={onLogin}
            className="text-white text-sm font-semibold underline bg-transparent border-none cursor-pointer p-0 m-0"
            style={{
              fontFamily: 'Inter'
            }}
          >
            Login
          </button>
        </span>
      </div>

      {/* Let's go Button */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[238px] px-4"
        style={{
          bottom: '110px',
          zIndex: 10
        }}
      >
        <button
          onClick={onContinue}
          className="w-full h-[50px] rounded-[48px] bg-[#1BEA7B] text-black text-base font-semibold flex items-center justify-center cursor-pointer border-none hover:bg-[#17d66e] transition-colors"
          style={{
            fontFamily: 'Inter'
          }}
        >
          Let's go
        </button>
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
