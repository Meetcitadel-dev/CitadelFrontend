"use client"

interface BookButtonProps {
  isEnabled: boolean
  onClick: () => void
}

export function BookButton({ isEnabled, onClick }: BookButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      style={{
        display: 'flex',
        height: '50px',
        padding: '14.5px 16px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        flex: '1 0 0',
        borderRadius: '48px',
        background: isEnabled ? '#1BEA7B' : '#2C2C2C',
        color: isEnabled ? '#040404' : '#AAAAAA',
        border: 'none',
        cursor: isEnabled ? 'pointer' : 'not-allowed',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
      }}
    >
      Book my seat
    </button>
  )
}
