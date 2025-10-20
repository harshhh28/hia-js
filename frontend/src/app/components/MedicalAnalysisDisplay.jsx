"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { medicalReportApi } from "../../utils/medicalReportApi";
import { cn } from "../../utils/cn";

export default function MedicalAnalysisDisplay({
  sessionId,
  hasMedicalReport,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (hasMedicalReport) {
      loadAnalysis();
    }
  }, [hasMedicalReport]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const result = await medicalReportApi.getReport(sessionId);
      if (result.success && result.data?.medical_analysis) {
        setAnalysis(result.data.medical_analysis);
      }
    } catch (error) {
      // Handle 404 gracefully - no medical report exists
      if (error.response?.status === 404) {
      } else {
        console.error("Failed to load analysis:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasMedicalReport) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <span className="text-slate-300">Loading medical analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300">
            Medical report uploaded. Analysis in progress...
          </span>
        </div>
      </div>
    );
  }

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Analysis Header */}
      <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg border border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Medical Analysis</h3>
              <p className="text-sm text-slate-400">
                Comprehensive health insights
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Analysis Content */}
      {expanded && (
        <div className="space-y-4">
          {/* Risk Assessment */}
          {analysis.risk_level && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={cn(
                    "p-2 rounded-lg border",
                    getRiskLevelColor(analysis.risk_level)
                  )}>
                  {getRiskIcon(analysis.risk_level)}
                </div>
                <div>
                  <h4 className="font-medium text-white">Risk Assessment</h4>
                  <p className="text-sm text-slate-400">
                    Overall health risk level
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium",
                  getRiskLevelColor(analysis.risk_level)
                )}>
                {analysis.risk_level.toUpperCase()} RISK
              </div>
            </div>
          )}

          {/* Key Findings */}
          {analysis.key_findings && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-red-400" />
                <span>Key Findings</span>
              </h4>
              <div className="prose prose-sm prose-invert max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap">
                  {analysis.key_findings}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Recommendations</span>
              </h4>
              <div className="prose prose-sm prose-invert max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap">
                  {analysis.recommendations}
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Tests */}
          {analysis.follow_up_tests && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Recommended Follow-up Tests</span>
              </h4>
              <div className="prose prose-sm prose-invert max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap">
                  {analysis.follow_up_tests}
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-300 mb-2">
                  Important Disclaimer
                </h4>
                <p className="text-sm text-yellow-200/80">
                  This AI-generated analysis is for informational purposes only
                  and should not replace professional medical advice. Always
                  consult with a qualified healthcare provider for medical
                  decisions and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
