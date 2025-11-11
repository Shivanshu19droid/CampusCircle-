import {Schema, model} from "mongoose";
import mongoose from "mongoose";

const queuedPostSchema = new Schema({
    content: {
    type: String,
    required: true,
    maxLength: [3000, "Post cannot exceed 3000 characters"]
  },
  image: {
    public_id: String,
    secure_url: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const QueuedPost = model("QueuedPost", queuedPostSchema);

export default QueuedPost;