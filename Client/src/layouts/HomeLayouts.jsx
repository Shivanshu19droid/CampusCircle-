import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { logoutUser } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const HomeLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const onConfirmLogout = () => {
    try {
      dispatch(logoutUser());
      setOpenConfirm(false);
      navigate("/");
    } catch(error) {
      toast.error(error.message);
    }
  }

  const onLogoutClick = () => {
    setOpenConfirm(true);
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} onLogoutClick={onLogoutClick}/>

        {/* Page Content */}
        <main className="flex-1 px-8 py-6 mt-2 backdrop-blur-sm rounded-t-3xl shadow-inner border-t border-gray-100">
          {children || <Outlet />}
        </main>

        <Footer />
      </div>

      <ConfirmModal 
        isOpen={openConfirm}
        message="Are you sure you want to logout?"
        onConfirm = {() => {
          onConfirmLogout();
        }}
        onCancel = {() => setOpenConfirm(false)}
      />

    </div>
  );
};

export default HomeLayout;

