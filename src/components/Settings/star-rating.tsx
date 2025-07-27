import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
}

export default function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-400"}`}
        />
      ))}
    </div>
  )
}
