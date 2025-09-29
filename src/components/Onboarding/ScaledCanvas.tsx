import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

interface ScaledCanvasProps {
  width?: number
  height?: number
  anchor?: 'bottom' | 'center'
}

// Keeps a fixed design size and scales uniformly based on viewport width.
// Anchors to bottom-center by default so bottom elements (e.g., waves, curved backgrounds) remain attached.
export default function ScaledCanvas({
  children,
  width = 390,
  height = 844,
  anchor = 'bottom'
}: PropsWithChildren<ScaledCanvasProps>) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth
      const s = vw / width
      setScale(s)
    }
    computeScale()
    window.addEventListener('resize', computeScale)
    return () => window.removeEventListener('resize', computeScale)
  }, [width])

  const anchoredStyle =
    anchor === 'center'
      ? {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center'
        }
      : {
          position: 'absolute' as const,
          left: '50%',
          bottom: 0,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'bottom center'
        }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ...anchoredStyle
        }}
      >
        {children}
      </div>
    </div>
  )
}


