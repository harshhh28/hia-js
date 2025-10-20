import express from "express";
import {
  handleCreateChatMessage,
  handleCreateContextualResponse,
  handleGetChatMessagesBySessionId,
  handleGetAllChatMessages,
} from "../controllers/chatMessage.js";
import { verifyUserToken, verifyAdminToken } from "../middlewares/index.js";

const router = express.Router();

// Protected routes
router.post("/create", verifyUserToken, handleCreateChatMessage);
router.post("/contextual", verifyUserToken, handleCreateContextualResponse);
router.get(
  "/session/:session_id",
  verifyUserToken,
  handleGetChatMessagesBySessionId
);

// Admin-only routes
router.get("/", verifyAdminToken, handleGetAllChatMessages);

export default router;
