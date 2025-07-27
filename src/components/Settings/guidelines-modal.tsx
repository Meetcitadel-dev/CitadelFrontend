
import { X } from "lucide-react"

interface GuidelinesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
  if (!isOpen) return null

  const guidelines = [
    {
      number: 1,
      text: "Find your ticket in ",
      highlight: "settings → event bookings.",
    },
    {
      number: 2,
      text: "Restaurant name will be available ",
      highlight: "12 hours before the dinner.",
    },
    {
      number: 3,
      text: "This price includes ",
      highlight: "one time Citadel dinner experience",
      suffix: " with like-minded people.",
    },
    {
      number: 4,
      text: "The ",
      highlight: "meal cost is to be paid",
      suffix: " at the restaurant.",
    },
    {
      number: 5,
      text: "Free ",
      highlight: "reschedule up to 48 hours",
      suffix: " before the dinner.",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4 bg-black p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-xl font-medium">Guidelines</h2>
          <button onClick={onClose} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {guidelines.map((guideline) => (
            <div key={guideline.number} className="flex gap-3">
              <span className="text-gray-400 text-base">{guideline.number}.</span>
              <p className="text-base leading-relaxed">
                <span className="text-gray-400">{guideline.text}</span>
                <span className="text-white font-medium">{guideline.highlight}</span>
                {guideline.suffix && <span className="text-gray-400">{guideline.suffix}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
