import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../Redux/Slices/AuthSlice";
import HomeLayout from "../../layouts/HomeLayouts";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


function LoginFunc() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        email: "",
        password: ""
    });

    //to handle the fields entered by the user
    function handleUserInput(e) {
        const {name, value} = e.target;

        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    //to trigger input on form submission
    async function handleSubmit (event) {
        event.preventDefault();

        if(!userInput.email || !userInput.password){
            toast.error("Please enter all the fields");
            return;
        }

        //dispatch login action
        const response = await dispatch(loginUser(userInput));
        if (response?.payload?.success){
            //toast.success("You are now logged in to your account");
            navigate("/");

            setUserInput({
                email: "",
                password: ""
            });
        }


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
          Connect. Learn. Thrive.
        </p>

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back!
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Please sign in to your account.
        </p>

      </div>

      {/* Form */}
      <div className="px-8 py-8">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={userInput.email}
              onChange={handleUserInput}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-indigo-900 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 transition shadow-md"
          >
            Sign In
          </button>

        </form>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-8 py-4 text-center text-sm text-slate-600">
        New to CampusCircle?{" "}
        <Link
          to="/register"
          className="text-indigo-900 font-medium hover:underline"
        >
          Create an account
        </Link>
      </div>

    </div>

  </div>
);


}

export default LoginFunc;