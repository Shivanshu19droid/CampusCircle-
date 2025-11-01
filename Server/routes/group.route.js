import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createGroup, joinGroup, leaveGroup, getAllGroups, getGroupDetails, deleteGroup} from "../controllers/group.controllers.js";

const groupRoutes = Router();

groupRoutes.post("/create", isLoggedIn, upload.single("icon"), createGroup);
groupRoutes.post("/join/:groupId", isLoggedIn, joinGroup);
groupRoutes.post("/leave/:groupId", isLoggedIn, leaveGroup);
groupRoutes.get("/", getAllGroups);
groupRoutes.get("/:groupId", getGroupDetails);
groupRoutes.delete("/:groupId", isLoggedIn, deleteGroup);

export default groupRoutes;