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
          folder: "CampusCircle/avatars",
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

const getMyProfile = async(req, res, next) => {
  try{
     const user = await User.findById(req.user.id).select("-password");
     if(!user){
      return next(new AppError("No User Found", 404));
     }

     res.status(200).json({
      success: true,
      message: "User Profile fetched successfully",
      user
     })
  } catch(error){
    return next(new AppError(error.message, 500));
  }
}

const updateMyProfile = async(req, res, next) => {
  try{
    const {fullName, bio, skills, links} = req.body;

    const updatedData = {
      fullName,
      bio,
      skills,
      links
    }

    //updating the avatar
    if(req.files && req.files.avatar){
        try{
          const result = await cloudinary.v2.uploader.upload(req.files.avatar[0].path, {
          folder: "CampusCircle/avatars",
          width: 250,
          gravity: "faces",
          crop: "fill"
        });

        if(result){
          updatedData.avatar = {
            public_id: result.public_id,
            secure_url: result.secure_url
          }
        }

        fs.rm(`uploads/${req.files.avatar[0].filename}`);
      
        } catch(error){
          return next(new AppError(error.message || "Avatar upload failed", 500));
        }
    }

    //updating the cover image
    if(req.files && req.files.coverImage){
      
      try{
          const result = await cloudinary.v2.uploader.upload(req.files.coverImage[0].path, {
          folder: "CampusCircle/CoverImages"
        });

        if(result){
          updatedData.coverImage = {
            public_id: result.public_id,
            secure_url: result.secure_url
          }

          fs.rm(`uploads/${req.files.coverImage[0].filename}`);
        }
      } catch(error){
        return next(new AppError(error.message || "CoverImage Upload failed", 500));
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, {new: true, runValidators: true});

    if(!user){
      return next(new AppError("User not found", 404));
    }


    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });

    }
    catch(error){
    return next(new AppError(error.message, 500));
  }
}

const getUserProfile = async(req, res, next) => {
  try{
    const user = await User.findById(req.params.id).select("-password");

    if(!user){
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Profile fetched successfully",
      user
    })
  } catch(error){
    return next(new AppError(error.message, 500));
  }
}

const followUser = async(req, res, next) => {
  try{
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if(!userToFollow || !currentUser){
      return next(new AppError("User not found", 404));
    }

    if(currentUser.following.includes(userToFollow._id)){
      return next(new AppError(`You are already following ${userToFollow.fullName}`, 400));
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();
    
    res.status(200).json({
      success: true,
      message: `You are now following ${userToFollow.fullName}`,
    });

  } catch(error){
    return next(new AppError(error.message, 500));
  }
}

const unfollowUser = async(req, res, next) => {
  try{
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if(!userToUnfollow || !currentUser){
      return next(new AppError("User not found", 404));
    }

    if(!currentUser.following.includes(userToUnfollow._id)){
      return next(new AppError(`You are not following ${userToUnfollow.fullName}`, 400));
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    )

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    )

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.fullName}`,
    })
  } catch(error){
    return next(new AppError(error.message, 500));
  }
}





export {
    signUpUser,
    loginUser,
    logoutUser,
    getMyProfile,
    updateMyProfile,
    getUserProfile,
    followUser,
    unfollowUser
}
