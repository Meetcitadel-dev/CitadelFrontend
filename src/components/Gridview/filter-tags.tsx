
import { X, Check } from "lucide-react"

interface FilterTagsProps {
  filters: string[]
  onRemoveFilter: (filter: string) => void
}

export function FilterTags({ filters, onRemoveFilter }: FilterTagsProps) {
  return (
    <div className="px-4 pb-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter} className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2">
            <span className="text-white text-sm">{filter}</span>
            <Check className="w-4 h-4 text-green-500" />
            <button onClick={() => onRemoveFilter(filter)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
