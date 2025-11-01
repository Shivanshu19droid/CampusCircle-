import {Schema, model} from "mongoose";
import mongoose from "mongoose";

const groupSchema = new Schema ({
    name: {
        type: String,
        required: [true, "Group name is required"],
        minLength: [5, "Group name must contain at least 5 characters"],
        maxLength: [50, "Group name cannot exceed 50 characters"],
        trim: true,
        unique: [true, "Group name already exists"]
    },
    category: {
        type: String,
        required: true,
        maxLength: [50, "Category cannot exceed 50 characters"]
    },
    description: {
        type: String,   
    },
    icon: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

const Group= model("Group", groupSchema);

export default Group;