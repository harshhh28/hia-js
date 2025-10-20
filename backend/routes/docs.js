import express from "express";

const router = express.Router();

// API Documentation HTML Page
router.get("/", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HIA Backend API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 20px;
        }

        .version {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .main-content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 30px;
        }

        .sidebar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            height: calc(100vh - 40px);
            max-height: calc(100vh - 40px);
            position: sticky;
            top: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* Custom scrollbar for sidebar */
        .sidebar::-webkit-scrollbar {
            width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a6fd8, #6a4190);
        }

        /* Firefox scrollbar */
        .sidebar {
            scrollbar-width: thin;
            scrollbar-color: #667eea rgba(102, 126, 234, 0.1);
        }

        .sidebar h3 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }

        .nav-section {
            margin-bottom: 30px;
        }

        .nav-section h4 {
            font-size: 1rem;
            color: #667eea;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .nav-item {
            display: block;
            padding: 10px 15px;
            margin-bottom: 5px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }

        .nav-item:hover {
            background: rgba(102, 126, 234, 0.2);
            border-left-color: #667eea;
            transform: translateX(5px);
        }

        .content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .section {
            margin-bottom: 50px;
        }

        .section h2 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 20px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }

        .endpoint {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border-left: 5px solid #667eea;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .method {
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-right: 15px;
        }

        .method.post { background: #28a745; color: white; }
        .method.get { background: #007bff; color: white; }
        .method.put { background: #ffc107; color: black; }
        .method.delete { background: #dc3545; color: white; }

        .path {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
        }

        .description {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 20px;
        }

        .auth-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .auth-badge.required {
            background: #dc3545;
            color: white;
        }

        .auth-badge.optional {
            background: #ffc107;
            color: black;
        }

        .auth-badge.none {
            background: #28a745;
            color: white;
        }

        .subsection {
            margin-bottom: 25px;
        }

        .subsection h4 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin-bottom: 15px;
        }

        .status-code {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-right: 10px;
            margin-bottom: 5px;
        }

        .status-code.success { background: #d4edda; color: #155724; }
        .status-code.error { background: #f8d7da; color: #721c24; }
        .status-code.client-error { background: #fff3cd; color: #856404; }

        .validation-list {
            list-style: none;
            padding-left: 0;
        }

        .validation-list li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
        }

        .validation-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }

        .json-viewer {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .auth-info {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
        }

        .auth-info h3 {
            margin-bottom: 15px;
        }

        .auth-info p {
            margin-bottom: 10px;
        }

        .auth-info code {
            background: rgba(255, 255, 255, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
        }

        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .sidebar {
                position: static;
                height: auto;
                max-height: 400px;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩺 HIA Backend API</h1>
            <p>Health Insights Agent - Comprehensive API Documentation</p>
            <span class="version">v1.0.0</span>
        </div>

        <div class="main-content">
            <div class="sidebar">
                <h3>📚 API Reference</h3>
                
                <div class="nav-section">
                    <h4>🔐 Authentication</h4>
                    <a href="#signup" class="nav-item">POST /signup</a>
                    <a href="#login" class="nav-item">POST /login</a>
                    <a href="#oauth" class="nav-item">POST /oauth</a>
                    <a href="#refresh" class="nav-item">POST /refresh</a>
                    <a href="#logout" class="nav-item">POST /logout</a>
                </div>

                <div class="nav-section">
                    <h4>👤 User Management</h4>
                    <a href="#get-user" class="nav-item">GET /:id</a>
                    <a href="#delete-user" class="nav-item">DELETE /:id</a>
                    <a href="#get-all-users" class="nav-item">GET / (Admin)</a>
                </div>

                <div class="nav-section">
                    <h4>💬 Chat Sessions</h4>
                    <a href="#create-session" class="nav-item">POST /create</a>
                    <a href="#get-sessions" class="nav-item">GET /user</a>
                    <a href="#delete-session" class="nav-item">DELETE /:id</a>
                    <a href="#get-all-sessions" class="nav-item">GET / (Admin)</a>
                </div>

                <div class="nav-section">
                    <h4>🩺 Medical Reports</h4>
                    <a href="#upload-report" class="nav-item">POST /upload/:session_id</a>
                    <a href="#get-report" class="nav-item">GET /:session_id</a>
                    <a href="#delete-report" class="nav-item">DELETE /:session_id</a>
                </div>

                <div class="nav-section">
                    <h4>🤖 AI Services</h4>
                    <a href="#groq-analysis" class="nav-item">POST /groq/medical-analysis</a>
                    <a href="#groq-chat" class="nav-item">POST /groq/chat-response</a>
                </div>

                <div class="nav-section">
                    <h4>📝 Chat Messages</h4>
                    <a href="#create-message" class="nav-item">POST /create</a>
                    <a href="#contextual-response" class="nav-item">POST /contextual</a>
                    <a href="#get-messages" class="nav-item">GET /session/:id</a>
                    <a href="#get-all-messages" class="nav-item">GET / (Admin)</a>
                </div>
            </div>

            <div class="content">
                <div class="auth-info">
                    <h3>🔑 Authentication</h3>
                    <p><strong>Hybrid Authentication:</strong> The API supports both Bearer tokens and HTTP-only cookies.</p>
                    <p><strong>Bearer Token:</strong> Include <code>Authorization: Bearer &lt;token&gt;</code> header</p>
                    <p><strong>Cookies:</strong> Refresh tokens are automatically sent via HTTP-only cookies</p>
                    <p><strong>Priority:</strong> Cookies are checked first, then Bearer tokens</p>
                </div>

                <div class="section">
                    <h2>🔐 Authentication Endpoints</h2>

                    <div class="endpoint" id="signup">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/users/signup</span>
                        </div>
                        <div class="description">Register a new user with email and password</div>
                        <span class="auth-badge none">No Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Email must be valid format</li>
                                <li>Password minimum 6 characters</li>
                                <li>Name minimum 2 characters</li>
                                <li>Email must be unique</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> User registered successfully<br>
                            <span class="status-code client-error">400</span> Validation error or user already exists<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "message": "User signed up successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="login">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/users/login</span>
                        </div>
                        <div class="description">Authenticate user with email and password</div>
                        <span class="auth-badge none">No Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "email": "user@example.com",
  "password": "securepassword123"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Email must exist in database</li>
                                <li>Password must match stored hash</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Login successful<br>
                            <span class="status-code client-error">401</span> Invalid credentials<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "message": "User logged in successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="oauth">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/users/oauth</span>
                        </div>
                        <div class="description">Create or authenticate OAuth user (Google/GitHub)</div>
                        <span class="auth-badge none">No Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "email": "user@gmail.com",
  "provider": "google",
  "provider_id": "google_user_id_123",
  "name": "John Doe"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Email must be valid format</li>
                                <li>Provider must be 'google' or 'github'</li>
                                <li>Provider ID must be provided</li>
                                <li>Name must be provided</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> OAuth authentication successful<br>
                            <span class="status-code client-error">400</span> Validation error or user exists with different provider<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "name": "John Doe",
      "provider": "google"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "OAuth user authenticated successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="refresh">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/users/refresh</span>
                        </div>
                        <div class="description">Refresh expired access token using refresh token</div>
                        <span class="auth-badge optional">Refresh Token Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;refresh_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">refreshToken: HTTP-only cookie with refresh token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Refresh token must be valid</li>
                                <li>Refresh token must not be expired</li>
                                <li>User must exist in database</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Token refreshed successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired refresh token<br>
                            <span class="status-code client-error">404</span> User not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Token refreshed successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="logout">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/users/logout</span>
                        </div>
                        <div class="description">Logout user and clear authentication cookies</div>
                        <span class="auth-badge optional">Authentication Optional</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>If user is authenticated, cookies will be cleared</li>
                                <li>If no user found, returns 404 error</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Logout successful<br>
                            <span class="status-code client-error">404</span> User not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": null,
  "message": "Logged out successfully"
}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>👤 User Management</h2>

                    <div class="endpoint" id="get-user">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/users/:id</span>
                        </div>
                        <div class="description">Get user profile by ID</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>User ID must be valid UUID</li>
                                <li>User must exist in database</li>
                                <li>User can only access their own profile</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> User retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> User not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "provider": "email",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User retrieved successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="delete-user">
                        <div class="endpoint-header">
                            <span class="method delete">DELETE</span>
                            <span class="path">/api/users/:id</span>
                        </div>
                        <div class="description">Delete user account by ID and clear authentication cookies</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>User ID must be valid UUID</li>
                                <li>User must exist in database</li>
                                <li>User can only delete their own account</li>
                                <li>Authentication cookies are automatically cleared</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> User deleted successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> User not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "User deleted successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-all-users">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/users</span>
                        </div>
                        <div class="description">Get all users (Admin only)</div>
                        <span class="auth-badge required">Admin Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Authorization: Bearer &lt;admin_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Admin token must be valid</li>
                                <li>Admin token must match configured ADMIN_TOKEN</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Users retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid admin token<br>
                            <span class="status-code client-error">404</span> No users found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": [
    {
      "id": "uuid1",
      "email": "user1@example.com",
      "name": "User One",
      "provider": "email",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid2",
      "email": "user2@example.com",
      "name": "User Two",
      "provider": "google",
      "created_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "message": "Users retrieved successfully"
}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>💬 Chat Sessions</h2>

                    <div class="endpoint" id="create-session">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/chat-sessions/create</span>
                        </div>
                        <div class="description">Create a new chat session</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "title": "Blood Report Analysis"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>User must be authenticated</li>
                                <li>Title must be string if provided</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">201</span> Chat session created successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "session_uuid",
    "user_id": "user_uuid",
    "title": "Blood Report Analysis",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chat session created"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-sessions">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/chat-sessions/user</span>
                        </div>
                        <div class="description">Get all chat sessions for authenticated user</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>User must be authenticated</li>
                                <li>User can only access their own sessions</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Chat sessions retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> No chat sessions found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": [
    {
      "id": "session_uuid_1",
      "user_id": "user_uuid",
      "title": "Blood Report Analysis",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "session_uuid_2",
      "user_id": "user_uuid",
      "title": "Health Consultation",
      "created_at": "2024-01-02T00:00:00.000Z",
      "updated_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "message": "User chat sessions retrieved"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="delete-session">
                        <div class="endpoint-header">
                            <span class="method delete">DELETE</span>
                            <span class="path">/api/chat-sessions/:id</span>
                        </div>
                        <div class="description">Delete a chat session by ID</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Session must exist</li>
                                <li>User can only delete their own sessions</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Chat session deleted successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">403</span> Unauthorized to delete this session<br>
                            <span class="status-code client-error">404</span> Chat session not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "session_uuid",
    "user_id": "user_uuid",
    "title": "Blood Report Analysis",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chat session deleted successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-all-sessions">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/chat-sessions</span>
                        </div>
                        <div class="description">Get all chat sessions (Admin only)</div>
                        <span class="auth-badge required">Admin Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Authorization: Bearer &lt;admin_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Admin token must be valid</li>
                                <li>Admin token must match configured ADMIN_TOKEN</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Chat sessions retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid admin token<br>
                            <span class="status-code client-error">404</span> No chat sessions found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": [
    {
      "id": "session_uuid_1",
      "user_id": "user_uuid_1",
      "title": "Blood Report Analysis",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "session_uuid_2",
      "user_id": "user_uuid_2",
      "title": "Health Consultation",
      "created_at": "2024-01-02T00:00:00.000Z",
      "updated_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "message": "Chat sessions retrieved"
}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>🩺 Medical Reports</h2>

                    <div class="endpoint" id="upload-report">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/medical-reports/upload/:session_id</span>
                        </div>
                        <div class="description">Upload and analyze a medical report PDF with AI-powered insights</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: multipart/form-data</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">Form Data:
- medicalReport: PDF file (required)
- session_id: UUID in URL parameter</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>PDF file must contain medical content</li>
                                <li>File size limit: 10MB</li>
                                <li>Only medical keywords accepted (200+ keywords)</li>
                                <li>Non-medical PDFs are rejected with clear error messages</li>
                                <li>Session must belong to authenticated user</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Medical report uploaded and analyzed successfully<br>
                            <span class="status-code client-error">400</span> Validation error or non-medical content<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Session not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "medicalReport": {
      "id": "report_uuid",
      "filename": "blood_test_report.pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    },
    "analysis": "Comprehensive AI-generated medical analysis...",
    "validation": {
      "isValid": true,
      "foundKeywords": ["hemoglobin", "glucose", "cholesterol"],
      "confidence": 85.5
    }
  },
  "message": "Medical report uploaded and analyzed successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-report">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/medical-reports/:session_id</span>
                        </div>
                        <div class="description">Get medical report information for a session</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Session must exist</li>
                                <li>User can only access their own medical reports</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Medical report retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Medical report not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "report_uuid",
    "filename": "blood_test_report.pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "processedAt": "2024-01-01T00:00:00.000Z",
    "fileSize": 1024000,
    "hasAnalysis": true
  },
  "message": "Medical report retrieved successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="delete-report">
                        <div class="endpoint-header">
                            <span class="method delete">DELETE</span>
                            <span class="path">/api/medical-reports/:session_id</span>
                        </div>
                        <div class="description">Delete medical report for a session</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Medical report must exist</li>
                                <li>User can only delete their own medical reports</li>
                                <li>Associated file is automatically cleaned up</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Medical report deleted successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Medical report not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "report_uuid",
    "filename": "blood_test_report.pdf"
  },
  "message": "Medical report deleted successfully"
}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>🤖 AI Services</h2>

                    <div class="endpoint" id="groq-analysis">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/groq/medical-analysis</span>
                        </div>
                        <div class="description">Generate AI-powered medical analysis with offline fallback</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "text": "Medical report text content",
  "prompt": "Specialist medical analysis prompt"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Features</h4>
                            <ul class="validation-list">
                                <li>Multi-tier AI model fallback (Primary → Secondary → Tertiary → Fallback)</li>
                                <li>Offline analysis when API is unavailable</li>
                                <li>Text chunking for large medical reports</li>
                                <li>Medical-only content validation</li>
                                <li>Plain text response format (no markdown)</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Medical analysis generated successfully<br>
                            <span class="status-code client-error">400</span> Invalid request or non-medical content<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "analysis": "Comprehensive medical analysis with risk assessment and recommendations...",
    "modelUsed": "meta-llama/llama-4-maverick-17b-128e-instruct",
    "isOffline": false
  },
  "message": "Medical analysis generated successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="groq-chat">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/groq/chat-response</span>
                        </div>
                        <div class="description">Generate contextual AI chat responses for medical questions</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "prompt": "Contextual medical chat prompt",
  "question": "User's medical question"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Features</h4>
                            <ul class="validation-list">
                                <li>Medical-only question validation</li>
                                <li>Contextual responses using uploaded medical reports</li>
                                <li>Offline fallback for basic medical guidance</li>
                                <li>Plain text response format (no markdown)</li>
                                <li>Vector embeddings for context retrieval</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Chat response generated successfully<br>
                            <span class="status-code client-error">400</span> Non-medical question or validation error<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "response": "Based on your medical report, your cholesterol level indicates...",
    "modelUsed": "llama-3.3-70b-versatile",
    "isOffline": false
  },
  "message": "Chat response generated successfully"
}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>📝 Chat Messages</h2>

                    <div class="endpoint" id="create-message">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/chat-messages/create</span>
                        </div>
                        <div class="description">Create a new chat message</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "session_id": "session_uuid",
  "content": "Please analyze my blood report",
  "role": "user"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Content must be provided</li>
                                <li>Role must be 'user' or 'assistant'</li>
                                <li>Session must belong to authenticated user</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">201</span> Chat message created successfully<br>
                            <span class="status-code client-error">400</span> Validation error<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Session not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "id": "message_uuid",
    "session_id": "session_uuid",
    "content": "Please analyze my blood report",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chat message created"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="contextual-response">
                        <div class="endpoint-header">
                            <span class="method post">POST</span>
                            <span class="path">/api/chat-messages/contextual</span>
                        </div>
                        <div class="description">Generate contextual AI response for medical questions with offline fallback</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Request Body</h4>
                            <div class="json-viewer">{
  "session_id": "session_uuid",
  "content": "What does my cholesterol level mean?"
}</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Content must be provided</li>
                                <li>Only medical questions are answered</li>
                                <li>Non-medical questions are redirected</li>
                                <li>Session must belong to authenticated user</li>
                                <li>Context from uploaded medical reports is used</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Features</h4>
                            <ul class="validation-list">
                                <li>Medical-only question validation</li>
                                <li>Contextual responses using vector embeddings</li>
                                <li>Offline fallback for basic medical guidance</li>
                                <li>Plain text response format (no markdown)</li>
                                <li>Multi-tier AI model fallback</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Contextual response generated successfully<br>
                            <span class="status-code client-error">400</span> Non-medical question or validation error<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Session not found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": {
    "assistantMessage": {
      "id": "response_uuid",
      "session_id": "session_uuid",
      "content": "Based on your medical report, your cholesterol level of 220 mg/dL indicates...",
      "role": "assistant",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Contextual response generated successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-messages">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/chat-messages/session/:session_id</span>
                        </div>
                        <div class="description">Get all messages for a specific chat session</div>
                        <span class="auth-badge required">Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers (Optional)</h4>
                            <div class="code-block">Authorization: Bearer &lt;access_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Cookies (Optional)</h4>
                            <div class="code-block">accessToken: HTTP-only cookie with access token</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Session ID must be valid UUID</li>
                                <li>Session must exist</li>
                                <li>User can only access their own session messages</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Messages retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid or expired access token<br>
                            <span class="status-code client-error">404</span> Session not found or no messages found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": [
    {
      "id": "message_uuid_1",
      "session_id": "session_uuid",
      "content": "Please analyze my blood report",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "message_uuid_2",
      "session_id": "session_uuid",
      "content": "I'll analyze your blood report. Please share the details.",
      "role": "assistant",
      "created_at": "2024-01-01T00:01:00.000Z"
    }
  ],
  "message": "Messages retrieved successfully"
}</div>
                        </div>
                    </div>

                    <div class="endpoint" id="get-all-messages">
                        <div class="endpoint-header">
                            <span class="method get">GET</span>
                            <span class="path">/api/chat-messages</span>
                        </div>
                        <div class="description">Get all chat messages (Admin only)</div>
                        <span class="auth-badge required">Admin Authentication Required</span>

                        <div class="subsection">
                            <h4>Headers</h4>
                            <div class="code-block">Authorization: Bearer &lt;admin_token&gt;
