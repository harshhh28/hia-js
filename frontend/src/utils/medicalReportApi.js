import { api } from "./api.js";

// Medical Report API functions
export const medicalReportApi = {
  // Upload a medical report PDF
  uploadReport: async (sessionId, file) => {
    try {
      const formData = new FormData();
      formData.append("medicalReport", file);

      const response = await api.post(
        `/api/medical-reports/upload/${sessionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data.data.medicalReport,
      };
    } catch (error) {
      // Handle different types of errors
      if (error.response?.status === 400) {
        // Handle validation errors (wrong file type, size, content, etc.)
        const errorMessage =
          error.response?.data?.message || "Invalid file uploaded";
        return {
          success: false,
          error: errorMessage,
        };
      }

      if (error.response?.status === 413) {
        // Handle file too large error
        return {
          success: false,
          error: "File is too large. Please upload a file smaller than 10MB.",
        };
      }

      // Handle other errors
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to upload report. Please try again.",
      };
    }
  },

  // Get medical report for a session
  getReport: async (sessionId) => {
    try {
      const response = await api.get(`/api/medical-reports/${sessionId}`);
      return {
        success: true,
        data: {
          ...response.data.data,
          original_filename: response.data.data.filename,
          uploaded_at: response.data.data.uploadedAt,
          file_size: response.data.data.fileSize,
          medical_analysis: response.data.data.hasAnalysis,
        },
      };
    } catch (error) {
      // Handle 404 error gracefully - no medical report exists (this is expected)
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "No medical report found for this session",
        };
      }

      // Handle other errors
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get report",
      };
    }
  },

  // Delete medical report for a session
  deleteReport: async (sessionId) => {
    try {
      const response = await api.delete(`/api/medical-reports/${sessionId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Delete report error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete report",
      };
    }
  },

  // Download medical report
  downloadReport: async (sessionId) => {
    try {
      const response = await api.get(
        `/api/medical-reports/download/${sessionId}`,
        {
          responseType: "blob",
        }
      );

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `medical-report-${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        data: "Download started",
      };
    } catch (error) {
      console.error("Download report error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to download report",
      };
    }
  },
};

// Enhanced Chat Message API with contextual responses
export const chatMessageApi = {
  // Create a new chat message with contextual AI response
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
};
