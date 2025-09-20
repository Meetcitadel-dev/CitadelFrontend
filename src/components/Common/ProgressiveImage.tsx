import { useState, useEffect } from 'react'

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  placeholder?: string
  onLoad?: () => void
  onError?: (e: any) => void
  style?: React.CSSProperties
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  priority = false,
  placeholder,
  onLoad,
  onError,
  style
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder || '')

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => {
      setCurrentSrc(src)
      setImageLoaded(true)
      onLoad?.()
    }
    
    img.onerror = (e) => {
      setImageError(true)
      onError?.(e)
    }
    
    // Set high priority for critical images
    if (priority) {
      img.fetchPriority = 'high'
    }
    
    img.src = src
  }, [src, priority, onLoad, onError])

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder/Low quality image */}
      {placeholder && !imageLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          style={{ filter: 'blur(5px)' }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}
      
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          setImageError(true)
          onError?.(e)
        }}
      />
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  )
}
