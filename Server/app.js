import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

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

app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("CampusCircle API running...");
});

app.use('/api/v1/user', userRoutes);

export default app;