Content-Type: application/json</div>
                        </div>

                        <div class="subsection">
                            <h4>Validation</h4>
                            <ul class="validation-list">
                                <li>Admin token must be valid</li>
                                <li>Admin token must match configured ADMIN_TOKEN</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h4>Status Codes</h4>
                            <span class="status-code success">200</span> Messages retrieved successfully<br>
                            <span class="status-code client-error">401</span> Invalid admin token<br>
                            <span class="status-code client-error">404</span> No messages found<br>
                            <span class="status-code error">500</span> Internal server error
                        </div>

                        <div class="subsection">
                            <h4>Response</h4>
                            <div class="json-viewer">{
  "status": "success",
  "data": [
    {
      "id": "message_uuid_1",
      "session_id": "session_uuid_1",
      "content": "Please analyze my blood report",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "message_uuid_2",
      "session_id": "session_uuid_1",
      "content": "I'll analyze your blood report.",
      "role": "assistant",
      "created_at": "2024-01-01T00:01:00.000Z"
    }
  ],
  "message": "Messages retrieved successfully"
}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Highlight current section in navigation
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.endpoint');
            const navItems = document.querySelectorAll('.nav-item');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + current) {
                    item.classList.add('active');
                }
            });
        });
    </script>
</body>
</html>`;

  res.send(html);
});

export default router;
