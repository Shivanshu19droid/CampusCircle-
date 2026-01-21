import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { loginUser, signUpUser, logoutUser, getMyProfile, updateMyProfile, getUserProfile, followUser, unfollowUser, generateAiBio, getCurrentUser, fetchPaginatedUserPosts} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";


const userRoutes = Router();

userRoutes.post("/signup",upload.single("avatar"), signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.get("/refresh", isLoggedIn, getCurrentUser);
userRoutes.get("/me", isLoggedIn, getMyProfile);
userRoutes.put("/updateProfile", isLoggedIn, upload.fields([{name: "avatar"}, {name: "coverImage"}]), updateMyProfile);
userRoutes.get("/:id", getUserProfile);
userRoutes.get("/:id/posts", isLoggedIn, fetchPaginatedUserPosts);
userRoutes.put("/follow/:id", isLoggedIn, followUser);
userRoutes.put("/unfollow/:id", isLoggedIn, unfollowUser);
userRoutes.post("/generate-ai-bio", isLoggedIn, generateAiBio);


export default userRoutes;