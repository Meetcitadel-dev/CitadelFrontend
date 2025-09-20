import { Trash2, LogOut } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  cancelText: string
  icon: "delete" | "logout"
  isDestructive?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText,
  cancelText,
  icon,
  isDestructive = false
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const IconComponent = icon === "delete" ? Trash2 : LogOut
  const iconColor = isDestructive ? "#ef4444" : "#ffffff"

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
      }}
    >
      <div 
        style={{
          backgroundColor: '#1f2937',
          padding: '24px',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '90%',
          margin: '0 16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#374151',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <IconComponent style={{ width: '24px', height: '24px', color: iconColor }} />
          </div>

          <p style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                backgroundColor: isDestructive ? '#dc2626' : '#059669',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 