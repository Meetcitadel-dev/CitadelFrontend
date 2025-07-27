import { Grid3X3, Info, Briefcase, GraduationCap, Search, Calendar, MessageCircle, Bell, User, LayoutGrid } from "lucide-react"
import { useState } from "react"
import Navbar from "../Common/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileImage from "@/assets/657e5f166ffee2019c3aa97b2117a5c1144d080e.png"

// Add Inter font import for this page only
const interFont = {
  fontFamily: 'Inter, sans-serif'
}

export default function MobileProfileScreen() {
  const [selectedTrait, setSelectedTrait] = useState("")
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

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top Icons */}
      <div className="absolute top-4 right-4 z-20 flex gap-3">
        <button onClick={() => navigate('/search')}>
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
            {/* Connected Badge */}
            <div className="bg-black/60 backdrop-blur-sm px-4 py-1 rounded-lg border border-white/20 inline-block self-start mb-2">
              <span className="text-white text-xs font-medium">Connected</span>
            </div>
            {/* Name and Year Row */}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-white text-2xl font-bold leading-tight">Aditya Sharma</h1>
                {/* Skills */}
                <div className="flex items-center gap-2 mt-2">
                  <Briefcase className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm">UX Designer, Python, Unreal Engine</span>
                </div>
                {/* Education */}
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm">IIT Delhi • B.Tech</span>
                </div>
              </div>
              {/* Year Badge */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-white/60 text-xs font-medium">Year</div>
                <div className="text-white text-2xl font-bold">4</div>
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
              onClick={() => setSelectedTrait(trait.name)}
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
