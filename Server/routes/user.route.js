import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { loginUser, signUpUser, logoutUser } from "../controllers/user.controllers.js";


const userRoutes = Router();

userRoutes.post("/signup",upload.single("avatar"), signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);

export default userRoutes;