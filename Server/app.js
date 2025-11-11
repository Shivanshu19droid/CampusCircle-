import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import groupRoutes from "./routes/group.route.js";
import postRoutes from "./routes/post.route.js";

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

export default app;
