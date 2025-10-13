"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleLogout } from "../../utils/auth";
import { chatSessionApi, chatMessageApi } from "../../utils/chatApi";
import Loading from "./Loading";

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

  // Load messages when current session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
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

  const createNewSession = async () => {
    setLoading(true);
    const result = await chatSessionApi.createSession();
    if (result.success) {
      setSessions([result.data, ...sessions]);
      setCurrentSession(result.data);
      setMessages([]);
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

    const userMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      content: newMessage,
      role: "user",
      created_at: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setMessageLoading(true);

    // Send message to backend
    const result = await chatMessageApi.createMessage(
      currentSession.id,
      newMessage,
      "user"
    );

    if (result.success) {
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? result.data : msg))
      );

      // Simulate AI response (you can integrate with your AI service here)
      setTimeout(() => {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          session_id: currentSession.id,
          content:
            "This is a simulated AI response. You can integrate with your AI service here to provide health insights based on blood reports and other medical data.",
          role: "assistant",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setMessageLoading(false);
      }, 1500);
    } else {
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      setMessageLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isClient || status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Health Insights Agent</h1>
              <p className="text-sm text-indigo-100">
                AI-powered health analysis
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:text-indigo-200 transition-colors"
              title="Sign out">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-sm text-indigo-100">
            Welcome, {session.user.name}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={createNewSession}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Chat
              </div>
            )}
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading sessions...
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="mb-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm">No chat sessions yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Create one to get started!
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentSession?.id === session.id
                      ? "bg-indigo-100 text-indigo-900 shadow-sm"
                      : "hover:bg-gray-100 text-gray-700 hover:shadow-sm"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {session.title || "New Chat"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                      title="Delete session">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {currentSession.title || "New Chat"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {messages.length} messages
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600">
                    Ask me about your health, upload blood reports, or get
                    insights about your medical data.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                      }`}>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-indigo-200"
                            : "text-gray-500"
                        }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {messageLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your health, upload reports, or get medical insights..."
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    rows={2}
                    disabled={messageLoading}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || messageLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none flex items-center">
                  {messageLoading ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <svg
                  className="w-20 h-20 mx-auto text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Health Insights Agent
              </h3>
              <p className="text-gray-600 mb-6">
                Get AI-powered insights about your health. Upload blood reports,
                ask questions about symptoms, or get personalized health
                recommendations.
              </p>
              <button
                onClick={createNewSession}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none">
                {loading ? "Creating..." : "Start Your First Chat"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
