"use client";

import { FileText, Upload } from "lucide-react";
import { cn } from "../../utils/cn";

export default function MedicalReportStatus({ hasMedicalReport, onClick }) {
  if (!hasMedicalReport) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
        title="Upload medical report">
        <Upload className="w-4 h-4" />
        <span className="text-sm">Upload Report</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2 p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10"
      title="Medical report uploaded">
      <FileText className="w-4 h-4" />
      <span className="text-sm">Report Uploaded</span>
    </button>
  );
}
