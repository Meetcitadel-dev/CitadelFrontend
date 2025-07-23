import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react";
import React from "react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavbarProps {
  navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ navItems }) => (
  <div className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
    <div className="flex justify-between items-center px-4 py-3">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.label}
            className="flex flex-col items-center gap-1 flex-1 bg-transparent border-none outline-none"
            onClick={item.onClick}
            type="button"
          >
            <IconComponent className={`w-6 h-6 ${item.active ? "text-green-500" : "text-white"}`} />
            <span className={`text-xs font-medium ${item.active ? "text-green-500" : "text-white"}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default Navbar;
