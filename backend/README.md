# HIA Backend - Health Insights Agent API

## Overview

The HIA (Health Insights Agent) backend is a Node.js Express API server that provides medical report analysis, AI-powered health insights, and contextual chat functionality. It features PDF medical report processing, vector embeddings for in-context learning, specialized medical AI analysis, and a robust authentication system with JWT tokens.

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── controllers/
│   ├── user.js             # User authentication and management
│   ├── chatSession.js      # Chat session management
│   ├── chatMessage.js      # Contextual chat message handling
│   └── medicalReport.js    # Medical report upload & analysis
├── middlewares/
│   ├── index.js            # Middleware exports
│   ├── verifyUserToken.js  # User token verification
│   ├── verifyAdminToken.js # Admin token verification
│   └── pdfUpload.js        # PDF upload validation
├── models/
│   ├── User.js             # User data model
│   ├── ChatSession.js      # Enhanced chat session model
│   ├── ChatMessage.js      # Chat message data model
│   ├── MedicalReport.js    # Medical report storage model
│   └── VectorEmbedding.js  # Vector embeddings for AI context
├── routes/
│   ├── user.js             # User API routes
│   ├── chatSession.js      # Chat session API routes
│   ├── chatMessage.js      # Chat message API routes
│   └── medicalReport.js    # Medical report API routes
├── utils/
│   ├── ApiResponse.js      # Standardized API response utility
│   ├── clearCookie.js      # Cookie clearing utility
│   ├── generateTokens.js    # JWT token generation
│   ├── setCookie.js        # Cookie setting utility
│   ├── uuidValidation.js   # UUID validation utility
│   ├── PDFProcessor.js     # PDF text extraction & validation
│   ├── VectorService.js    # AI embeddings & contextual learning
│   └── Prompt.js           # Medical analysis prompts
├── uploads/
│   └── medical-reports/    # Medical report file storage
├── logs/                   # Application logs
├── __tests__/              # Test files
├── index.js                # Main server entry point
├── package.json            # Dependencies and scripts
└── docker-compose.yml      # Docker configuration
```

## Technology Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with pg driver + pgvector extension
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3
- **Development**: nodemon 3.1.10
- **AI Integration**:
  - Groq SDK for medical analysis with multi-tier fallback
  - Offline medical analysis when API is unavailable
  - Hugging Face Inference API (sentence-transformers/all-MiniLM-L6-v2) - FREE
  - Fallback hash-based embeddings (no API key required)
  - Medical-only question validation
- **PDF Processing**: pdf-parse for medical report extraction
- **File Upload**: multer for secure PDF handling

## Key Features

### 1. **Medical Report Analysis**

- **PDF Upload & Validation**: Secure PDF upload with strict medical content validation
- **Medical Content Filtering**: Only processes PDFs containing medical keywords and content
- **Text Extraction**: Automatic text extraction from medical reports using pdf-parse
- **AI Analysis**: Comprehensive medical analysis using specialized Groq AI prompts
- **Offline Fallback**: Basic medical analysis when AI services are unavailable
- **Risk Assessment**: Identifies potential health risks with Low/Medium/High levels
- **Personalized Recommendations**: Lifestyle modifications, dietary advice, follow-up tests

### 2. **AI-Powered Intelligence**

- **Vector Embeddings**: Hugging Face embeddings for contextual medical conversations
- **Medical-Only Responses**: AI strictly responds only to medical and health-related questions
- **In-Context Learning**: pgvector database for similarity search and context retrieval
- **Multi-Tier Architecture**: Groq AI with automatic model fallback and offline mode
- **Contextual Responses**: AI responses that reference uploaded medical reports
- **Offline Fallback**: Basic medical guidance when AI services are unavailable
- **Knowledge Retention**: Maintains conversation context across sessions

### 3. **Authentication System**

- **JWT Tokens**: Access tokens (15 minutes) + Refresh tokens (7 days)
- **Multi-Provider Support**: Email/password, Google OAuth, GitHub OAuth
- **Hybrid Authentication**: Supports both Bearer tokens and HTTP-only cookies
- **Secure Cookies**: HTTP-only refresh tokens with SameSite protection
- **Token Refresh**: Automatic token renewal endpoint with Bearer token support
- **Password Security**: bcrypt hashing with salt rounds
- **OAuth Integration**: Seamless backend token generation for OAuth users

### 2. **User Management**

- **User Registration**: Email/password signup with validation
- **OAuth Integration**: Seamless Google and GitHub authentication
- **Profile Management**: User profile updates and retrieval
- **Account Deletion**: Secure user account removal
- **Admin Functions**: User listing and management

### 4. **Enhanced Chat System**

- **Session Management**: Create and manage chat sessions with medical report support
- **Contextual Messages**: AI responses that reference uploaded medical reports
- **Message Handling**: Store and retrieve chat messages with context
- **User Isolation**: Users can only access their own chat data and medical reports
- **UUID Support**: Proper UUID validation and handling

### 5. **Security Features**

- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Request validation and sanitization
- **File Security**: Secure PDF processing with medical content validation
- **Error Handling**: Comprehensive error handling and logging
- **Environment Variables**: Secure configuration management

## API Endpoints

### Medical Reports

- `POST /api/medical-reports/upload/:session_id` - Upload and analyze medical report
- `GET /api/medical-reports/:session_id` - Get medical report information
- `DELETE /api/medical-reports/:session_id` - Delete medical report

### Enhanced Chat Messages

- `POST /api/chat-messages/contextual` - Generate contextual AI response
- `POST /api/chat-messages/create` - Create regular chat message
- `GET /api/chat-messages/session/:session_id` - Get session messages

### Chat Sessions

- `POST /api/chat-sessions/create` - Create new chat session
- `GET /api/chat-sessions/user` - Get user's chat sessions
- `DELETE /api/chat-sessions/:id` - Delete chat session

### User Management

- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh` - Refresh JWT tokens
- `GET /api/users/:id` - Get user profile

