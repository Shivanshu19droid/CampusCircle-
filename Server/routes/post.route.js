import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { approvePost, commentOnPost, createPost, deletePost, getAllPosts, handleLikeUnlike, rejectPost, viewPost } from "../controllers/post.controllers.js";

const postRoutes = Router();

postRoutes.post("/create", isLoggedIn, upload.single("image"), createPost);
postRoutes.put("/like-unlike/:postId", isLoggedIn, handleLikeUnlike);
postRoutes.post("/comment/:postId", isLoggedIn, commentOnPost);
postRoutes.post("/approve/:postId", isLoggedIn, approvePost);
postRoutes.post("/reject/:postId", isLoggedIn, rejectPost);
postRoutes.get("/all-posts", isLoggedIn, getAllPosts);
postRoutes.get("/:postId", isLoggedIn, viewPost);
postRoutes.post("/delete/:postId", isLoggedIn, deletePost);

export default postRoutes;