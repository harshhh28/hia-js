"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  Trash2,
} from "lucide-react";
import { medicalReportApi } from "../../utils/medicalReportApi";
import { cn } from "../../utils/cn";

export default function MedicalReportUpload({
  sessionId,
  onReportUploaded,
  onReportDeleted,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [report, setReport] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Clear any previous errors
    setUploadError(null);
    setUploadSuccess(false);

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const result = await medicalReportApi.uploadReport(sessionId, file);

      if (result.success) {
        setReport(result.data);
        setUploadSuccess(true);
        onReportUploaded?.(result.data);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        setUploadError(result.error);
      }
    } catch (error) {
      setUploadError("Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteReport = async () => {
    if (!report) return;

    if (
      window.confirm("Are you sure you want to delete this medical report?")
    ) {
      try {
        const result = await medicalReportApi.deleteReport(sessionId);
        if (result.success) {
          setReport(null);
          onReportDeleted?.();
        } else {
          alert("Failed to delete report: " + result.error);
        }
      } catch (error) {
        alert("Failed to delete report. Please try again.");
      }
    }
  };

  const handleDownloadReport = async () => {
    if (!report) return;

    try {
      await medicalReportApi.downloadReport(sessionId);
    } catch (error) {
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!report && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300",
            dragActive
              ? "border-red-500 bg-red-500/10"
              : "border-slate-600 hover:border-slate-500 bg-slate-800/30"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-slate-300" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Medical Report <span className="text-red-400">*</span>
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                <span className="text-red-400 font-medium">Required:</span> Drag
                and drop your PDF medical report here, or click to browse
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50">
                {isUploading ? "Uploading..." : "Choose File"}
              </button>
            </div>

            <div className="text-xs text-slate-500">
              <p>Supported format: PDF only</p>
              <p>Maximum size: 10MB</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg">
          <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <span className="text-slate-300">Processing medical report...</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Dismiss error">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300">
            Medical report uploaded and analyzed successfully!
          </span>
        </div>
      )}

      {/* Report Info */}
      {report && (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">
                  {report.original_filename}
                </h4>
                <p className="text-sm text-slate-400">
                  {(report.file_size / 1024 / 1024).toFixed(2)} MB •
                  {new Date(report.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadReport}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                title="Download report">
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteReport}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                title="Delete report">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {report.medical_analysis && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2">
                AI Analysis Available
              </h5>
              <p className="text-xs text-slate-400">
                Your medical report has been analyzed. You can now ask questions
                about your health data.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
