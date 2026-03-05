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
    } transition-transform duration-300 w-64 border-r border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)]`}
  >
    {/* Header */}
    <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-900 to-[#2E2A8C] text-white">
      <h2 className="text-lg font-semibold tracking-tight">
        CampusCircle 2.0
      </h2>
    </div>

    {/* Navigation */}
    <nav className="p-5 flex flex-col gap-2">
      {navItems.map(({ name, icon: Icon, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
             ${
               isActive
                 ? "bg-gradient-to-r from-indigo-900 to-[#2E2A8C] text-white shadow-md"
                 : "text-slate-700 hover:bg-slate-100 hover:text-indigo-900"
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