Visit http://localhost:5000/api/docs for detailed API documentation.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    provider VARCHAR(20) CHECK (provider IN ('email', 'github', 'google')) NOT NULL,
    provider_id TEXT,
    password_hash TEXT,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Chat Sessions Table (Enhanced)

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    has_medical_report BOOLEAN DEFAULT FALSE,
    medical_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Medical Reports Table

```sql
CREATE TABLE medical_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Vector Embeddings Table

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE vector_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended) OR PostgreSQL 12+
- npm or yarn

### Quick Start with Docker

```bash
# 1. Clone and navigate to backend
git clone https://github.com/harshhh28/hia-js
cd hia-js/backend

# 2. Install dependencies
npm install

# 3. Start PostgreSQL with Docker
docker-compose up -d

# 5. Start the server
npm run dev
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harshhh28/hia-js
   cd hia-js/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   **Option A: Using Docker (Recommended)**

   ```bash
   # Start PostgreSQL with Docker Compose
   docker-compose up -d

   # This will create a PostgreSQL container with:
   # - Database: hia_db
   # - User: postgres
   # - Password: password
   # - Port: 5432
   ```

   **Option B: Manual PostgreSQL Installation**

   ```bash
   # Create database
   createdb hia_db

   # Or using psql
   psql -c "CREATE DATABASE hia_db;"
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory:

   ```env
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:3000

   # Database Configuration (Docker)
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hia_db
   DB_USER=postgres
   DB_PASSWORD=password

   # Database Configuration (Manual Installation)
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=hia_db
   # DB_USER=your_db_user
   # DB_PASSWORD=your_db_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here

   # AI Integration
   GROQ_API_KEY=your-groq-api-key-here
   HUGGINGFACE_API_KEY=your-huggingface-api-key-here

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=uploads/medical-reports

   # Logging Configuration
   LOG_LEVEL=INFO
   LOG_DIR=logs
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Verify the server is running**
   The server will start on `http://localhost:5000` and automatically create database tables.

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when configured)

## Authentication Flow

### 1. User Registration/Login

```javascript
// POST /api/users/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

// Response
{
  "status": "success",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" },
    "accessToken": "jwt_token"
  },
  "message": "User signed up successfully"
}
```

### 2. Token Refresh

```javascript
// POST /api/users/refresh
// Supports both Bearer token and HTTP-only cookie

// Using Bearer token
// Headers: Authorization: Bearer <refresh_token>

// Using HTTP-only cookie (automatic)
// Cookie: refreshToken=<refresh_token>

// Response
{
  "status": "success",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" },
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  },
  "message": "Token refreshed successfully"
}
```

### 3. OAuth User Creation/Login

```javascript
// POST /api/users/oauth
// Called by NextAuth during OAuth flow
{
  "email": "user@example.com",
  "provider": "google", // or "github"
  "provider_id": "oauth_provider_id",
  "name": "John Doe"
}

// Response
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "provider": "google"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "OAuth user authenticated successfully"
}
```

### 4. Protected Route Access

```javascript
// GET /api/users/:id
// Supports both Bearer token and HTTP-only cookie

// Using Bearer token
// Headers: Authorization: Bearer <access_token>

// Using HTTP-only cookie (automatic)
// Cookie: accessToken=<access_token>

// Response
{
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
}
```

## Medical Report Analysis Usage

### Upload Medical Report

```javascript
// POST /api/medical-reports/upload/:session_id
// Content-Type: multipart/form-data
// Headers: Authorization: Bearer <access_token>

// Form data:
// - medicalReport: PDF file (field name must be 'medicalReport')
// - session_id: UUID in request body

// Response
{
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
}
```

### Get Medical Report Information

```javascript
// GET /api/medical-reports/:session_id
// Headers: Authorization: Bearer <access_token>

// Response
{
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
}
```

### Generate Contextual AI Response

