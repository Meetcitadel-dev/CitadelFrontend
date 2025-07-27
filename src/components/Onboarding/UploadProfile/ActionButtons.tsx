

interface ActionButtonsProps {
  onSkip?: () => void
  onUpload?: () => void
}

export default function ActionButtons({ onSkip, onUpload }: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-8 pb-8">
      <button onClick={onSkip} className="text-gray-400 text-base hover:text-gray-300 transition-colors">
        Skip for now
      </button>

      <button
        onClick={onUpload}
        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 px-6 rounded-full transition-colors text-lg"
      >
        Upload pictures
      </button>
    </div>
  )
}
