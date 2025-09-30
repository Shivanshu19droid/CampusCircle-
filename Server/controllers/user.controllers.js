import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import { config } from "dotenv";
config();

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

//signup + login
const signUpUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return next(new AppError("All fields are required", 400));
    }

    //checking if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
    });

    //file upload logic
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "CampusCircle",
          width: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(new AppError(error.message || "Image upload failed", 500));
      }
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//login user
const loginUser = async(req, res, next) => {

  try{
      const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user){
      return next(new AppError("No user found, check if the email you entered is correct", 400));
    }

    const isMatch = await user.comparePassword(password, user.password);

    if(!isMatch){
      return next(new AppError("The Email or Password is incorrect"));
    }

    //generate token
    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "You have been logged in successfully",
      user,
    });


  } catch(error){
    return next(new AppError(error.message, 500));
  }

}

//logout user
const logoutUser = async(req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have been logged out successfully"
  });
}





export {
    signUpUser,
    loginUser,
    logoutUser
}
