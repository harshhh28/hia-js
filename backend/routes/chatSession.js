import express from "express";
import {
  handleCreateChatSession,
  handleGetAllChatSessions,
  handleGetChatSessionsByUserId,
} from "../controllers/chatsession.js";
import { verifyUserToken, verifyAdminToken } from "../middlewares/index.js";

const router = express.Router();

// Protected routes
router.post("/create", verifyUserToken, handleCreateChatSession);
router.get("/user", verifyUserToken, handleGetChatSessionsByUserId);

// Admin-only routes
router.get("/", verifyAdminToken, handleGetAllChatSessions);

export default router;
