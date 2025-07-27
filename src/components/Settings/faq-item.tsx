

import { Plus, Minus } from "lucide-react"

interface FAQItemProps {
  question: string
  answer?: string
  isExpanded: boolean
  onToggle: () => void
}

export default function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button onClick={onToggle} className="flex items-center justify-between w-full py-4 text-left">
        <span className="text-white text-base font-medium pr-4">{question}</span>
        {isExpanded ? (
          <Minus className="w-5 h-5 text-red-500 flex-shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-green-400 flex-shrink-0" />
        )}
      </button>
      {isExpanded && answer && (
        <div className="pb-4">
          <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
