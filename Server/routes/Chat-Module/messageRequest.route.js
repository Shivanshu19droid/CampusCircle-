import { Router } from "express";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";
import { acceptMessageRequest, cancelSentRequest, createNewMessageRequest, getAllReceivedRequests, getAllSentRequests, rejectMessageRequest } from "../../controllers/chat-module/messageRequest.controllers.js";

const messageRequestRoutes = Router();

messageRequestRoutes.post("/new-request/:clickedUserId", isLoggedIn, createNewMessageRequest);
messageRequestRoutes.get("/sent-requests", isLoggedIn, getAllSentRequests);
messageRequestRoutes.get("/received-requests", isLoggedIn, getAllReceivedRequests);
messageRequestRoutes.delete("/cancel-request/:requestId", isLoggedIn, cancelSentRequest);
messageRequestRoutes.post("/accept-request/:requestId", isLoggedIn, acceptMessageRequest);
messageRequestRoutes.put("/reject-request/:requestId", isLoggedIn, rejectMessageRequest);

export default messageRequestRoutes;