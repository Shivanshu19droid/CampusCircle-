import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ProfileMenu = ({onLogoutClick}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.data);

  //const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    console.log(user);
  });

  // async function handleLogout() {
  //   try{
  //     await dispatch(logoutUser());
  //     setOpenConfirm(false);
  //     navigate("/");
  //   } catch(error){
  //     toast.error(error.message);
  //   }
  // }

  if (!isLoggedIn) {
    return (
      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-fadeIn text-center">
        {/* Main catchy line */}
        <p className="text-gray-700 text-base mb-2">
          Your campus network is waiting,
        </p>
        <p className="text-indigo-900 font-bold text-lg uppercase mb-4">
          Sign in now to explore!
        </p>

        {/* Login button */}
        <Link
          to="/login"
          className="block bg-gradient-to-b from-indigo-900 to-[#2E2A8C] text-white text-sm py-3 px-6 rounded-xl font-semibold shadow-md hover:from-indigo-800 hover:to-indigo-700 transition-all"
        >
          Login
        </Link>
      </div>
    );
  }
  
 return (
  <>
    <div
      className="
        absolute right-0 mt-3
        w-64
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        p-5
        text-center
        animate-fadeIn
        z-50
      "
    >
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <img
          src={
            user?.avatar?.secure_url
              ? user.avatar.secure_url
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Profile"
          className="
            w-16 h-16
            rounded-full
            object-cover
            border border-slate-200
          "
        />
      </div>

      {/* Name */}
      <h4 className="text-base font-semibold text-slate-900">
        {user.fullName}
      </h4>

      {/* Profession */}
      <p className="text-slate-500 text-xs mt-1 mb-4">
        {user?.currentProfession && user?.currentCompany
          ? `${user.currentProfession} at ${user.currentCompany}`
          : "CampusCircle User"}
      </p>

      {/* Divider */}
      <div className="h-px bg-slate-200 mb-4" />

      {/* View Profile Button */}
      <Link
        to={`/view-profile/${user?._id}`}
        className="
          block w-full
          py-2 mb-2
          rounded-lg
          text-sm font-semibold
          text-white
          bg-gradient-to-b from-indigo-900 to-[#2E2A8C]
          hover:opacity-95
          transition-all duration-200
        "
      >
        View Profile
      </Link>

      {/* Logout Button */}
      <button
        onClick={onLogoutClick}
        className="
          w-full
          py-2
          rounded-lg
          text-sm font-medium
          text-slate-600
          border border-slate-300
          hover:bg-slate-50
          transition-all duration-200
        "
      >
        Log Out
      </button>
    </div>

    {/* Optional Confirm Modal */}
    {/* 
    <ConfirmModal
      isOpen={openConfirm}
      message="Are you sure you want to logout?"
      onConfirm={handleLogout}
      onCancel={() => setOpenConfirm(false)}
    />
    */}
  </>
);
};

export default ProfileMenu;

