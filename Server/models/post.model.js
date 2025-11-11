import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema({
  content: {
    type: String,
    maxLength: [3000, "Post cannot exceed 3000 characters"],
  },
  image: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        maxLength: [1000, "Comment cannot exceed 1000 characters"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = model("Post", postSchema);

export default Post;
