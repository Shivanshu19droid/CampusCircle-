import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const HomeLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 px-8 py-6 mt-2 bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-inner border-t border-gray-100">
          {children || <Outlet />}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;