```javascript
// POST /api/chat-messages/contextual
// Headers: Authorization: Bearer <access_token>
{
  "session_id": "session_uuid",
  "content": "What does my cholesterol level mean?"
}

// Response
{
  "status": "success",
  "data": {
    "userMessage": {
      "id": "message_uuid",
      "session_id": "session_uuid",
      "content": "What does my cholesterol level mean?",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "assistantMessage": {
      "id": "response_uuid",
      "session_id": "session_uuid",
      "content": "Based on your medical report, your cholesterol level of 220 mg/dL indicates...",
      "role": "assistant",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Contextual response generated successfully"
}
```

## Chat System Usage

### Create Chat Session

```javascript
// POST /api/chat-sessions/create
// Supports both Bearer token and HTTP-only cookie
// Headers: Authorization: Bearer <access_token> (optional)
{
  "title": "Blood Report Analysis"
}

// Response
{
  "status": "success",
  "data": {
    "id": "session_uuid",
    "user_id": "user_uuid",
    "title": "Blood Report Analysis",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chat session created"
}
```

### Send Chat Message

```javascript
// POST /api/chat-messages/create
// Supports both Bearer token and HTTP-only cookie
// Headers: Authorization: Bearer <access_token> (optional)
{
  "session_id": "session_uuid",
  "content": "Please analyze my blood report",
  "role": "user"
}

// Response
{
  "status": "success",
  "data": {
    "id": "message_uuid",
    "session_id": "session_uuid",
    "content": "Please analyze my blood report",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chat message created"
}
```

## Security Considerations

### 1. **JWT Security**

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are signed with a secret key
- Refresh tokens stored in HTTP-only cookies
- Supports both Bearer token and cookie authentication
- Automatic token refresh with new tokens returned

### 2. **Password Security**

- Passwords hashed with bcrypt (10 salt rounds)
- No plain text password storage
- Password validation on registration

### 3. **CORS Configuration**

- Configurable allowed origins
- Credentials enabled for cookie support
- Specific HTTP methods allowed

### 4. **Input Validation**

- UUID validation for IDs
- Required field validation
- Role validation for chat messages
- Email format validation

## Error Handling

The API uses a standardized error response format:

```javascript
// Error Response
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired tokens)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server issues)

## Database Management

### Automatic Table Creation

The server automatically creates all required tables on startup:

- Users table with UUID extension
- Chat sessions table with foreign key constraints
- Chat messages table with foreign key constraints

### Manual Database Operations

```sql
-- Connect to database
psql -d hia_db

-- View tables
\dt

-- View table structure
\d users
\d chat_sessions
\d chat_messages

-- Manual cleanup (if needed)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

## Docker Support

The project includes Docker Compose configuration:

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: hia_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Docker Commands

```bash
# Start PostgreSQL container
docker-compose up -d

# Stop PostgreSQL container
docker-compose down

# View container logs
docker-compose logs postgres

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d hia_db

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

## Development

### Code Structure

- **ES Modules**: Modern JavaScript module system
- **MVC Pattern**: Clear separation of concerns
- **Middleware**: Reusable authentication and validation
- **Utilities**: Helper functions for common operations

### Testing

- Unit tests for controllers and models
- Integration tests for API endpoints
- Authentication flow testing
- Database operation testing

### Logging

- Console logging for development
- Error logging with stack traces
- Request/response logging (when enabled)

## Deployment

### Production Considerations

1. **Environment Variables**: Set secure production values
2. **Database**: Use production PostgreSQL instance
3. **HTTPS**: Enable SSL/TLS for secure communication
4. **CORS**: Configure for production frontend URL
5. **JWT Secret**: Use strong, unique secret key
6. **Process Management**: Use PM2 or similar for process management

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
DB_HOST=your-production-db-host
DB_NAME=hia_production
JWT_SECRET=your-super-secure-production-secret
```

## API Documentation

### Response Format

All API responses follow this structure:

```javascript
{
  "status": "success" | "error",
  "data": any, // Response data (null for errors)
  "message": string, // Human-readable message
  "error"?: string // Error details (only for errors)
}
```

### Authentication Methods

The API supports two authentication methods:

#### Bearer Token Authentication

For protected routes, include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

#### Cookie Authentication

Refresh token is automatically sent via HTTP-only cookie:

```
Cookie: refreshToken=<refresh_token>
```

#### Hybrid Authentication

The middleware checks for tokens in this order:

1. **Authorization header** (Bearer token)
2. **HTTP-only cookie** (accessToken)

This allows seamless integration with both NextAuth (Bearer tokens) and traditional cookie-based authentication.

## Contributing

1. Follow the existing code structure and patterns
2. Add proper error handling for new endpoints
3. Include input validation for all user inputs
4. Update API documentation for new features
5. Write tests for new functionality
6. Use meaningful commit messages

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **JWT Token Errors**

   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **CORS Issues**

   - Verify FRONTEND_URL is correct
   - Check CORS configuration
   - Ensure credentials are enabled

4. **Port Conflicts**
   - Change PORT environment variable
   - Check if port is already in use

### Debug Mode

Enable detailed logging by setting `NODE_ENV=development` in your environment variables.
