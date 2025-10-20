# 🩺 HIA (Health Insights Agent)

AI Agent to analyze blood reports and provide detailed health insights.

<p align="center">
  <a href="https://github.com/harshhh28/hia-js/issues"><img src="https://img.shields.io/github/issues/harshhh28/hia-js"></a> 
  <a href="https://github.com/harshhh28/hia-js/stargazers"><img src="https://img.shields.io/github/stars/harshhh28/hia-js"></a>
  <a href="https://github.com/harshhh28/hia-js/network/members"><img src="https://img.shields.io/github/forks/harshhh28/hia-js"></a>
  <a href="https://github.com/harshhh28/hia-js/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> |
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> |
  <a href="#-installation">Installation</a> |
  <a href="#-contributing">Contributing</a> |
  <a href="#%EF%B8%8F-author">Author</a>
</p>

<p align="center">
  <a href="https://github.com/harshhh28/hia-js"><img src="https://raw.githubusercontent.com/harshhh28/hia/main/public/HIA_demo.gif" alt="Usage Demo"></a>
</p>

## 🌟 Features

### 🩺 Medical Report Analysis

- **PDF Medical Report Upload**: Secure PDF upload with validation (up to 10MB)
- **Medical Content Validation**: Strict validation ensures only medical-related PDFs are processed
- **Intelligent Medical Analysis**: AI-powered comprehensive health insights using specialized medical prompts
- **Multi-Domain Expertise**: Covers CBC, liver function, pancreatic markers, metabolic panels, lipid profiles, and common diseases
- **Risk Assessment**: Identifies potential health risks with Low/Medium/High risk levels
- **Personalized Recommendations**: Lifestyle modifications, dietary advice, and follow-up test suggestions
- **Offline Analysis**: Basic medical analysis when AI services are unavailable

### 🧠 AI-Powered Intelligence

- **In-Context Learning**: Vector embeddings with pgvector for contextual medical conversations
- **Medical-Only Responses**: AI strictly responds only to medical and health-related questions
- **Contextual Responses**: AI responses that reference uploaded medical reports
- **Multi-Model Architecture**: Groq AI integration with specialized medical analysis prompts
- **Offline Fallback**: Basic medical guidance when AI services are unavailable
- **Knowledge Retention**: Maintains conversation context across sessions

### 🔐 Authentication & Security

- **Multi-Provider Authentication**: Google OAuth, GitHub OAuth, and email/password
- **Secure JWT Token System**: Access tokens (15 min) + Refresh tokens (7 days)
- **Automatic Token Refresh**: Seamless token renewal without user interruption
- **File Security**: Secure PDF processing with medical content validation
- **Session Management**: User-specific medical report storage and access control

### 📊 User Experience

- **Session History**: Track all medical report analyses and conversations
- **Real-time Processing**: Instant PDF analysis and AI response generation
- **Modern UI**: Responsive design with real-time feedback
- **Medical Disclaimer**: Proper AI-generated analysis disclaimers
- **Logging System**: Comprehensive logging for maintenance and debugging

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Node.js, Express.js 5
- **Database**: PostgreSQL with UUID support + pgvector extension
- **Authentication**:
  - NextAuth.js 4 (OAuth + JWT)
  - Google OAuth 2.0
  - GitHub OAuth 2.0
  - JWT tokens with automatic refresh
- **AI Integration**:
  - Groq AI with specialized medical analysis prompts and offline fallback
  - Multi-tier model architecture with automatic fallback
  - Hugging Face Inference API (sentence-transformers/all-MiniLM-L6-v2) - FREE
  - Fallback hash-based embeddings (no API key required)
  - pgvector for similarity search
  - Medical-only question validation and responses
- **PDF Processing**: pdf-parse for medical report text extraction
- **File Upload**: Multer with medical content validation
- **Security**: HTTP-only cookies, CSRF protection, bcrypt hashing

## 🚀 Installation

