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
  <HomeLayout>
    <div className="flex items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-indigo-50 via-amber-50 to-white">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-[90%] max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2 tracking-tight">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to your <span className="font-medium text-indigo-600">CampusCircle</span> account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userInput.email}
              onChange={handleUserInput}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 bg-gray-50/60 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 bg-gray-50/60 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  </HomeLayout>
);


}

export default LoginFunc;