import { Schema, model } from "mongoose";

const messageRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "rejected"],
        default: "pending"
    }
}, {timestamps: true});

const MessageRequest = model("MessageRequest", messageRequestSchema);

export default MessageRequest;