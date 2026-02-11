import { Router } from "express";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";
import { createNewChat, deleteChat, getAllChats, markChatAsRead, resolveConversationState, searchQueriedUsers } from "../../controllers/chat-module/chat.controllers.js";
import upload from "../../middlewares/multer.middleware.js";

const chatRoutes = Router();

chatRoutes.get("/search", isLoggedIn, searchQueriedUsers);
chatRoutes.get("/get-chats", isLoggedIn, getAllChats);
chatRoutes.put("/mark-read/:chatId", isLoggedIn, markChatAsRead);
chatRoutes.delete("/delete-chat/:chatId", isLoggedIn, deleteChat);
chatRoutes.get("/resolve-conversation-state/:clickedUserId", isLoggedIn, resolveConversationState);
chatRoutes.post("/new-chat/:clickedUserId", isLoggedIn, upload.single("attachment"), createNewChat);

export default chatRoutes;
