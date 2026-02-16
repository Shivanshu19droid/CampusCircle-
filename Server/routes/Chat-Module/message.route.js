import { Router } from "express";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";
import { getAllMessagesFromChat, sendMessage } from "../../controllers/chat-module/message.controllers.js";

const messageRoutes = Router();

messageRoutes.post("/send-message/:chatId", isLoggedIn, upload.single("attachment"), sendMessage);
messageRoutes.get("/get-messages/:chatId", isLoggedIn, getAllMessagesFromChat);

export default messageRoutes;