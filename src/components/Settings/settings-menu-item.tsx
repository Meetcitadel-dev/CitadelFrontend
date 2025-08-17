

import type { LucideIcon } from "lucide-react"

interface SettingsMenuItemProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
  isDestructive?: boolean
}

export default function SettingsMenuItem({ icon: Icon, title, onClick, isDestructive = false }: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full transition-colors ${
        isDestructive ? 'text-red-500 hover:text-red-400' : 'text-white'
      }`}
      style={{
        display: 'flex',
        height: '77px',
        padding: '12px 16px',
        alignItems: 'center',
        gap: '16px',
        alignSelf: 'stretch',
        borderBottom: '1px solid #2C2C2C',
        background: '#111111'
      }}
    >
      <div className="flex items-center justify-center flex-shrink-0" style={{ width: '45px', height: '45px' }}>
        <Icon className="" />
      </div>
      <span 
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          color: isDestructive ? '#FF5151' : '#FFFFFF',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter',
          fontSize: '20px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal'
        }}
      >
        {title}
      </span>
    </button>
  )
}
