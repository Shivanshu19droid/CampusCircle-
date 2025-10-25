import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ProfileMenu = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.data);

  useEffect(() => {
    console.log(user);
  });

  async function handleLogout() {
    try{
      await dispatch(logoutUser());
      navigate("/");
    } catch(error){
      toast.error(error.message);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-fadeIn text-center">
        {/* Main catchy line */}
        <p className="text-gray-700 text-base mb-2">
          Your campus network is waiting,
        </p>
        <p className="text-indigo-600 font-bold text-lg uppercase mb-4">
          Sign in now to explore!
        </p>

        {/* Login button */}
        <Link
          to="/login"
          className="block bg-indigo-600 text-white text-sm py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-all"
        >
          Login
        </Link>
      </div>
    );
  }
  
  return (
    (
     <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 animate-fadeIn">
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <img
          src={user?.avatar?.secure_url? user.avatar.secure_url : "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full ring-2 ring-indigo-100"
        />
        <div>
          <h4 className="font-medium text-gray-800 text-sm">{user.fullName}</h4>
          <p className="text-xs text-gray-500"> {user?.currentProfession && user?.currentCompany ? `${user.currentProfession} at ${user.currentCompany}` : "CampusCircle User"} </p>
        </div>
      </div>

      <Link
        to={`/view-profile/${user._id}`}
        className="block text-sm text-gray-700 hover:text-indigo-600 mb-2 transition-colors"
      >
        View Profile
      </Link>
      <button onClick={handleLogout}className="text-sm text-red-500 hover:text-red-600 transition-colors">
        Logout
      </button>
    </div> 
    )
  );
};

export default ProfileMenu;

