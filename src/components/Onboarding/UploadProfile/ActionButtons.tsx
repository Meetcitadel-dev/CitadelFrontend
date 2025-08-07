

interface ActionButtonsProps {
  onSkip?: () => void
  onUpload?: () => void
  isUploading?: boolean
}

export default function ActionButtons({ onSkip, onUpload, isUploading = false }: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-8 pb-8">
      <button 
        onClick={onSkip} 
        disabled={isUploading}
        className="text-gray-400 text-base hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Skip for now
      </button>

      <button
        onClick={onUpload}
        disabled={isUploading}
        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 px-6 rounded-full transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
            Uploading...
          </>
        ) : (
          "Upload pictures"
        )}
      </button>
    </div>
  )
}
