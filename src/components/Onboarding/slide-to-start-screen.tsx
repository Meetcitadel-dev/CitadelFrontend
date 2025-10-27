import Rectangle4 from '@/assets/Rectangle 4.png'
import Rectangle2 from '@/assets/Rectangle 2.png'
import Rectangle1 from '@/assets/a man teaching, realistic man image, cinemtic, man wearing casual clothes.png'
import Rectangle3 from '@/assets/Rectangle 3.png'


import { useState, useRef, useEffect } from "react"

interface SlideToStartScreenProps {
  onSlideComplete: () => void
}

export default function SlideToStartScreen({ onSlideComplete }: SlideToStartScreenProps) {
  const [slidePosition, setSlidePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    setIsDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const maxSlide = containerRect.width - 60 // 60px is the button width

    const newPosition = Math.max(0, Math.min(clientX - containerRect.left - 30, maxSlide))
    setSlidePosition(newPosition)

    // Complete slide when reaching the end
    if (newPosition >= maxSlide * 0.8) {
      onSlideComplete()
    }
  }

  const handleEnd = () => {
    setIsDragging(false)
    // Reset position if not completed
    setSlidePosition(0)
  }

  // Mouse events
  const handleMouseDown = () => {
    handleStart()
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = () => {
    handleStart()
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Responsive Container */}
      <div className="w-full max-w-md mx-auto h-screen flex flex-col relative">
      {/* Images Container - Above Curved Background */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-[85%] max-w-[336px]"
        style={{
          top: '44px',
          height: '348px'
        }}
      >
        {/* First Image - Rectangle 4 */}
        <div
          className="absolute w-[24%] aspect-[0.76] rounded-[60px] bg-cover bg-center"
          style={{
            left: '8%',
            top: '4px',
            backgroundImage: `url(${Rectangle4})`,
            backgroundSize: 'cover'
          }}
        />

        {/* Second Image - Rectangle 2 */}
        <div
          className="absolute w-[45%] aspect-[0.76] rounded-[60px] bg-cover bg-center"
          style={{
            left: '0px',
            bottom: '0px',
            backgroundImage: `url(${Rectangle2})`,
            backgroundSize: 'cover'
          }}
        />

        {/* Third Image - Rectangle 4 (Top Right) */}
        <div
          className="absolute w-[45%] aspect-[0.76] rounded-[60px] bg-cover bg-center"
          style={{
            right: '4%',
            top: '0px',
            backgroundImage: `url(${Rectangle1})`,
            backgroundSize: 'cover'
          }}
        />

        {/* Fourth Image - Rectangle 3 */}
        <div
          className="absolute w-[24%] aspect-[0.76] rounded-[60px] bg-cover bg-center"
          style={{
            right: '10%',
            bottom: '21.8px',
            backgroundImage: `url(${Rectangle3})`,
            backgroundSize: 'cover'
          }}
        />

        {/* Vector Icon */}
        <div
          className="absolute w-[5%] h-auto"
          style={{
            top: '25%',
            left: '1%'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none" className="w-full h-auto">
            <path d="M1.27344 19.818L17.0916 0.727051" stroke="white"/>
            <path d="M1.27349 9.72686L16.001 10.5451" stroke="white"/>
            <path d="M7.12645 2.91747L13.2735 18.1816" stroke="white"/>
          </svg>
        </div>

        {/* Second Vector Icon */}
        <div
          className="absolute w-[4%] h-auto"
          style={{
            top: '45%',
            right: '50%'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none" className="w-full h-auto">
            <path d="M1 15.8193L13.5054 0.726562" stroke="white"/>
            <path d="M1.00084 7.84184L12.644 8.4887" stroke="white"/>
            <path d="M5.62827 2.45835L10.488 14.5257" stroke="white"/>
          </svg>
        </div>

        {/* Third Vector Icon */}
        <div
          className="absolute w-[8%] h-auto"
          style={{
            bottom: '17%',
            right: '0%'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="25" viewBox="0 0 28 25" fill="none" className="w-full h-auto">
            <path d="M0.908203 1.04453C0.908203 1.04453 3.63548 0.499072 4.18093 3.22635C4.72639 5.95362 -1.27362 13.0445 1.99911 16.3173C5.27184 19.59 8.54457 18.2797 10.7264 17.4082C12.9082 16.5367 12.9082 13.0445 11.8173 12.4991C10.7264 11.9536 8.54457 11.2718 4.72639 14.1354C0.908203 16.9991 0.908203 18.4991 0.908203 20.6809C0.908203 22.8627 1.99911 24.4991 6.9082 24.4991C11.8173 24.4991 14.5446 20.6809 19.9991 19.0445C25.4537 17.4082 27.09 19.59 27.09 19.59" stroke="white"/>
          </svg>
        </div>
      </div>

      {/* Curved Background Container */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full rounded-t-[45px]"
        style={{
          height: '355px',
          background: 'linear-gradient(136deg, #111 0%, #040404 64.5%)'
        }}
      >
        {/* Content inside curved background */}
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          {/* Citadel Icon */}
          <div className="flex items-center justify-center mb-[5px] h-[61px] w-[61px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
              <path d="M21.5491 1.63649C22.0188 -0.44262 24.9812 -0.442626 25.4508 1.63649L27.3342 9.97426C27.6386 11.3217 29.1849 11.9622 30.3529 11.2247L37.5804 6.66071C39.3826 5.52264 41.4774 7.61738 40.3393 9.41962L35.7753 16.6471C35.0378 17.8151 35.6783 19.3614 37.0257 19.6658L45.3635 21.5491C47.4426 22.0188 47.4426 24.9812 45.3635 25.4508L37.0257 27.3342C35.6783 27.6386 35.0378 29.1849 35.7753 30.3529L40.3393 37.5804C41.4774 39.3826 39.3826 41.4774 37.5804 40.3393L30.3529 35.7753C29.1849 35.0378 27.6386 35.6783 27.3342 37.0257L25.4509 45.3635C24.9812 47.4426 22.0188 47.4426 21.5492 45.3635L19.6658 37.0257C19.3614 35.6783 17.8151 35.0378 16.6471 35.7753L9.41962 40.3393C7.61739 41.4774 5.52263 39.3826 6.6607 37.5804L11.2247 30.3529C11.9622 29.1849 11.3217 27.6386 9.97426 27.3342L1.63649 25.4509C-0.44262 24.9812 -0.442626 22.0188 1.63649 21.5492L9.97426 19.6658C11.3217 19.3614 11.9622 17.8151 11.2247 16.6471L6.6607 9.41962C5.52264 7.61738 7.61738 5.52263 9.41962 6.6607L16.6471 11.2247C17.8151 11.9622 19.3614 11.3217 19.6658 9.97426L21.5491 1.63649Z" fill="#1BEA7B"/>
            </svg>
          </div>

          {/* Main Text */}
          <div className="text-center mb-8">
            <p className="text-white text-3xl sm:text-4xl font-semibold" style={{fontFamily: '"Roboto Serif", serif'}}>i'm good, wby?</p>
          </div>

          {/* Slide to Start */}
          <div className="mb-6 w-full max-w-[365px]">
            <div
              ref={containerRef}
              className="relative flex items-center px-2 w-full rounded-[45px] bg-[#161616]"
              style={{
                height: '84px'
              }}
            >
              <div
                ref={sliderRef}
                className="absolute w-[75px] h-[75px] bg-green-400 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 z-10"
                style={{ transform: `translateX(${slidePosition}px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 5L12.5 10L7.5 15"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
                             <div className="flex-1 text-center">
                 <span 
                   style={{
                     fontFamily: 'Inter, sans-serif',
                     fontSize: '18px',
                     fontStyle: 'normal',
                     fontWeight: 500,
                     lineHeight: '135%',
                     background: 'linear-gradient(90deg, #CACACA 0%, #9A9A9A 100%)',
                     backgroundClip: 'text',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent'
                   }}
                 >
                   Slide to start
                 </span>
               </div>
            </div>
          </div>

          {/* Terms Text */}
          <div className="w-full max-w-[280px] text-center px-4">
            <p className="text-[#2C2C2C] text-sm font-medium leading-[135%]" style={{fontFamily: 'Inter, sans-serif'}}>
              By signing in you accept our{" "}
              <span className="underline">
                Terms of use
              </span>{" "}
              and{" "}
              <span className="underline">
                Privacy policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
      </div>
  )
}
