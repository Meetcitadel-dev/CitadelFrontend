import { LogOut } from "lucide-react"

interface LogoutModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isProcessing?: boolean
}

export default function LogoutModal({ isOpen, onConfirm, onCancel, isProcessing = false }: LogoutModalProps) {
  if (!isOpen) return null

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
            <LogOut style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>

          <p style={{ color: 'white', fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
            Are you sure you want to log out?
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              style={{
                flex: 1,
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              {isProcessing ? "Signing out..." : "Yes"}
            </button>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              style={{
                flex: 1,
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 