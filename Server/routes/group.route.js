import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createGroup, joinGroup, leaveGroup, getAllGroups, getGroupDetails, deleteGroup, fetchPaginatedGroupMembers, fetchPaginatedGroupPosts, removeFromGroup, makeAdmin, removeFromAdmin, fetchPaginatedQueuedPosts} from "../controllers/group.controllers.js";

const groupRoutes = Router();

groupRoutes.post("/create", isLoggedIn, upload.single("icon"), createGroup);
groupRoutes.post("/join/:groupId", isLoggedIn, joinGroup);
groupRoutes.post("/leave/:groupId", isLoggedIn, leaveGroup);
groupRoutes.get("/", getAllGroups);
groupRoutes.get("/:groupId", getGroupDetails);
groupRoutes.delete("/:groupId", isLoggedIn, deleteGroup);
groupRoutes.get("/:groupId/members", fetchPaginatedGroupMembers);
groupRoutes.get("/:groupId/posts", fetchPaginatedGroupPosts);
groupRoutes.delete("/:groupId/remove-member/:userId", isLoggedIn, removeFromGroup);
groupRoutes.post("/:groupId/make-admin/:userId", isLoggedIn, makeAdmin);
groupRoutes.delete("/:groupId/remove-admin/:userId", isLoggedIn, removeFromAdmin);
groupRoutes.get("/:groupId/queued-posts", isLoggedIn, fetchPaginatedQueuedPosts);

export default groupRoutes;