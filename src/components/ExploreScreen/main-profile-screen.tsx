import { Grid3X3, Info, Briefcase, GraduationCap, Search, Calendar, MessageCircle, Bell, User, LayoutGrid, X, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "../Common/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileImage from "@/assets/657e5f166ffee2019c3aa97b2117a5c1144d080e.png"

// Add Inter font import for this page only
const interFont = {
  fontFamily: 'Inter, sans-serif'
}

// Mock data for testing - REMOVE THIS LATER
const mockProfiles = [
  {
    id: "1",
    name: "Sarah Johnson",
    university: "MIT",
    degree: "Computer Science",
    year: "3",
    skills: "Python, React, Machine Learning",
    connectionStatus: "not_connected"
  },
  {
    id: "2", 
    name: "Alex Chen",
    university: "Stanford University",
    degree: "Electrical Engineering",
    year: "4",
    skills: "Circuit Design, IoT, Arduino",
    connectionStatus: "requested"
  },
  {
    id: "3",
    name: "Emma Wilson", 
    university: "Harvard University",
    degree: "Business Administration",
    year: "2",
    skills: "Marketing, Finance, Leadership",
    connectionStatus: "connected"
  }
]

export default function MobileProfileScreen() {
  const [selectedTrait, setSelectedTrait] = useState("")
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();

  const traits = [{ name: "Creative" }, { name: "Intelligent" }, { name: "Handsome" }, { name: "Smart" }]

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  // Mock data loading - REMOVE THIS LATER
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading profiles...</div>
      </div>
    )
  }

  const currentProfile = mockProfiles[currentProfileIndex]

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top Icons */}
      <div className="absolute top-4 right-4 z-20 flex gap-3">
        <button onClick={() => navigate('/gridview')}>
          <LayoutGrid className="w-6 h-6 text-white" />
        </button>
        <Info className="w-6 h-6 text-white" />
      </div>

      {/* Profile Image with Gradient Overlay and Info Block */}
      <div className="relative h-[65%] w-full"> {/* Further reduced height to free more space */}
        <img src={ProfileImage} alt="Profile" className="object-cover absolute inset-0 w-full h-full" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        {/* Profile Info Block */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full flex flex-col px-4" style={interFont}>
            {/* Connection Status Badge */}
            <div className="mb-2">
              {currentProfile.connectionStatus === 'connected' && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Connected
                </div>
              )}
              {currentProfile.connectionStatus === 'requested' && (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Requested
                </div>
              )}
              {currentProfile.connectionStatus === 'not_connected' && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Connect
                </div>
              )}
            </div>
            {/* Name and Year Row */}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-white text-2xl font-bold leading-tight">{currentProfile.name}</h1>
                {/* Skills */}
                <div className="flex items-center gap-2 mt-2">
                  <Briefcase className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm">{currentProfile.skills}</span>
                </div>
                {/* Education */}
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm">{currentProfile.university} • {currentProfile.degree}</span>
                </div>
              </div>
              {/* Year Badge */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-white/60 text-xs font-medium">Year</div>
                <div className="text-white text-2xl font-bold">{currentProfile.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="px-6 mt-2 mb-24"> {/* Changed from -mt-12 to mt-4 for a small gap */}
        <div className="grid grid-cols-2 gap-3">
          {traits.map((trait) => (
            <button
              key={trait.name}
              onClick={() => {
                setSelectedTrait(trait.name)
                // Mock matching logic - REMOVE THIS LATER
                if (trait.name === 'Smart' && currentProfile.name === 'Sarah Johnson') {
                  setTimeout(() => {
                    alert(`🎉 You matched with ${currentProfile.name} on "${trait.name}"!`)
                  }, 500)
                }
                
                // Move to next profile after a short delay
                setTimeout(() => {
                  if (currentProfileIndex < mockProfiles.length - 1) {
                    setCurrentProfileIndex(prev => prev + 1)
                    setSelectedTrait("")
                  }
                }, 1000)
              }}
              className={`rounded-2xl px-8 py-5 text-center transition-all ${
                selectedTrait === trait.name ? "bg-green-500 text-black" : "bg-white/10 backdrop-blur-sm text-green-400"
              }`}
            >
              <span className="text-lg font-semibold">{trait.name}</span>
            </button>
          ))}
        </div>
      </div>



      {/* Bottom Navigation */}
      <Navbar navItems={navItems} />
    </div>
  )
}
