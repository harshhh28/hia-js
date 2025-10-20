import ApiResponse from "../utils/ApiResponse.js";
import { MedicalReport } from "../models/MedicalReport.js";
import { ChatSession } from "../models/ChatSession.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { PDFProcessor } from "../utils/PDFProcessor.js";
import { VectorService, Logger } from "../utils/VectorService.js";
import { getMedicalAnalysisPrompt } from "../utils/Prompt.js";
import { GroqService } from "../utils/GroqService.js";
import { isValidUUID } from "../utils/uuidValidation.js";
import fs from "fs";
import path from "path";

const groqService = new GroqService();
const vectorService = new VectorService();

const handleUploadMedicalReport = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const { session_id } = req.params;

    if (!session_id) {
      return ApiResponse.error(res, "Session ID is required", 400);
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

    if (!req.file) {
      return ApiResponse.error(res, "Medical report PDF file is required", 400);
    }

    Logger.logInfo(`Processing medical report for session ${session_id}`);

    // Process the PDF first to validate it
    let processingResult;
    try {
      processingResult = await PDFProcessor.processMedicalReport(req.file.path);
    } catch (error) {
      console.error("PDF processing failed:", error.message);
      // Clean up the file since processing failed
      PDFProcessor.cleanupFile(req.file.path);
      return ApiResponse.error(
        res,
        `PDF processing failed: ${error.message}`,
        400
      );
    }

    // Validate that the PDF contains medical content
    if (!processingResult.validation.isValid) {
      console.error(
        "PDF does not contain medical content:",
        processingResult.validation
      );
      // Clean up the file since it's not medical
      PDFProcessor.cleanupFile(req.file.path);
      return ApiResponse.error(
        res,
        "The uploaded PDF does not appear to contain medical content. Please upload a valid medical report.",
        400
      );
    }

    // Only check for existing report after successful PDF processing
    const existingReport = await MedicalReport.findBySessionId(session_id);
    if (existingReport) {
      // Clean up the file since we can't use it
      PDFProcessor.cleanupFile(req.file.path);
      return ApiResponse.error(
        res,
        "Session already has a medical report",
        400
      );
    }

    // Store medical report in database
    const medicalReport = await MedicalReport.create({
      session_id: session_id,
      filename: req.file.filename,
      original_filename: req.file.originalname,
      file_path: req.file.path,
      extracted_text: processingResult.text,
      file_size: req.file.size,
    });

    Logger.logInfo(`Medical report stored with ID: ${medicalReport.id}`);

    // Generate medical analysis using Groq
    const analysisPrompt = getMedicalAnalysisPrompt(processingResult.text);

    let medicalAnalysis;
    try {
      medicalAnalysis = await groqService.generateMedicalAnalysis(
        analysisPrompt
      );
    } catch (error) {
      console.error("Medical analysis generation failed:", error.message);
      // Clean up the medical report record since analysis failed
      await MedicalReport.deleteBySessionId(session_id);
      PDFProcessor.cleanupFile(req.file.path);
      return ApiResponse.error(
        res,
        `Medical analysis failed: ${error.message}`,
        400
      );
    }

    // Store embeddings for in-context learning
    try {
      await vectorService.storeMedicalReportEmbeddings(
        session_id,
        processingResult.text,
        medicalAnalysis
      );
    } catch (error) {
      console.error("Embedding storage failed:", error.message);
      // Clean up the medical report record since embedding storage failed
      await MedicalReport.deleteBySessionId(session_id);
      PDFProcessor.cleanupFile(req.file.path);
      return ApiResponse.error(
        res,
        `Failed to store embeddings: ${error.message}`,
        400
      );
    }

    // Only update chat session after successful processing
    await ChatSession.updateMedicalAnalysis(session_id, medicalAnalysis);

    // Create initial analysis message in chat
    await ChatMessage.create({
      session_id: session_id,
      content: medicalAnalysis,
      role: "assistant",
    });

    Logger.logInfo(`Medical analysis completed for session ${session_id}`);

    return ApiResponse.success(
      res,
      {
        medicalReport: {
          id: medicalReport.id,
          filename: medicalReport.original_filename,
          uploadedAt: medicalReport.uploaded_at,
        },
        analysis: medicalAnalysis,
        validation: processingResult.validation,
      },
      "Medical report uploaded and analyzed successfully",
      201
    );
  } catch (error) {
    Logger.logError(error, "Upload medical report");

    // Clean up uploaded file if processing failed
    if (req.file && req.file.path) {
      PDFProcessor.cleanupFile(req.file.path);
    }

    return ApiResponse.serverError(res, "Failed to process medical report");
  }
};

