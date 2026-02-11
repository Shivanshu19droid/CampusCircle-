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
import CommunityPage from "./pages/community/CommunityPage.jsx";
import PostPage from "./pages/community/PostPage.jsx";
import GroupPage from "./pages/community/GroupPage.jsx";
import QueuedPostPage from "./pages/community/QueuedPostPage.jsx";
import CreatePostPage from "./pages/community/CreatePostPage.jsx";
import CreateGroupPage from "./pages/community/CreateGroupPage.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../Redux/Slices/AuthSlice.js";
import EditGroupPage from "./pages/community/EditGroupPage.jsx";



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  

  return (
       <BrowserRouter>
       {/* VANTA BACKGROUND — mounted ONCE */}
       
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginFunc />} />
            <Route path="/register" element={<SignUpFunc />} />
            <Route path="/view-profile/:id" element={<ViewProfile />} />
            
            <Route path="/edit-profile" element={<ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>} 
            />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/posts/:postId" element={<PostPage/>} />
            <Route path="/community/groups/:groupId" element={<GroupPage/>} />
            <Route path="/community/:groupId/queued-posts" element={<QueuedPostPage />} />
            <Route path="/community/create-post" element={<CreatePostPage />} />
            <Route path="/community/new-group" element={<CreateGroupPage />} />
            <Route path="/community/:groupId/edit-group" element={<EditGroupPage />} />
            
         </Routes>
         <Toaster />
    </BrowserRouter>
  )
}

export default App;
