

// ... existing code ...

interface SettingsHeaderProps {
  title: string
  onBack?: () => void
}

export default function SettingsHeader({ title, onBack }: SettingsHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-black text-white">
      <button onClick={onBack} className="p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>
      <h1 className="text-xl font-medium">{title}</h1>
    </div>
  )
}
