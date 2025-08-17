

import { ChevronLeft } from "lucide-react"

interface SettingsHeaderProps {
  title: string
  onBack?: () => void
}

export default function SettingsHeader({ title, onBack }: SettingsHeaderProps) {
  return (
    <div 
      className="flex items-center bg-black text-white"
      style={{
        marginTop: '28px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <button onClick={onBack} className="p-1">
          <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <h1 
        className="ml-[25px]"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          overflow: 'hidden',
          color: '#FFF',
          textOverflow: 'ellipsis',
          fontFamily: '"Roboto Serif"',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: 'normal'
        }}
      >
        {title}
      </h1>
    </div>
  )
}