#### Requirements 📋

- Node.js 18+

#### Getting Started 📝

1. Clone the repository:

```bash
git clone https://github.com/harshhh28/hia-js.git
cd hia-js
```

2. Install dependencies:

```bash
cd frontend
npm install

cd backend
npm install
```

3. Required environment variables:

**Backend** (`backend/.env`):

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hia_db
DB_USER=postgres
DB_PASSWORD=password

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

**Frontend** (`frontend/.env`):

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Provider Credentials (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

4. Set up PostgreSQL database with pgvector extension:

```bash
# Using Docker (Recommended)
cd backend
docker-compose up -d

# Or manually create database with pgvector
createdb hia_db
psql hia_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

5. **Set up free embedding models (Optional)**:

**Option 1: Hugging Face Inference API (Recommended)**

- Get a free API key from [Hugging Face](https://huggingface.co/settings/tokens)
- Add `HUGGINGFACE_API_KEY=your_huggingface_api_key_here` to backend `.env`
- Uses `sentence-transformers/all-MiniLM-L6-v2` model (384 dimensions)
- Direct API integration with `@huggingface/inference` package

**Option 2: Fallback Embeddings (No API Key Required)**

- If no Hugging Face API key is provided, the system uses hash-based fallback embeddings
- Still provides basic similarity search functionality
- No external API calls required

6. **Set up OAuth providers (Optional)**:

For Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to frontend `.env`

For GitHub OAuth:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to frontend `.env`

5. Run the application:

```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm run dev
```

## 📁 Project Structure

```
hia-js/
├── backend/                 # Express backend with medical analysis
│   ├── controllers/         # API controllers
│   │   ├── medicalReport.js # Medical report upload & analysis
│   │   ├── chatMessage.js   # Contextual chat responses
│   │   └── chatSession.js   # Session management
│   ├── models/              # Database models
│   │   ├── MedicalReport.js # Medical report storage
│   │   ├── VectorEmbedding.js # Vector embeddings for AI
│   │   └── ChatSession.js   # Enhanced session model
│   ├── utils/               # Utilities
│   │   ├── PDFProcessor.js  # PDF text extraction
│   │   ├── VectorService.js # AI embeddings & context
│   │   └── Prompt.js        # Medical analysis prompts
│   ├── middlewares/         # Middleware functions
│   │   └── pdfUpload.js     # PDF upload validation
│   ├── uploads/             # Medical report storage
│   └── logs/                # Application logs
├── frontend/                # Next.js frontend
└── README.md               # This file
```

## 🩺 Medical Report Workflow

### How It Works

1. **Create Session**: User creates a new chat session
2. **Upload Report**: Upload a PDF medical report (blood test, lab results, etc.)
3. **AI Analysis**: System automatically:
   - Validates PDF format and medical content
   - Extracts text from the PDF
   - Generates comprehensive medical analysis using AI (with offline fallback)
   - Stores embeddings for contextual learning
4. **Interactive Chat**: User can ask medical questions about their report
5. **Contextual Responses**: AI provides medical answers based on the uploaded report
6. **Medical-Only Validation**: System ensures only medical questions are answered

### Supported Medical Reports

- **Blood Tests**: CBC, Complete Blood Count, Hematology
- **Liver Function**: ALT, AST, ALP, Bilirubin tests
- **Metabolic Panels**: Glucose, Cholesterol, Kidney function
- **Specialized Tests**: Thyroid, Vitamin levels, Inflammatory markers
- **Lab Reports**: Any medical laboratory test results

### AI Analysis Features

- **Risk Assessment**: Identifies potential health risks (Low/Medium/High)
- **Personalized Recommendations**: Lifestyle and dietary advice
- **Follow-up Suggestions**: Recommended additional tests
- **Medical Disclaimers**: Proper AI-generated analysis warnings

## 🔧 Troubleshooting

### Common Issues

**OAuth Authentication Errors:**

- Verify OAuth provider credentials are correctly set in frontend `.env`
- Check that redirect URIs match exactly (including `http://localhost:3000`)
- Ensure backend is running and accessible from frontend

**Database Connection Issues:**

- Verify PostgreSQL is running (`docker-compose ps` for Docker)
- Check database credentials in backend `.env`
- Ensure database exists (`createdb hia_db` if needed)

**Token/Authentication Issues:**

- Check JWT_SECRET is set in backend `.env`
- Verify NEXTAUTH_SECRET is set in frontend `.env`
- Clear browser cookies and try again
- Check browser console for detailed error messages

**CORS Issues:**

- Verify FRONTEND_URL in backend `.env` matches your frontend URL
- Check that credentials are enabled in CORS configuration

**Medical Report Upload Issues:**

- Verify PDF file is under 10MB and contains medical content
- Check that PDF contains medical keywords (blood, lab, test, etc.)
- System validates medical content before processing
- Non-medical PDFs are rejected with clear error messages
- Verify pgvector extension is installed in PostgreSQL
- System works with or without Hugging Face API key (uses fallback embeddings)

**AI Analysis Issues:**

- Check GROQ_API_KEY is set in backend `.env`
- System includes offline fallback when API is unavailable
- Verify Hugging Face API key is valid (optional - fallback embeddings work without it)
- Ensure medical report contains sufficient medical content
- AI only responds to medical-related questions
- Check logs directory for detailed error messages

**Vector Database Issues:**

- Verify pgvector extension is enabled: `CREATE EXTENSION IF NOT EXISTS vector;`
- Use Docker image with pgvector: `pgvector/pgvector:pg15`
- Check database connection and permissions
- Ensure vector embeddings table is created properly

**Free Embedding Issues:**

- Hugging Face API key is optional - system works with fallback embeddings
- If using Hugging Face, verify API key has inference permissions
- Fallback embeddings provide basic similarity search without external API calls

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, the development workflow, coding standards, and more.

We appreciate all contributions, from reporting bugs and improving documentation to implementing new features.

## 👨‍💻 Contributors

Thanks to all the amazing contributors who have helped improve this project!

| Avatar                                                                                          | Name         | GitHub                                    | Role                         | Contributions                      | PR(s) | Notes          |
| ----------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------- | ---------------------------- | ---------------------------------- | ----- | -------------- |
| <img src="https://github.com/harshhh28.png" width="50px" height="50px" alt="harshhh28 avatar"/> | Harsh Gajjar | [harshhh28](https://github.com/harshhh28) | Project Creator & Maintainer | Core implementation, Documentation | N/A   | Lead Developer |

<!-- To future contributors: Your profile will be added here when your PR is merged! -->

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/harshhh28/hia-js/blob/main/LICENSE) file for details.

## 🆕 Recent Updates

### Medical Content Validation & Offline Support

- **Strict Medical Validation**: Only medical-related PDFs are processed and analyzed
- **Medical-Only Chat**: AI responds only to medical and health-related questions
- **Offline Analysis**: Basic medical analysis when AI services are unavailable
- **Multi-Tier AI Fallback**: Automatic fallback between different AI models
- **Enhanced Error Handling**: Better connectivity detection and graceful degradation

### Key Improvements

- ✅ **PDF Medical Content Validation**: Rejects non-medical PDFs with clear error messages
- ✅ **Medical Question Filtering**: AI only answers medical questions, redirects others
- ✅ **Offline Medical Analysis**: Basic analysis when Groq API is unavailable
- ✅ **Connectivity Detection**: Automatic detection of API connectivity issues
- ✅ **Enhanced Prompts**: Medical-only response enforcement in all AI interactions
- ✅ **Rollback Mechanism**: Clean rollback for failed PDF processing

## 🙋‍♂️ Author

Created by [Harsh Gajjar](https://harshgajjar.vercel.app)
