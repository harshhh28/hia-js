import { api } from "./api.js";

// Chat Session API functions
export const chatSessionApi = {
  // Create a new chat session
  createSession: async (title = null) => {
    try {
      const response = await api.post("/api/chat-sessions/create", { title });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Create session error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create session",
      };
    }
  },

  // Get all chat sessions for the current user
  getUserSessions: async () => {
    try {
      const response = await api.get("/api/chat-sessions/user");
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Get user sessions error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get sessions",
      };
    }
  },

  // Delete a chat session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/api/chat-sessions/${sessionId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Delete session error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete session",
      };
    }
  },
};

// Chat Message API functions
export const chatMessageApi = {
  // Create a new chat message
  createMessage: async (sessionId, content, role) => {
    try {
      const response = await api.post("/api/chat-messages/create", {
        session_id: sessionId,
        content,
        role,
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Create message error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create message",
      };
    }
  },

  // Get all messages for a specific session
  getSessionMessages: async (sessionId) => {
    try {
      const response = await api.get(`/api/chat-messages/session/${sessionId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Get session messages error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get messages",
      };
    }
  },

  // Get AI response for a message (contextual)
  getAIResponse: async (sessionId, message) => {
    try {
      const response = await api.post("/api/chat-messages/contextual", {
        session_id: sessionId,
        content: message,
      });
      return {
        success: true,
        data: {
          assistantMessage: response.data.data.assistantMessage,
        },
      };
    } catch (error) {
      console.error("Get AI response error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get AI response",
      };
    }
  },
};
