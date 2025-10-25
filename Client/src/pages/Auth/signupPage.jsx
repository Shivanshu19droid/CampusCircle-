import HomeLayout from "../../layouts/HomeLayouts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../../Redux/Slices/AuthSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


function SignUpFunc() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [userInput, setUserInput] = useState({
        fullName: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    //handling user input
    const handleUserInput = (e) => {
         const {name, value} = e.target;

         setUserInput({
            ...userInput,
            [name]: value
         })
    }

    //handling form submit
    async function handleSubmit (event) {
        
        event.preventDefault();

        if(!userInput.fullName || !userInput.role || !userInput.email || !userInput.password){
            toast.error("All fields are mandatory");
            return;
        }

        if(userInput.password !== userInput.confirmPassword) {
            toast.error("Confirm password must match the entered password");
            return;
        }

        const {confirmPassword, ...rest} = userInput;

        console.log(rest);

        const response = await dispatch(registerUser(rest));

        if(response?.payload?.success){
            toast.success("You have been successfully registered with CampusCircle");
            navigate("/");
        }

        setUserInput({
            fullName: "",
            role: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    return (
  <HomeLayout>
  <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
    <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-3">
        Create Your Account 🚀
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Join the CampusCircle community today
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={userInput.fullName}
            onChange={handleUserInput}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your full name"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Role</label>
          <select
            name="role"
            value={userInput.role}
            onChange={handleUserInput}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select your role</option>
            <option value="STUDENT">Student</option>
            <option value="ALUMNI">Alumni</option>
            <option value="FACULTY">Faculty</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userInput.email}
            onChange={handleUserInput}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={userInput.password}
            onChange={handleUserInput}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
            placeholder="Enter password"
          />
          <button
            type="button"
            className="absolute right-3 bottom-1/2 top-1/2 transform translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.458 12C3.732 15.68 7.137 18 10 18s6.268-2.32 7.542-6c-.57-1.86-1.68-3.5-3.146-4.646L12.828 9.88A3 3 0 0010 13a3 3 0 01-2.828-4.12l-5.414 5.414zM3.293 3.293l13.414 13.414-1.414 1.414L1.879 4.707 3.293 3.293z" />
              </svg>
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-700 mb-2 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userInput.confirmPassword}
            onChange={handleUserInput}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
            placeholder="Re-enter password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  </div>
</HomeLayout>

);

}

export default SignUpFunc;