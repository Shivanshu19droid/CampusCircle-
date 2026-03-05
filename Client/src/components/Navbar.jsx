import { Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar, onLogoutClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // change later with auth

  const user = useSelector((state) => state.auth.data);

  return (
  <header className="flex items-center justify-between px-6 py-4 bg-indigo-900 shadow-md sticky top-0 z-50">
    
    {/* Left: Sidebar Toggle */}
    <button
      onClick={toggleSidebar}
      className="text-white hover:opacity-80 transition-colors"
    >
      <Menu size={24} />
    </button>

    {/* Center: Search */}
    <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full w-1/2 max-w-md">
      <Search size={18} className="text-white/80 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none w-full text-sm text-white placeholder-white/70"
      />
    </div>

    {/* Right: Notifications + Profile */}
    <div className="flex items-center gap-4 relative">
      
      <Bell
        className="text-white hover:opacity-80 cursor-pointer transition-colors"
        size={22}
      />

      {isLoggedIn && (
        <div className="relative">
          <img
            src={
              user?.avatar?.secure_url
                ? user.avatar.secure_url
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Profile"
            className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-white/40 hover:ring-white transition"
            onClick={() => setShowProfile(!showProfile)}
          />
          {showProfile && (
            <ProfileMenu onLogoutClick={onLogoutClick} />
          )}
        </div>
      )}
    </div>
  </header>
);
};

export default Navbar;

