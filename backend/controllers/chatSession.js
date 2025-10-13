import ApiResponse from "../utils/ApiResponse.js";
import { ChatSession } from "../models/ChatSession.js";
import { User } from "../models/User.js";

const handleCreateChatSession = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }
    const user_id = req.user.id;
    const { title } = req.body;
    const chatSession = await ChatSession.create({
      user_id: user_id,
      title: title, // title is optional - will be auto-generated if not provided
    });
    return ApiResponse.success(res, chatSession, "Chat session created", 201);
  } catch (error) {
    console.error("Create chat session error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

const handleGetAllChatSessions = async (req, res) => {
  try {
    const chatSessions = await ChatSession.getAll();
    if (!chatSessions) {
      return ApiResponse.error(res, "No chat sessions found", 404);
    }
    return ApiResponse.success(res, chatSessions, "Chat sessions retrieved");
  } catch (error) {
    console.error("Get all chat sessions error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

const handleGetChatSessionsByUserId = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }
    const user_id = req.user.id;
    const chatSessions = await ChatSession.getByUserId(user_id);
    if (!chatSessions) {
      return ApiResponse.error(res, "No chat sessions found", 404);
    }
    return ApiResponse.success(
      res,
      chatSessions,
      "User chat sessions retrieved"
    );
  } catch (error) {
    console.error("Get chat sessions by user ID error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

const handleDeleteChatSession = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }
    const user_id = req.user.id;
    const { id } = req.params;

    const chatSession = await ChatSession.findById(id);
    if (!chatSession) {
      return ApiResponse.error(res, "Chat session not found", 404);
    }

    // Check if the session belongs to the user
    if (chatSession.user_id !== user_id) {
      return ApiResponse.error(res, "Unauthorized to delete this session", 403);
    }

    const deletedSession = await ChatSession.delete(id);
    return ApiResponse.success(
      res,
      deletedSession,
      "Chat session deleted successfully"
    );
  } catch (error) {
    console.error("Delete chat session error:", error);
    return ApiResponse.serverError(res, "Internal server error");
  }
};

export {
  handleCreateChatSession,
  handleGetAllChatSessions,
  handleGetChatSessionsByUserId,
  handleDeleteChatSession,
};
