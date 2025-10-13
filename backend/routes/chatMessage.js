import express from "express";
import {
  handleCreateChatMessage,
  handleGetChatMessagesBySessionId,
  handleGetAllChatMessages,
} from "../controllers/chatmessage.js";
import { verifyUserToken, verifyAdminToken } from "../middlewares/index.js";

const router = express.Router();

// Protected routes
router.post("/create", verifyUserToken, handleCreateChatMessage);
router.get(
  "/session/:session_id",
  verifyUserToken,
  handleGetChatMessagesBySessionId
);

// Admin-only routes
router.get("/", verifyAdminToken, handleGetAllChatMessages);

export default router;
