import ApiResponse from "../utils/ApiResponse.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { ChatSession } from "../models/ChatSession.js";
import { isValidUUID } from "../utils/uuidValidation.js";
import { VectorService, Logger } from "../utils/VectorService.js";
import { getPrompt } from "../utils/Prompt.js";
import { GroqService } from "../utils/GroqService.js";

const groqService = new GroqService();
const vectorService = new VectorService();

// Function to validate if a question is medical-related
const validateMedicalQuestion = (question) => {
  const medicalKeywords = [
    // Health and medical terms
    "health",
    "medical",
    "doctor",
    "physician",
    "nurse",
    "hospital",
    "clinic",
    "patient",
    "symptoms",
    "diagnosis",
    "treatment",
    "medicine",
    "medication",
    "prescription",
    "dose",
    "dosage",
    "side effects",
    "allergy",
    "allergic",

    // Body parts and systems
    "heart",
    "lung",
    "liver",
    "kidney",
    "brain",
    "stomach",
    "intestine",
    "blood",
    "pressure",
    "pulse",
    "temperature",
    "fever",
    "pain",
    "ache",
    "headache",
    "stomachache",
    "chest pain",
    "back pain",
    "joint pain",

    // Medical tests and procedures
    "test",
    "lab",
    "laboratory",
    "blood test",
    "urine test",
    "x-ray",
    "scan",
    "mri",
    "ct",
    "ultrasound",
    "biopsy",
    "surgery",
    "operation",
    "procedure",

    // Conditions and diseases
    "diabetes",
    "hypertension",
    "cancer",
    "tumor",
    "infection",
    "virus",
    "bacteria",
    "inflammation",
    "disease",
    "condition",
    "disorder",
    "syndrome",

    // Medications and treatments
    "antibiotic",
    "painkiller",
    "vitamin",
    "supplement",
    "therapy",
    "rehabilitation",
    "exercise",
    "diet",
    "nutrition",
    "lifestyle",
    "prevention",
    "cure",

    // Medical report related
    "report",
    "results",
    "findings",
    "normal",
    "abnormal",
    "high",
    "low",
    "elevated",
    "decreased",
    "reference range",
    "units",
    "mg/dl",
    "g/dl",

    // Common medical questions
    "what does",
    "what is",
    "how to",
    "should i",
    "can i",
    "is it normal",
    "why",
    "when",
    "where",
    "how much",
    "how often",
    "how long",
  ];

  const questionLower = question.toLowerCase();

  // Check if the question contains medical keywords
  const foundKeywords = medicalKeywords.filter((keyword) =>
    questionLower.includes(keyword.toLowerCase())
  );

  // Require at least 1 medical keyword to be considered medical
  return foundKeywords.length >= 1;
};

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

const handleCreateContextualResponse = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const { session_id, content } = req.body;

    if (!session_id || !content) {
      return ApiResponse.error(res, "Session ID and content are required", 400);
    }

    if (!isValidUUID(session_id)) {
      return ApiResponse.error(res, "Invalid session ID format", 400);
    }

    // Check if session exists and belongs to user
    const chatSession = await ChatSession.findById(session_id);
    if (!chatSession) {
      return ApiResponse.error(res, "Chat session not found", 404);
    }

    if (chatSession.user_id !== req.user.id) {
      return ApiResponse.error(res, "Unauthorized access to session", 403);
    }

    Logger.logInfo(`Processing contextual response for session ${session_id}`);

    // Validate that the question is medical-related
    const isMedicalQuestion = validateMedicalQuestion(content);
    if (!isMedicalQuestion) {
      return ApiResponse.error(
        res,
        "I can only assist with medical-related questions. Please ask about your health, medical reports, symptoms, treatments, or other medical topics.",
        400
      );
    }

    // Note: User message should already be created by the frontend
    // We only need to generate and save the AI response

    let responseContent;

    // Check if session has medical report for contextual responses
    if (chatSession.has_medical_report) {
      // Use contextual prompt with medical report context
      const contextualPrompt = await vectorService.getContextualPrompt(
        session_id,
        content
      );

      responseContent = await groqService.generateChatResponse(
        contextualPrompt
      );
    } else {
      // Use regular prompt for non-medical sessions
      const prompt = getPrompt(content);

      responseContent = await groqService.generateChatResponse(prompt);
    }

    // Create assistant response
    const assistantMessage = await ChatMessage.create({
      session_id: session_id,
      content: responseContent,
      role: "assistant",
    });

    Logger.logInfo(`Contextual response generated for session ${session_id}`);

    return ApiResponse.success(
      res,
      {
        assistantMessage,
      },
      "Contextual response generated successfully",
      201
    );
  } catch (error) {
    Logger.logError(error, "Create contextual response");
    return ApiResponse.serverError(
      res,
      "Failed to generate contextual response"
    );
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
  handleCreateContextualResponse,
  handleGetChatMessagesBySessionId,
  handleGetAllChatMessages,
};
