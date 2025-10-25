//after defining the user model, we also define the related functions like - generatign web tokens, comparing passwords, hashing passwords so that they can directly be called inside the controllers

import { Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
import crypto from 'crypto';
import {type} from 'os';
import mongoose from 'mongoose';


//creating the user schema

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            requried: [true,"Name is required"],
            minLength: [5, "Name must contain at least 5 characters"],
            maxLength: [50, "Name cannot exceed 50 characters"],
            trim: true
        },
        email: {
            type: String, 
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please fill in a valid email address",
             ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, "Password must contain at least 8 characters"],
            select: false, //while returning the response, the password would not be sent/displayed
        },
        avatar: {
            public_id: {
                type: String
            },
            secure_url: {
                type: String
            }
        },
        coverImage: {
            public_id: {
                type: String
            },
            secure_url: {
                type: String
            }
        },
        bio: {
            type: String,
            maxLength: 200,
            default: ""
        },
        currentProfession: {
            type: String,
            maxLength: 50,
            default: ""
        },
        currentCompany: {
            type: String,
            maxLength: 50,
            default: ""
        },
        currentLocation: {
            type: String,
            maxLength: 50,
            default: ""
        },
        skills: [String], //array of strings
        links: {
            github: String,
            linkedIn: String,
            portfolio: String
        },
        role: {
            type: String,
            enum: ["ADMIN", "ALUMNI", "STUDENT", "FACULTY"],
            default: "STUDENT"
        },
        batch: {
            type: String,
            default: "2025"
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
        followers: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"  
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    
    }, {timestamps: true}
);

//now defining the related functions

//hashing the password before saving to DB if it is changed
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    generateJWTToken: async function(){
        return await jwt.sign(
            {
                id: this._id,
                email: this.email,
                role: this.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }

        );
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password);
    },

    generatePasswordResetToken: async function(){
        
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

        return resetToken;
    }
};

const User = model("User", userSchema);

export default User;