import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import groupRoutes from "./routes/group.route.js";
import postRoutes from "./routes/post.route.js";
import chatRoutes from "./routes/Chat-Module/chat.route.js";
import messageRequestRoutes from "./routes/Chat-Module/messageRequest.route.js";
import messageRoutes from "./routes/Chat-Module/message.route.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("CampusCircle API running...");
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/group', groupRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message-requests', messageRequestRoutes);
app.use('/api/v1/message', messageRoutes);

export default app;
