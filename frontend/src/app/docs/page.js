"use client";

import { useState } from "react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "📋 Overview", icon: "📋" },
    { id: "authentication", title: "🔐 Authentication", icon: "🔐" },
    { id: "api-client", title: "🌐 API Client", icon: "🌐" },
    { id: "chat-sessions", title: "💬 Chat Sessions", icon: "💬" },
    { id: "chat-messages", title: "📝 Chat Messages", icon: "📝" },
    { id: "error-handling", title: "⚠️ Error Handling", icon: "⚠️" },
    { id: "examples", title: "💡 Examples", icon: "💡" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Frontend API Documentation
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The HIA Frontend provides a comprehensive set of API utilities for
          interacting with the backend. All API calls are automatically
          authenticated using NextAuth sessions and include proper error
          handling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔧 Key Features
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Automatic token attachment from NextAuth session</li>
            <li>• Automatic retry logic for expired tokens</li>
            <li>• Comprehensive error handling</li>
            <li>• TypeScript-ready API responses</li>
            <li>• Cookie-based authentication support</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📦 Available APIs
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <code className="bg-gray-100 px-2 py-1 rounded">api.js</code> -
              Base API client
            </li>
            <li>
              •{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">chatApi.js</code>{" "}
              - Chat-specific APIs
            </li>
            <li>
              • <code className="bg-gray-100 px-2 py-1 rounded">auth.js</code> -
              Authentication utilities
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          ⚠️ Important Notes
        </h3>
        <ul className="space-y-2 text-yellow-700">
          <li>• All API calls require authentication (except login/signup)</li>
          <li>• Tokens are automatically attached from NextAuth session</li>
          <li>• Failed requests are automatically retried once</li>
          <li>• Users are redirected to login on authentication failure</li>
        </ul>
      </div>
    </div>
  );

  const renderAuthentication = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication System
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The frontend uses NextAuth.js for session management and automatically
          handles authentication for all API calls. Tokens are stored in the
          NextAuth session and automatically attached to requests.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔑 Token Management
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">Access tokens (15 minutes)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700">Refresh tokens (7 days)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-gray-700">Automatic token refresh</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🛡️ Security Features
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• HTTP-only cookies for refresh tokens</li>
            <li>• CSRF protection with SameSite cookies</li>
            <li>• Automatic token cleanup on logout</li>
            <li>• Secure token storage in NextAuth session</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📝 Authentication Flow
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">User Login</h4>
              <p className="text-gray-600">
                User authenticates via email/password or OAuth (Google/GitHub)
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Token Generation</h4>
              <p className="text-gray-600">
                Backend generates JWT tokens and stores them in NextAuth session
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Automatic Attachment
              </h4>
              <p className="text-gray-600">
                API client automatically attaches access token to all requests
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Token Refresh</h4>
              <p className="text-gray-600">
                NextAuth automatically refreshes expired tokens in background
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiClient = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">API Client</h2>
        <p className="text-gray-700 leading-relaxed">
          The base API client provides HTTP methods with automatic
          authentication, retry logic, and error handling.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📦 Available Methods
        </h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                GET
              </span>
              <code className="text-gray-900 font-mono">
                api.get(url, config)
              </code>
            </div>
            <p className="text-gray-600">
              Make a GET request with automatic authentication
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                POST
              </span>
              <code className="text-gray-900 font-mono">
                api.post(url, data, config)
              </code>
            </div>
            <p className="text-gray-600">
              Make a POST request with automatic authentication
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                PUT
              </span>
              <code className="text-gray-900 font-mono">
                api.put(url, data, config)
              </code>
            </div>
            <p className="text-gray-600">
              Make a PUT request with automatic authentication
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                DELETE
              </span>
              <code className="text-gray-900 font-mono">
                api.delete(url, config)
              </code>
            </div>
            <p className="text-gray-600">
              Make a DELETE request with automatic authentication
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔧 Configuration
        </h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-green-400">// Base API client configuration</div>
          <div className="text-blue-400">const</div>{" "}
          <span className="text-yellow-400">apiClient</span> ={" "}
          <span className="text-blue-400">axios</span>.
          <span className="text-yellow-400">create</span>({"{"}
          <div className="ml-4">
            <div>
              <span className="text-purple-400">baseURL</span>:{" "}
              <span className="text-green-400">"http://localhost:5000"</span>,
            </div>
            <div>
              <span className="text-purple-400">withCredentials</span>:{" "}
              <span className="text-orange-400">true</span>,
            </div>
            <div>
              <span className="text-purple-400">timeout</span>:{" "}
              <span className="text-orange-400">10000</span>
            </div>
          </div>
          {"}"});
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔄 Request Interceptor
        </h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-green-400">// Automatic token attachment</div>
          <div>
            <span className="text-blue-400">apiClient</span>.
            <span className="text-yellow-400">interceptors</span>.
            <span className="text-yellow-400">request</span>.
            <span className="text-yellow-400">use</span>(
            <span className="text-blue-400">async</span> (
            <span className="text-purple-400">config</span>) =&gt; {"{"}
          </div>
          <div className="ml-4">
            <div>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-yellow-400">session</span> ={" "}
              <span className="text-blue-400">await</span>{" "}
              <span className="text-yellow-400">getSession</span>();
            </div>
            <div>
              <span className="text-blue-400">if</span> (
              <span className="text-yellow-400">session</span>?.
              <span className="text-purple-400">accessToken</span>) {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-yellow-400">config</span>.
                <span className="text-purple-400">headers</span>.
                <span className="text-purple-400">Authorization</span> ={" "}
                <span className="text-green-400">
                  `Bearer $&#123;session.accessToken&#125;`
                </span>
                ;
              </div>
            </div>
            <div>{"}"}</div>
            <div>
              <span className="text-blue-400">return</span>{" "}
              <span className="text-yellow-400">config</span>;
            </div>
          </div>
          <div>{"}"});</div>
        </div>
      </div>
    </div>
  );

  const renderChatSessions = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chat Sessions API
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Manage chat sessions with full CRUD operations. All operations require
          authentication and are scoped to the authenticated user.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              POST
            </span>
            <code className="text-gray-900 font-mono">
              chatSessionApi.createSession(title)
            </code>
          </div>
          <p className="text-gray-600 mb-4">Create a new chat session</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div>
                  <code className="text-blue-600">title</code>{" "}
                  <span className="text-gray-500">(string, optional)</span> -
                  Session title
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>{"{"}</div>
                <div className="ml-4">
                  <div>
                    <span className="text-purple-400">success</span>:{" "}
                    <span className="text-orange-400">true</span>,
                  </div>
                  <div>
                    <span className="text-purple-400">data</span>: {"{"}
                  </div>
                  <div className="ml-4">
                    <div>
                      <span className="text-purple-400">id</span>:{" "}
                      <span className="text-green-400">"session_uuid"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">user_id</span>:{" "}
                      <span className="text-green-400">"user_uuid"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">title</span>:{" "}
                      <span className="text-green-400">
                        "Blood Report Analysis"
                      </span>
                      ,
                    </div>
                    <div>
                      <span className="text-purple-400">created_at</span>:{" "}
                      <span className="text-green-400">
                        "2024-01-01T00:00:00.000Z"
                      </span>
                    </div>
                  </div>
                  <div>{"}"}</div>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              GET
            </span>
            <code className="text-gray-900 font-mono">
              chatSessionApi.getUserSessions()
            </code>
          </div>
          <p className="text-gray-600 mb-4">
            Get all chat sessions for the authenticated user
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>{"{"}</div>
                <div className="ml-4">
                  <div>
                    <span className="text-purple-400">success</span>:{" "}
                    <span className="text-orange-400">true</span>,
                  </div>
                  <div>
                    <span className="text-purple-400">data</span>: [
                  </div>
                  <div className="ml-4">
                    <div>{"{"}</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-purple-400">id</span>:{" "}
                        <span className="text-green-400">"session_uuid_1"</span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">title</span>:{" "}
                        <span className="text-green-400">
                          "Blood Report Analysis"
                        </span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">created_at</span>:{" "}
                        <span className="text-green-400">
                          "2024-01-01T00:00:00.000Z"
                        </span>
                      </div>
                    </div>
                    <div>{"}"}</div>
                  </div>
                  <div>]</div>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              DELETE
            </span>
            <code className="text-gray-900 font-mono">
              chatSessionApi.deleteSession(sessionId)
            </code>
          </div>
          <p className="text-gray-600 mb-4">Delete a chat session by ID</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div>
                  <code className="text-blue-600">sessionId</code>{" "}
                  <span className="text-gray-500">(string, required)</span> -
                  Session UUID
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>{"{"}</div>
                <div className="ml-4">
                  <div>
                    <span className="text-purple-400">success</span>:{" "}
                    <span className="text-orange-400">true</span>,
                  </div>
                  <div>
                    <span className="text-purple-400">data</span>: {"{"}
                  </div>
                  <div className="ml-4">
                    <div>
                      <span className="text-purple-400">id</span>:{" "}
                      <span className="text-green-400">"session_uuid"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">title</span>:{" "}
                      <span className="text-green-400">
                        "Blood Report Analysis"
                      </span>
                    </div>
                  </div>
                  <div>{"}"}</div>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatMessages = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chat Messages API
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Manage chat messages within sessions. Messages support both user and
          assistant roles for AI conversations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              POST
            </span>
            <code className="text-gray-900 font-mono">
              chatMessageApi.createMessage(sessionId, content, role)
            </code>
          </div>
          <p className="text-gray-600 mb-4">Create a new chat message</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div>
                  <code className="text-blue-600">sessionId</code>{" "}
                  <span className="text-gray-500">(string, required)</span> -
                  Session UUID
                </div>
                <div>
                  <code className="text-blue-600">content</code>{" "}
                  <span className="text-gray-500">(string, required)</span> -
                  Message content
                </div>
                <div>
                  <code className="text-blue-600">role</code>{" "}
                  <span className="text-gray-500">(string, required)</span> -
                  "user" or "assistant"
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>{"{"}</div>
                <div className="ml-4">
                  <div>
                    <span className="text-purple-400">success</span>:{" "}
                    <span className="text-orange-400">true</span>,
                  </div>
                  <div>
                    <span className="text-purple-400">data</span>: {"{"}
                  </div>
                  <div className="ml-4">
                    <div>
                      <span className="text-purple-400">id</span>:{" "}
                      <span className="text-green-400">"message_uuid"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">session_id</span>:{" "}
                      <span className="text-green-400">"session_uuid"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">content</span>:{" "}
                      <span className="text-green-400">
                        "Please analyze my blood report"
                      </span>
                      ,
                    </div>
                    <div>
                      <span className="text-purple-400">role</span>:{" "}
                      <span className="text-green-400">"user"</span>,
                    </div>
                    <div>
                      <span className="text-purple-400">created_at</span>:{" "}
                      <span className="text-green-400">
                        "2024-01-01T00:00:00.000Z"
                      </span>
                    </div>
                  </div>
                  <div>{"}"}</div>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              GET
            </span>
            <code className="text-gray-900 font-mono">
              chatMessageApi.getSessionMessages(sessionId)
            </code>
          </div>
          <p className="text-gray-600 mb-4">
            Get all messages for a specific chat session
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div>
                  <code className="text-blue-600">sessionId</code>{" "}
                  <span className="text-gray-500">(string, required)</span> -
                  Session UUID
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>{"{"}</div>
                <div className="ml-4">
                  <div>
                    <span className="text-purple-400">success</span>:{" "}
                    <span className="text-orange-400">true</span>,
                  </div>
                  <div>
                    <span className="text-purple-400">data</span>: [
                  </div>
                  <div className="ml-4">
                    <div>{"{"}</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-purple-400">id</span>:{" "}
                        <span className="text-green-400">"message_uuid_1"</span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">content</span>:{" "}
                        <span className="text-green-400">
                          "Please analyze my blood report"
                        </span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">role</span>:{" "}
                        <span className="text-green-400">"user"</span>,
                      </div>
                      <div>
                        <span className="text-purple-400">created_at</span>:{" "}
                        <span className="text-green-400">
                          "2024-01-01T00:00:00.000Z"
                        </span>
                      </div>
                    </div>
                    <div>{"}"},</div>
                    <div>{"{"}</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-purple-400">id</span>:{" "}
                        <span className="text-green-400">"message_uuid_2"</span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">content</span>:{" "}
                        <span className="text-green-400">
                          "I'll analyze your blood report."
                        </span>
                        ,
                      </div>
                      <div>
                        <span className="text-purple-400">role</span>:{" "}
                        <span className="text-green-400">"assistant"</span>,
                      </div>
                      <div>
                        <span className="text-purple-400">created_at</span>:{" "}
                        <span className="text-green-400">
                          "2024-01-01T00:01:00.000Z"
                        </span>
                      </div>
                    </div>
                    <div>{"}"}</div>
                  </div>
                  <div>]</div>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorHandling = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error Handling
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Comprehensive error handling with automatic retry logic and
          user-friendly error messages.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔄 Automatic Retry
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• 401 errors trigger automatic retry</li>
            <li>• NextAuth handles token refresh</li>
            <li>• Maximum 1 retry per request</li>
            <li>• Redirect to login on failure</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ⚠️ Error Types
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <span className="text-red-600">401</span> - Authentication
              failed
            </li>
            <li>
              • <span className="text-orange-600">400</span> - Validation error
            </li>
            <li>
              • <span className="text-purple-600">404</span> - Resource not
              found
            </li>
            <li>
              • <span className="text-gray-600">500</span> - Server error
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📝 Error Response Format
        </h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div>{"{"}</div>
          <div className="ml-4">
            <div>
              <span className="text-purple-400">success</span>:{" "}
              <span className="text-orange-400">false</span>,
            </div>
            <div>
              <span className="text-purple-400">error</span>:{" "}
              <span className="text-green-400">"Error message"</span>
            </div>
          </div>
          <div>{"}"}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🛠️ Error Handling Example
        </h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-green-400">// Example error handling</div>
          <div>
            <span className="text-blue-400">try</span> {"{"}
          </div>
          <div className="ml-4">
            <div>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-yellow-400">result</span> ={" "}
              <span className="text-blue-400">await</span>{" "}
              <span className="text-yellow-400">chatSessionApi</span>.
              <span className="text-purple-400">createSession</span>();
            </div>
            <div>
              <span className="text-blue-400">if</span> (
              <span className="text-yellow-400">result</span>.
              <span className="text-purple-400">success</span>) {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">console</span>.
                <span className="text-yellow-400">log</span>(
                <span className="text-green-400">"Session created:"</span>,{" "}
                <span className="text-yellow-400">result</span>.
                <span className="text-purple-400">data</span>);
              </div>
            </div>
            <div>
              {"}"} <span className="text-blue-400">else</span> {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">console</span>.
                <span className="text-yellow-400">error</span>(
                <span className="text-green-400">"Error:"</span>,{" "}
                <span className="text-yellow-400">result</span>.
                <span className="text-purple-400">error</span>);
              </div>
            </div>
            <div>{"}"}</div>
          </div>
          <div>
            {"}"} <span className="text-blue-400">catch</span> (
            <span className="text-purple-400">error</span>) {"{"}
          </div>
          <div className="ml-4">
            <div>
              <span className="text-blue-400">console</span>.
              <span className="text-yellow-400">error</span>(
              <span className="text-green-400">"Network error:"</span>,{" "}
              <span className="text-purple-400">error</span>);
            </div>
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  );

  const renderExamples = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Usage Examples
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Practical examples showing how to use the frontend APIs in your
          components.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💬 Creating a Chat Session
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">// In your React component</div>
            <div>
              <span className="text-blue-400">import</span> {"{"}{" "}
              <span className="text-yellow-400">chatSessionApi</span> {"}"}{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-green-400">"../utils/chatApi"</span>;
            </div>
            <br />
            <div>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-yellow-400">createNewSession</span> ={" "}
              <span className="text-blue-400">async</span> () =&gt; {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">const</span>{" "}
                <span className="text-yellow-400">result</span> ={" "}
                <span className="text-blue-400">await</span>{" "}
                <span className="text-yellow-400">chatSessionApi</span>.
                <span className="text-purple-400">createSession</span>(
                <span className="text-green-400">"Blood Report Analysis"</span>
                );
              </div>
              <div>
                <span className="text-blue-400">if</span> (
                <span className="text-yellow-400">result</span>.
                <span className="text-purple-400">success</span>) {"{"}
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-blue-400">setSessions</span>([
                  <span className="text-yellow-400">result</span>.
                  <span className="text-purple-400">data</span>, ...
                  <span className="text-yellow-400">sessions</span>]);
                </div>
                <div>
                  <span className="text-blue-400">setCurrentSession</span>(
                  <span className="text-yellow-400">result</span>.
                  <span className="text-purple-400">data</span>);
                </div>
              </div>
              <div>{"}"}</div>
            </div>
            <div>{"}"};</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Sending a Message
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">// Send user message</div>
            <div>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-yellow-400">sendMessage</span> ={" "}
              <span className="text-blue-400">async</span> (
              <span className="text-purple-400">content</span>) =&gt; {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">const</span>{" "}
                <span className="text-yellow-400">result</span> ={" "}
                <span className="text-blue-400">await</span>{" "}
                <span className="text-yellow-400">chatMessageApi</span>.
                <span className="text-purple-400">createMessage</span>(
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-yellow-400">currentSession</span>.
                  <span className="text-purple-400">id</span>,
                </div>
                <div>
                  <span className="text-purple-400">content</span>,
                </div>
                <div>
                  <span className="text-green-400">"user"</span>
                </div>
              </div>
              <div>);</div>
              <br />
              <div>
                <span className="text-blue-400">if</span> (
                <span className="text-yellow-400">result</span>.
                <span className="text-purple-400">success</span>) {"{"}
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-blue-400">setMessages</span>([...
                  <span className="text-yellow-400">messages</span>,{" "}
                  <span className="text-yellow-400">result</span>.
                  <span className="text-purple-400">data</span>]);
                </div>
              </div>
              <div>{"}"}</div>
            </div>
            <div>{"}"};</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Loading User Sessions
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">
              // Load sessions on component mount
            </div>
            <div>
              <span className="text-blue-400">useEffect</span>(() =&gt; {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">const</span>{" "}
                <span className="text-yellow-400">loadSessions</span> ={" "}
                <span className="text-blue-400">async</span> () =&gt; {"{"}
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-blue-400">const</span>{" "}
                  <span className="text-yellow-400">result</span> ={" "}
                  <span className="text-blue-400">await</span>{" "}
                  <span className="text-yellow-400">chatSessionApi</span>.
                  <span className="text-purple-400">getUserSessions</span>();
                </div>
                <div>
                  <span className="text-blue-400">if</span> (
                  <span className="text-yellow-400">result</span>.
                  <span className="text-purple-400">success</span>) {"{"}
                </div>
                <div className="ml-4">
                  <div>
                    <span className="text-blue-400">setSessions</span>(
                    <span className="text-yellow-400">result</span>.
                    <span className="text-purple-400">data</span>);
                  </div>
                </div>
                <div>{"}"}</div>
              </div>
              <div>{"}"};</div>
              <br />
              <div>
                <span className="text-yellow-400">loadSessions</span>();
              </div>
            </div>
            <div>{"}"}, []);</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔄 Token Refresh
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">
              // Manual token refresh (usually automatic)
            </div>
            <div>
              <span className="text-blue-400">import</span> {"{"}{" "}
              <span className="text-yellow-400">refreshAccessToken</span> {"}"}{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-green-400">"../utils/api"</span>;
            </div>
            <br />
            <div>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-yellow-400">refreshTokens</span> ={" "}
              <span className="text-blue-400">async</span> () =&gt; {"{"}
            </div>
            <div className="ml-4">
              <div>
                <span className="text-blue-400">const</span>{" "}
                <span className="text-yellow-400">result</span> ={" "}
                <span className="text-blue-400">await</span>{" "}
                <span className="text-yellow-400">refreshAccessToken</span>();
              </div>
              <div>
                <span className="text-blue-400">if</span> (
                <span className="text-yellow-400">result</span>.
                <span className="text-purple-400">success</span>) {"{"}
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-blue-400">console</span>.
                  <span className="text-yellow-400">log</span>(
                  <span className="text-green-400">"Tokens refreshed"</span>);
                </div>
              </div>
              <div>{"}"}</div>
            </div>
            <div>{"}"};</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "authentication":
        return renderAuthentication();
      case "api-client":
        return renderApiClient();
      case "chat-sessions":
        return renderChatSessions();
      case "chat-messages":
        return renderChatMessages();
      case "error-handling":
        return renderErrorHandling();
      case "examples":
        return renderExamples();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🩺 HIA Frontend API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guide to using the Health Insights Agent frontend APIs
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📚 Navigation
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
