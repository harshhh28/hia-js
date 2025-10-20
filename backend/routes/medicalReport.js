import express from "express";
import {
  handleUploadMedicalReport,
  handleGetMedicalReport,
  handleDeleteMedicalReport,
  handleDownloadMedicalReport,
  handleTestPDFProcessing,
} from "../controllers/medicalReport.js";
import {
  uploadMedicalReport,
  validateMedicalReport,
  handleUploadError,
} from "../middlewares/pdfUpload.js";
import { verifyUserToken } from "../middlewares/index.js";

const router = express.Router();

// Test endpoint to verify PDF processing without uploading
router.post(
  "/test-pdf/check-processing",
  verifyUserToken,
  uploadMedicalReport,
  handleTestPDFProcessing
);

// Upload medical report for a chat session
router.post(
  "/upload/:session_id",
  verifyUserToken,
  uploadMedicalReport,
  validateMedicalReport,
  handleUploadError,
  handleUploadMedicalReport
);

// Download medical report for a chat session (must come before /:session_id)
router.get(
  "/download/:session_id",
  verifyUserToken,
  handleDownloadMedicalReport
);

// Get medical report for a chat session
router.get("/:session_id", verifyUserToken, handleGetMedicalReport);

// Delete medical report for a chat session
router.delete("/:session_id", verifyUserToken, handleDeleteMedicalReport);

export default router;
