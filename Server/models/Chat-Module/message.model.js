import { Schema, Mongoose } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: {
        type: [
            {
                url: String,
                localPath: String
            }
        ],
        default: []
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = Mongoose.model("Message", messageSchema);

export default Message;