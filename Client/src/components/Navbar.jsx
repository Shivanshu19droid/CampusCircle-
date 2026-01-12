import { Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar, onLogoutClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // change later with auth

  const user = useSelector((state) => state.auth.data);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Left: Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Center: Search */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-1/2 max-w-md shadow-inner">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search CampusCircle..."
          className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-4 relative">
        <Bell className="text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors" size={22} />
        {isLoggedIn && (
          <div className="relative">
            <img
              src={user?.avatar?.secure_url? user.avatar.secure_url : "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-indigo-200 transition"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && <ProfileMenu onLogoutClick={onLogoutClick} />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

