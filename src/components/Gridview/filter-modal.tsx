
import { useState, useEffect } from "react"
import { X, Search, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: {
    selectedFilters: string[]
    sortBy: string
    gender: string
    years: string[]
    universities: string[]
    skills: string[]
  }) => void
  initialFilters: string[]
  initialSortBy: string
  initialGender: string
  initialYears: string[]
}


const universities = [
  "Masters' Union",
  "IIT Delhi",
  "Plaksha University",
  "IIM Indore",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "BITS Pilani",
  "Delhi University",
  "Mumbai University",
]

const skills = [
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Digital Marketing",
  "Web Development",
  "Graphic Design",
  "Artificial Intelligence",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
]

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  initialSortBy,
  initialGender,
  initialYears,
}: FilterModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(initialFilters)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [selectedGender, setSelectedGender] = useState(initialGender)
  const [selectedYears, setSelectedYears] = useState<string[]>(initialYears)
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedFilters(initialFilters)
    setSortBy(initialSortBy)
    setSelectedGender(initialGender)
    setSelectedYears(initialYears)
  }, [initialFilters, initialSortBy, initialGender, initialYears])

  // Combine universities and skills for search
  const allOptions = [...universities, ...skills]
  const filteredOptions = allOptions.filter((option) => 
    option.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFilterSelect = (filter: string) => {
    const isUniversity = universities.includes(filter)
    const isSkill = skills.includes(filter)
    
    if (isUniversity && !selectedUniversities.includes(filter)) {
      setSelectedUniversities([...selectedUniversities, filter])
    } else if (isSkill && !selectedSkills.includes(filter)) {
      setSelectedSkills([...selectedSkills, filter])
    }
    setSearchQuery("")
    setShowDropdown(false)
  }

  const handleRemoveFilter = (filterToRemove: string) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter !== filterToRemove))
  }

  const handleRemoveUniversity = (university: string) => {
    setSelectedUniversities(selectedUniversities.filter((u) => u !== university))
  }

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  const handleYearToggle = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year))
    } else {
      setSelectedYears([...selectedYears, year])
    }
  }

  const handleClear = () => {
    setSelectedFilters([])
    setSortBy("")
    setSelectedGender("")
    setSelectedYears([])
    setSelectedUniversities([])
    setSelectedSkills([])
    setSearchQuery("")
  }

  const handleApply = () => {
    onApply({
      selectedFilters: [...selectedFilters, ...selectedUniversities, ...selectedSkills],
      sortBy,
      gender: selectedGender,
      years: selectedYears,
      universities: selectedUniversities,
      skills: selectedSkills,
    })
  }

  const handleSortByToggle = (value: string) => {
    if (sortBy === value) {
      setSortBy("") // Unselect if already selected
    } else {
      setSortBy(value) // Select new option
    }
  }

  const handleGenderToggle = (gender: string) => {
    if (selectedGender === gender) {
      setSelectedGender("") // Unselect if already selected
    } else {
      setSelectedGender(gender) // Select new option
    }
  }

  const hasFilters = selectedFilters.length > 0 || sortBy || selectedGender || selectedYears.length > 0 || selectedUniversities.length > 0 || selectedSkills.length > 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
      <div 
        className={`w-full rounded-t-3xl max-h-[85vh] overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Opaque content area */}
        <div className="bg-black max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-black z-10">
            <button onClick={onClose} className="text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-white text-xl font-semibold">Filter Options</h2>
            <div className="w-6"></div>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search colleges and skillsets"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setShowDropdown(searchQuery.length > 0)}
                className="w-full bg-gray-800 border-0 rounded-xl pl-11 pr-4 py-4 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              />

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl max-h-60 overflow-y-auto z-10">
                  {filteredOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl border-b border-gray-700 last:border-b-0"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Universities */}
            {selectedUniversities.length > 0 && (
              <div>
                <h4 className="text-white text-sm font-medium mb-2">Selected Universities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUniversities.map((university) => (
                    <div key={university} className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2">
                      <span className="text-white text-sm">{university}</span>
                      <Check className="w-4 h-4 text-green-500" />
                      <button onClick={() => handleRemoveUniversity(university)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div>
                <h4 className="text-white text-sm font-medium mb-2">Selected Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2">
                      <span className="text-white text-sm">{skill}</span>
                      <Check className="w-4 h-4 text-green-500" />
                      <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Filters Tags */}
            {selectedFilters.length > 0 && (
              <div>
                <h4 className="text-white text-sm font-medium mb-2">Other Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.map((filter) => (
                    <div key={filter} className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2">
                      <span className="text-white text-sm">{filter}</span>
                      <Check className="w-4 h-4 text-green-500" />
                      <button onClick={() => handleRemoveFilter(filter)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sort By */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Sort By</h3>
              <div className="space-y-3">
                {[
                  { value: "year_asc", label: "Year: Low to High" },
                  { value: "year_desc", label: "Year: High to Low" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={() => handleSortByToggle(option.value)}
                        className="w-5 h-5 text-green-500 bg-transparent border-2 border-gray-600 focus:ring-green-500 focus:ring-2 rounded-full appearance-none"
                        style={{
                          background: sortBy === option.value ? '#ffffff' : 'transparent',
                          borderColor: sortBy === option.value ? '#ffffff' : '#4b5563'
                        }}
                      />
                      {sortBy === option.value && (
                        <div className="absolute top-1 left-1 w-3 h-3 bg-green-500 rounded-full pointer-events-none"></div>
                      )}
                    </div>
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Gender</h3>
              <div className="space-y-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={selectedGender === gender}
                        onChange={() => handleGenderToggle(gender)}
                        className="w-5 h-5 text-green-500 bg-transparent border-2 border-gray-600 focus:ring-green-500 focus:ring-2 rounded-full appearance-none"
                        style={{
                          background: selectedGender === gender ? '#ffffff' : 'transparent',
                          borderColor: selectedGender === gender ? '#ffffff' : '#4b5563'
                        }}
                      />
                      {selectedGender === gender && (
                        <div className="absolute top-1 left-1 w-3 h-3 bg-green-500 rounded-full pointer-events-none"></div>
                      )}
                    </div>
                    <span className="text-white">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Year</h3>
              <div className="grid grid-cols-2 gap-4">
                {["First", "Second", "Third", "Fourth"].map((year) => (
                  <label key={year} className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={() => handleYearToggle(year)}
                        className="w-5 h-5 text-green-500 bg-transparent border-2 border-gray-600 focus:ring-green-500 focus:ring-2 rounded appearance-none"
                        style={{
                          background: selectedYears.includes(year) ? '#10b981' : 'transparent',
                          borderColor: selectedYears.includes(year) ? '#10b981' : '#4b5563'
                        }}
                      />
                      {selectedYears.includes(year) && (
                        <Check className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none" />
                      )}
                    </div>
                    <span className="text-white">{year}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleClear}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-0 rounded-full py-4"
              >
                Clear
              </Button>
              <Button
                onClick={handleApply}
                className={`flex-1 border-0 rounded-full py-4 ${
                  hasFilters ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-800 hover:bg-green-700 text-white"
                }`}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
