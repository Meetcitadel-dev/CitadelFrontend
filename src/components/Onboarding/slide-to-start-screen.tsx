import Connecting2 from '@/assets/sign up animation 1.png'

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SlideToStartScreenProps {
  onSlideComplete: () => void
}

export default function SlideToStartScreen({ onSlideComplete }: SlideToStartScreenProps) {
  const [slidePosition, setSlidePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStart = (clientX: number) => {
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
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Profile Images with Stars - Using exact provided layout */}
      <div className="absolute inset-0">
        {/* Use the provided profile images */}
        <div className="absolute top-20 left-0 right-0">
          <div className="relative w-full h-96 flex items-center justify-center">
            <img src={Connecting2} alt="Student profiles" className="w-80 h-80 object-contain" />
            {/* Decorative stars positioned around the images */}
            <div className="absolute top-16 left-12">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L12 7L20 7L14 12L16 20L10 15L4 20L6 12L0 7L8 7L10 0Z" fill="white" />
              </svg>
            </div>
            <div className="absolute bottom-20 right-16">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0L14.4 8.4L24 8.4L16.8 14.4L19.2 24L12 18L4.8 24L7.2 14.4L0 8.4L9.6 8.4L12 0Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Citadel Icon */}
        <div className="text-center mb-4">
          <img src="/citadel-icon.png" alt="Citadel" width={40} height={40} className="mx-auto" />
        </div>

        {/* Main Text */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-normal">i'm good, wby?</h1>
        </div>

        {/* Slide to Start */}
        <div className="mb-6">
          <div ref={containerRef} className="relative bg-gray-800 rounded-full h-14 flex items-center px-2">
            <div
              ref={sliderRef}
              className="absolute w-12 h-12 bg-green-400 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 z-10"
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
              <span className="text-gray-400 text-lg font-medium">Slide to start</span>
            </div>
          </div>
        </div>

        {/* Terms Text */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            By signing in you accept our <span className="underline">Terms of use</span> and{" "}
            <span className="underline">Privacy policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
