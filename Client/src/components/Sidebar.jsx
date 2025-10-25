import { Home, MessageSquare, Briefcase, Calendar, Users, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Jobs / Internships", icon: Briefcase, path: "/jobs" },
    { name: "Events", icon: Calendar, path: "/events" },
    { name: "Community", icon: Users, path: "/community" },
    { name: "People", icon: Users, path: "/people" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={`bg-white h-screen fixed top-0 left-0 z-40 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 w-64 border-r border-gray-100 shadow-sm`}
    >
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
        <h2 className="text-xl font-semibold tracking-tight">CampusCircle</h2>
      </div>

      <nav className="p-4 flex flex-col gap-1.5">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 shadow-inner"
                   : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
               }`
            }
          >
            <Icon size={20} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

