import ApiResponse from "../utils/ApiResponse.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { ChatSession } from "../models/ChatSession.js";
import { isValidUUID } from "../utils/uuidValidation.js";

const handleCreateChatMessage = async (req, res) => {
  try {
    const { session_id, content, role } = req.body;
    if (!session_id || !content || !role) {
      return ApiResponse.error(
        res,
        "Session ID, content, and role are required",
        400
      );
    }
    if (role !== "user" && role !== "assistant") {
      return ApiResponse.error(
        res,
        "Role must be either user or assistant",
        400
      );
    }
    if (!isValidUUID(session_id)) {
      return ApiResponse.error(
        res,
        "Invalid session ID format. Expected UUID format.",
        400
      );
    }
    const chatSession = await ChatSession.findById(session_id);
    if (!chatSession) {
      return ApiResponse.error(res, "Chat session not found", 404);
    }
    const chatMessage = await ChatMessage.create({
      session_id: chatSession.id,
      content,
      role,
    });
    return ApiResponse.success(res, chatMessage, "Chat message created", 201);
  } catch (error) {
    console.error("Create chat message error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

const handleGetChatMessagesBySessionId = async (req, res) => {
  try {
    const { session_id } = req.params;
    if (!session_id) {
      return ApiResponse.error(res, "Session ID is required", 400);
    }
    if (!isValidUUID(session_id)) {
      return ApiResponse.error(
        res,
        "Invalid session ID format. Expected UUID format.",
        400
      );
    }
    const chatSession = await ChatSession.findById(session_id);
    if (!chatSession) {
      return ApiResponse.error(res, "Chat session not found", 404);
    }
    const chatMessages = await ChatMessage.getBySessionId(session_id);
    if (!chatMessages) {
      return ApiResponse.error(res, "No chat messages found", 404);
    }
    return ApiResponse.success(res, chatMessages, "Chat messages retrieved");
  } catch (error) {
    console.error("Get chat messages by session ID error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

const handleGetAllChatMessages = async (req, res) => {
  try {
    const chatMessages = await ChatMessage.getAll();
    if (!chatMessages) {
      return ApiResponse.error(res, "No chat messages found", 404);
    }
    return ApiResponse.success(res, chatMessages, "Chat messages retrieved");
  } catch (error) {
    console.error("Get all chat messages error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

export {
  handleCreateChatMessage,
  handleGetChatMessagesBySessionId,
  handleGetAllChatMessages,
};
