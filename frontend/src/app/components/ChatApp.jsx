"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleLogout } from "../../utils/auth";
import { chatSessionApi, chatMessageApi } from "../../utils/chatApi";
import { medicalReportApi } from "../../utils/medicalReportApi";
import { cn } from "../../utils/cn";
import Loading from "./Loading";
import MedicalReportUpload from "./MedicalReportUpload";
import MedicalAnalysisDisplay from "./MedicalAnalysisDisplay";
import MedicalReportStatus from "./MedicalReportStatus";
import {
  MessageCircle,
  Plus,
  Trash2,
  Send,
  Bot,
  User,
  LogOut,
  Sparkles,
  Clock,
  MoreVertical,
  Menu,
  X,
  FileText,
  Upload,
} from "lucide-react";

export default function ChatApp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [medicalReport, setMedicalReport] = useState(null);
  const [showReportUpload, setShowReportUpload] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (status === "loading") return;
    if (!session) {
      router.push("/auth");
      return;
    }
  }, [session, status, router, isClient]);

  // Load user sessions on component mount
  useEffect(() => {
    if (session) {
      loadSessions();
    }
  }, [session]);

  // Load messages and medical report when current session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
      loadMedicalReport(currentSession.id);
    }
  }, [currentSession]);

  const loadSessions = async () => {
    setSessionsLoading(true);
    const result = await chatSessionApi.getUserSessions();
    if (result.success) {
      setSessions(result.data);
      // Auto-select first session if available
      if (result.data.length > 0 && !currentSession) {
        setCurrentSession(result.data[0]);
      }
    }
    setSessionsLoading(false);
  };

  const loadMessages = async (sessionId) => {
    const result = await chatMessageApi.getSessionMessages(sessionId);
    if (result.success) {
      setMessages(result.data);
    }
  };

  const loadMedicalReport = async (sessionId) => {
    try {
      const result = await medicalReportApi.getReport(sessionId);
      if (result.success) {
        setMedicalReport(result.data);
        setShowReportUpload(false);
      } else {
        // If no medical report exists (404), show upload option
        setMedicalReport(null);
        setShowReportUpload(true);
      }
    } catch (error) {
      // Handle 404 error gracefully - no medical report exists
      if (error.response?.status === 404) {
        setMedicalReport(null);
        setShowReportUpload(true);
      } else {
        console.error("Error loading medical report:", error);
        setMedicalReport(null);
        setShowReportUpload(true);
      }
    }
  };

  const createNewSession = async () => {
    setLoading(true);
    const result = await chatSessionApi.createSession();
    if (result.success) {
      setSessions([result.data, ...sessions]);
      setCurrentSession(result.data);
      setMessages([]);
      setMedicalReport(null);
      setShowReportUpload(true);
    }
    setLoading(false);
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat session?")) {
      const result = await chatSessionApi.deleteSession(sessionId);
      if (result.success) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
        }
      } else {
        alert("Failed to delete session: " + result.error);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession || messageLoading) return;

    // Require medical report before allowing chat
    if (!medicalReport) {
      alert("Please upload a medical report before starting the conversation.");
      return;
    }

    const userMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      content: newMessage,
      role: "user",
      created_at: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages([...messages, userMessage]);
    const messageContent = newMessage;
    setNewMessage("");
    setMessageLoading(true);

    try {
      // Send message to backend
      const result = await chatMessageApi.createMessage(
        currentSession.id,
        messageContent,
        "user"
      );

      if (result.success) {
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((msg) => (msg.id === userMessage.id ? result.data : msg))
        );

        // Get AI response
        const aiResult = await chatMessageApi.getAIResponse(
          currentSession.id,
          messageContent
        );

        if (aiResult.success) {
          // Add the assistant message
          setMessages((prev) => [...prev, aiResult.data.assistantMessage]);
        } else {
          // Fallback response if AI fails
          const fallbackMessage = {
            id: `ai-${Date.now()}`,
            session_id: currentSession.id,
            content:
              "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
            role: "assistant",
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, fallbackMessage]);
        }
      } else {
        // Remove temp message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
        alert("Failed to send message: " + result.error);
      }
    } catch (error) {
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      alert("Failed to send message. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Don't send if no medical report is uploaded
      if (!medicalReport) {
        alert(
          "Please upload a medical report before starting the conversation."
        );
        return;
      }
      sendMessage();
    }
  };

  const handleReportUploaded = (report) => {
    setMedicalReport(report);
    setShowReportUpload(false);
    // Reload messages to show the AI analysis message
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  };

  const handleReportDeleted = () => {
    setMedicalReport(null);
    setShowReportUpload(true);
  };

  if (!isClient || status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-80 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50",
          "lg:relative lg:translate-x-0 lg:z-auto",
          "fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base lg:text-lg font-semibold text-white">
                  Health AI
                </h1>
                <p className="text-xs text-slate-400 hidden lg:block">
                  Intelligent Health Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 lg:hidden"
                title="Close sidebar">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 lg:mt-3 text-sm text-slate-300">
            Welcome back,{" "}
            <span className="font-medium text-white">
              {session?.user?.name || "User"}
            </span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 lg:px-6 pb-4">
          <button
            onClick={createNewSession}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </>
            )}
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 lg:px-4">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                <span className="text-sm">Loading conversations...</span>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 mb-1">
                No conversations yet
              </p>
              <p className="text-xs text-slate-500">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            <div className="space-y-1 pb-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    setCurrentSession(session);
                    setIsMobileSidebarOpen(false); // Close sidebar on mobile when session is selected
                  }}
                  className={cn(
                    "group relative p-3 rounded-xl cursor-pointer transition-all duration-200",
                    currentSession?.id === session.id
                      ? "bg-red-500/10 border border-red-500/20 text-white"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white border border-transparent"
                  )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate mb-1">
                        {session.title || "New Chat"}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(session.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {session.has_medical_report && (
                          <FileText
                            className="w-3 h-3 text-red-400"
                            title="Medical report uploaded"
                          />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-500/10"
                      title="Delete conversation">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/50">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-slate-900/30 backdrop-blur-xl border-b border-slate-800/50 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 lg:hidden"
                    title="Open sidebar">
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-semibold text-white">
                      {currentSession.title || "New Chat"}
                    </h2>
                    <p className="text-xs lg:text-sm text-slate-400">
                      {messages.length} messages •{" "}
                      {new Date(currentSession.created_at).toLocaleDateString()}
                      {medicalReport
                        ? " • Medical Report Uploaded"
                        : " • Upload Required"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {showReportUpload && (
                    <button
                      onClick={() => setShowReportUpload(!showReportUpload)}
                      className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                      title="Upload medical report">
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                  {medicalReport && (
                    <button
                      onClick={() => setShowReportUpload(!showReportUpload)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10"
                      title="Medical report uploaded">
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400 hidden sm:block">
                    AI Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gradient-to-b from-slate-950/50 to-slate-950">
              {/* Medical Report Upload */}
              {showReportUpload && (
                <div className="max-w-4xl mx-auto">
                  <MedicalReportUpload
                    sessionId={currentSession.id}
                    onReportUploaded={handleReportUploaded}
                    onReportDeleted={handleReportDeleted}
                  />
                </div>
              )}

              {/* Medical Analysis Display */}
              {medicalReport && (
                <div className="max-w-4xl mx-auto">
                  <MedicalAnalysisDisplay
                    sessionId={currentSession.id}
                    hasMedicalReport={!!medicalReport}
                  />
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center mt-8 lg:mt-16">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center">
                    <Bot className="w-8 h-8 lg:w-10 lg:h-10 text-slate-500" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-2 lg:mb-3">
                    {medicalReport ? "Start a conversation" : "Upload Required"}
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm lg:text-base px-4">
                    {medicalReport
                      ? "Ask me questions about your medical report. I'm here to help you understand your health better."
                      : "Please upload a medical report to start chatting. I need your medical data to provide personalized health insights."}
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}>
                      <div
                        className={cn(
                          "flex items-start space-x-2 lg:space-x-3 max-w-xs sm:max-w-sm lg:max-w-2xl",
                          message.role === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        )}>
                        <div
                          className={cn(
                            "w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            message.role === "user"
                              ? "bg-gradient-to-br from-red-500 to-red-600"
                              : "bg-slate-800 border border-slate-700"
                          )}>
                          {message.role === "user" ? (
                            <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-slate-300" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "px-3 py-2 lg:px-4 lg:py-3 rounded-2xl shadow-lg",
                            message.role === "user"
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-md"
                              : "bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-bl-md border border-slate-700/50"
                          )}>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div
                            className={cn(
                              "text-xs mt-1 lg:mt-2 flex items-center space-x-1",
                              message.role === "user"
                                ? "text-red-100"
                                : "text-slate-500"
                            )}>
                            <Clock className="w-2 h-2 lg:w-3 lg:h-3" />
                            <span>
                              {new Date(
                                message.created_at
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {messageLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 lg:space-x-3 max-w-xs sm:max-w-sm lg:max-w-2xl">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-slate-300" />
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-2xl rounded-bl-md border border-slate-700/50 px-3 py-2 lg:px-4 lg:py-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}></div>
                          <div
                            className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-xs lg:text-sm text-slate-400">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-slate-900/30 backdrop-blur-xl border-t border-slate-800/50 p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-3 lg:space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        medicalReport
                          ? "Ask questions about your medical report..."
                          : "Upload a medical report first to start chatting..."
                      }
                      className="w-full resize-none border border-slate-700 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 pr-10 lg:pr-12 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 bg-slate-800/50 text-white placeholder-slate-400 backdrop-blur-sm text-sm lg:text-base"
                      rows={2}
                      disabled={messageLoading || !medicalReport}
                    />
                    <div className="absolute right-3 bottom-2 lg:bottom-3 text-xs text-slate-500 hidden sm:block">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={
                      !newMessage.trim() || messageLoading || !medicalReport
                    }
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center transform hover:-translate-y-0.5 disabled:transform-none">
                    {messageLoading ? (
                      <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-950/50 to-slate-950 p-4">
            <div className="text-center max-w-lg">
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-glow-lg">
                <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                Welcome to Health AI
              </h3>
              <p className="text-slate-400 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                Your intelligent health assistant is ready to help. Get
                AI-powered insights about your health, analyze medical reports,
                and receive personalized recommendations.
              </p>
              <button
                onClick={createNewSession}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none flex items-center space-x-2 mx-auto">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Start Your First Chat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