const handleGetMedicalReport = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const { session_id } = req.params;

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

    const medicalReport = await MedicalReport.findBySessionId(session_id);
    if (!medicalReport) {
      return ApiResponse.error(
        res,
        "No medical report found for this session",
        404
      );
    }

    return ApiResponse.success(
      res,
      {
        id: medicalReport.id,
        filename: medicalReport.original_filename,
        uploadedAt: medicalReport.uploaded_at,
        processedAt: medicalReport.processed_at,
        fileSize: medicalReport.file_size,
        hasAnalysis: !!chatSession.medical_analysis,
      },
      "Medical report retrieved successfully"
    );
  } catch (error) {
    Logger.logError(error, "Get medical report");
    return ApiResponse.serverError(res, "Failed to retrieve medical report");
  }
};

const handleDeleteMedicalReport = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const { session_id } = req.params;

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

    const medicalReport = await MedicalReport.findBySessionId(session_id);
    if (!medicalReport) {
      return ApiResponse.error(
        res,
        "No medical report found for this session",
        404
      );
    }

    // Clean up file
    PDFProcessor.cleanupFile(medicalReport.file_path);

    // Clean up embeddings
    await vectorService.cleanupSessionEmbeddings(session_id);

    // Delete medical report from database
    await MedicalReport.delete(medicalReport.id);

    // Reset chat session medical analysis
    await ChatSession.updateMedicalAnalysis(session_id, null);

    Logger.logInfo(`Medical report deleted for session ${session_id}`);

    return ApiResponse.success(
      res,
      null,
      "Medical report deleted successfully"
    );
  } catch (error) {
    Logger.logError(error, "Delete medical report");
    return ApiResponse.serverError(res, "Failed to delete medical report");
  }
};

const handleDownloadMedicalReport = async (req, res) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const { session_id } = req.params;

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

    const medicalReport = await MedicalReport.findBySessionId(session_id);
    if (!medicalReport) {
      return ApiResponse.error(
        res,
        "No medical report found for this session",
        404
      );
    }

    // Check if file exists
    if (!fs.existsSync(medicalReport.file_path)) {
      return ApiResponse.error(res, "Medical report file not found", 404);
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${medicalReport.original_filename}"`
    );
    res.setHeader("Content-Length", medicalReport.file_size);

    // Stream the file
    const fileStream = fs.createReadStream(medicalReport.file_path);
    fileStream.pipe(res);

    Logger.logInfo(`Medical report downloaded for session ${session_id}`);
  } catch (error) {
    Logger.logError(error, "Download medical report");
    return ApiResponse.serverError(res, "Failed to download medical report");
  }
};

// Test endpoint to verify PDF processing without saving
const handleTestPDFProcessing = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, "No file uploaded", 400);
    }

    // Process the PDF without saving to database
    const processingResult = await PDFProcessor.processMedicalReport(
      req.file.path
    );

    // Clean up the temporary file
    PDFProcessor.cleanupFile(req.file.path);

    return ApiResponse.success(
      res,
      {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        extractedTextLength: processingResult.text.length,
        pages: processingResult.pages,
        preview: processingResult.text.substring(0, 200),
        medicalIndicators: processingResult.validation.foundKeywords,
        confidence: processingResult.validation.confidence,
      },
      "PDF processing test successful"
    );
  } catch (error) {
    console.error("❌ PDF processing test failed:", error.message);

    // Clean up the temporary file if it exists
    if (req.file && req.file.path) {
      PDFProcessor.cleanupFile(req.file.path);
    }

    return ApiResponse.error(
      res,
      `PDF processing test failed: ${error.message}`,
      400
    );
  }
};

export {
  handleUploadMedicalReport,
  handleGetMedicalReport,
  handleDeleteMedicalReport,
  handleDownloadMedicalReport,
  handleTestPDFProcessing,
};
