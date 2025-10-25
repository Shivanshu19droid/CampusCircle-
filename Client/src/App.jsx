import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import HomeLayout from "./layouts/HomeLayouts.jsx";
import LoginFunc from "./pages/Auth/loginPage.jsx";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "../Redux/store.js";
import SignUpFunc from "./pages/Auth/signupPage.jsx";
import ViewProfile from "./pages/Profile/viewProfilePage.jsx";
import ProtectedRoutes from "./components/Auth/ProtectedRoute.jsx";
import EditProfile from "./pages/Profile/editProfilePage.jsx";


function App() {
  

  return (
   <Provider store={store}>
       <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginFunc />} />
            <Route path="/register" element={<SignUpFunc />} />
            <Route path="/view-profile/:id" element={<ViewProfile />} />
            
            <Route path="/edit-profile" element={<ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>} 
            />
            
         </Routes>
         <Toaster />
    </BrowserRouter>
   </Provider>
  )
}

export default App
