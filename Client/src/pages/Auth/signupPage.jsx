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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_25px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-200 text-center">

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-indigo-900 to-[#2E2A8C] text-white flex items-center justify-center font-semibold">
            C
          </div>
          <span className="text-lg font-semibold text-slate-900">
            CampusCircle
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-2">
          Join the Circle of Scholars
        </p>

        <h2 className="text-3xl font-bold text-slate-900">
          Create Your Account
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Get started in just a few steps!
        </p>

      </div>

      {/* Form */}
      <div className="px-8 py-8">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <input
              type="text"
              name="fullName"
              value={userInput.fullName}
              onChange={handleUserInput}
              placeholder="Full Name"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Role */}
          <div>
            <select
              name="role"
              value={userInput.role}
              onChange={handleUserInput}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            >
              <option value="">Select your role</option>
              <option value="STUDENT">Student</option>
              <option value="ALUMNI">Alumni</option>
              <option value="FACULTY">Faculty</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={userInput.email}
              onChange={handleUserInput}
              placeholder="Email Address"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              placeholder="Create Password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition pr-12"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.458 12C3.732 15.68 7.137 18 10 18s6.268-2.32 7.542-6c-.57-1.86-1.68-3.5-3.146-4.646L12.828 9.88A3 3 0 0010 13a3 3 0 01-2.828-4.12l-5.414 5.414z"/>
                  <path d="M3.293 3.293l13.414 13.414-1.414 1.414L1.879 4.707 3.293 3.293z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={userInput.confirmPassword}
              onChange={handleUserInput}
              placeholder="Confirm Password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 transition shadow-md"
          >
            Get Started
          </button>

        </form>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-8 py-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-900 font-medium hover:underline"
        >
          Sign In
        </Link>
      </div>

    </div>

  </div>
);

}

export default SignUpFunc;