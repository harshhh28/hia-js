# HIA Frontend - Health Insights Agent

## Overview

The HIA (Health Insights Agent) frontend is a Next.js application that provides a modern, responsive interface for medical report analysis and AI-powered health insights. The application features PDF medical report upload, contextual AI chat, and comprehensive health analysis with a sophisticated authentication system.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/auth/           # NextAuth API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── components/         # React components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── ChatApp.jsx    # Main chat application
│   │   │   └── Loading.jsx    # Loading component
│   │   ├── docs/              # Documentation pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── hooks/                 # Custom React hooks
│   │   └── useTokenRefresh.js # Token refresh hook
│   └── utils/                 # Utility functions
│       ├── api.js             # API client
│       ├── auth.js            # Authentication utilities
│       └── chatApi.js         # Chat API functions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── next.config.mjs           # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── biome.json               # Biome linter configuration
```

## Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **React**: 19.1.0
- **Authentication**: NextAuth.js 4.24.11
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios 1.12.2
- **Linting**: Biome 2.2.0
- **Fonts**: Geist Sans & Geist Mono

## Key Features

### 1. **Medical Report Analysis**

- **PDF Upload Interface**: Secure medical report upload with drag-and-drop support
- **Medical Content Validation**: Real-time validation for PDF format and medical content
- **AI Analysis Display**: Comprehensive health insights with risk assessment
- **Offline Analysis Support**: Basic medical analysis when AI services are unavailable
- **Medical Disclaimers**: Proper AI-generated analysis warnings
- **Report Management**: View, download, and delete uploaded medical reports

### 2. **AI-Powered Chat System**

- **Medical-Only Responses**: AI strictly responds only to medical and health-related questions
- **Contextual Responses**: AI responses that reference uploaded medical reports
- **In-Context Learning**: Maintains conversation context across sessions
- **Real-time Chat Interface**: Modern chat UI with sidebar and message area
- **Offline Fallback**: Basic medical guidance when AI services are unavailable
- **Session Management**: Create, view, and delete chat sessions
- **Message History**: Persistent message storage and retrieval

### 3. **Authentication System**

- **NextAuth Integration**: Seamless OAuth and email/password authentication
- **Dual Token System**: Access tokens (15 minutes) + Refresh tokens (7 days)
- **Automatic Token Refresh**: Background token renewal before expiration
- **Multi-Provider Support**: Google OAuth, GitHub OAuth, and email/password authentication
- **Hybrid Authentication**: NextAuth session + Backend JWT tokens
- **OAuth Token Integration**: Seamless backend token generation for OAuth users

### 4. **Security Features**

- **HTTP-Only Cookies**: Refresh tokens stored securely
- **CSRF Protection**: SameSite cookie attributes
- **Environment-Aware Security**: Secure flags enabled in production
- **Automatic Cleanup**: Tokens cleared on logout and user deletion
- **File Security**: Secure PDF processing with medical content validation

### 5. **API Integration**

- **Hybrid Authentication**: Bearer tokens + HTTP-only cookies
- **Automatic Token Attachment**: Request interceptor adds access tokens from NextAuth session
- **Automatic Retry Logic**: Failed requests retried after token refresh
- **Error Handling**: Comprehensive error handling for auth failures
- **Request Interceptors**: Automatic token attachment and refresh
- **Medical Report API**: Full CRUD operations for medical reports and analysis
- **Contextual Chat API**: AI-powered responses with medical context

### 6. **User Experience**

- **Responsive Design**: Mobile-first Tailwind CSS design
- **Loading States**: Smooth loading indicators
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Management**: Persistent user sessions with automatic refresh
- **Modern UI**: Clean, intuitive interface with medical report analysis

## Core Components

### Authentication System

- `src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration with OAuth providers
- `src/utils/auth.js` - Authentication utilities and session management
- `src/utils/api.js` - API client with automatic token refresh
- `src/hooks/useTokenRefresh.js` - Custom hook for automatic token refresh

### UI Components

- `src/app/page.js` - Main medical report analysis interface
- `src/app/components/ChatApp.jsx` - Main chat component with medical report upload
- `src/app/auth/page.js` - Login/signup forms
- `src/app/components/auth/AuthProvider.jsx` - Authentication context provider
- `src/app/components/auth/ProtectedRoute.jsx` - Route protection wrapper
- `src/app/components/Loading.jsx` - Loading spinner component
- `src/app/docs/page.js` - Documentation and help pages

### API Integration

- `src/utils/api.js` - Base API client with automatic token refresh
- `src/utils/chatApi.js` - Chat-specific API functions for sessions and messages
- `src/utils/auth.js` - Authentication utilities and session management
- `src/hooks/useTokenRefresh.js` - Custom hook for automatic token refresh

### Layout & Styling

- `src/app/layout.js` - Root layout with fonts and providers
- `src/app/globals.css` - Global styles and Tailwind imports

## Medical Report Workflow

### How It Works

1. **Create Session**: User creates a new chat session
2. **Upload Report**: User uploads a PDF medical report through the interface
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

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harshhh28/hia-js
   cd hia-js/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:

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

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## Security Features

1. **HTTP-Only Cookies**: Refresh tokens stored in secure HTTP-only cookies
2. **Automatic Cleanup**: Tokens cleared on logout and user deletion
3. **Environment-Aware Security**: Secure flag only enabled in production
4. **CSRF Protection**: SameSite cookie attribute prevents CSRF attacks
5. **Token Expiration**: Short-lived access tokens minimize security risks

## Authentication Flow

### Email/Password Authentication

1. **User Login**: User submits email/password form
2. **Backend Authentication**: Backend validates credentials and generates JWT tokens
3. **NextAuth Session**: Frontend creates NextAuth session with user data
4. **Token Storage**: Access token stored in NextAuth session, refresh token in HTTP-only cookie

### OAuth Authentication (Google/GitHub)

1. **OAuth Initiation**: User clicks "Continue with Google/GitHub"
2. **Provider Authentication**: NextAuth handles OAuth flow with provider
3. **Backend Integration**: NextAuth calls backend `/api/users/oauth` endpoint
4. **Token Generation**: Backend creates/finds user and generates JWT tokens
5. **Session Creation**: NextAuth stores tokens in session for API calls
6. **Seamless Access**: User can immediately access protected endpoints

### Token Refresh

1. **Automatic Detection**: NextAuth detects token expiration (15-minute expiry)
2. **Background Refresh**: NextAuth calls backend refresh endpoint
3. **Token Update**: New tokens stored in NextAuth session
4. **Transparent Operation**: User experiences no interruption

## Backend Integration

The frontend seamlessly integrates with the backend's authentication and chat systems:

### Authentication Integration

- **Login/Signup**: Creates both access and refresh tokens
- **OAuth Integration**: Seamless Google/GitHub authentication with backend token generation
- **Hybrid Authentication**: Uses Bearer tokens from NextAuth session + HTTP-only cookies
- **Token Refresh**: NextAuth automatically refreshes expired access tokens
- **Logout**: Clears all authentication cookies on backend and NextAuth session
- **API Calls**: Uses Bearer token authentication with automatic token attachment

### Medical Report Integration

- **PDF Upload**: Secure medical report upload with validation
- **AI Analysis**: Comprehensive health insights with risk assessment
- **Contextual Chat**: AI responses that reference uploaded medical reports
- **Vector Embeddings**: In-context learning for better responses
- **Report Management**: View, download, and delete medical reports
- **Session Integration**: Medical reports linked to chat sessions

### Chat System Integration

- **Session Management**: Full CRUD operations for chat sessions
- **Message Handling**: Create and retrieve messages for each session
- **User Isolation**: Users can only access their own sessions and messages
- **Real-time Updates**: Messages persist and load when switching sessions
- **Error Handling**: Graceful handling of API failures with user feedback

## Error Handling

- **401 Unauthorized**: Automatically attempts token refresh
- **Token Refresh Failure**: Redirects user to login page
- **Network Errors**: Proper error messages displayed to user
- **OAuth Errors**: Graceful fallback to manual login

## Performance Optimizations

- **Automatic Refresh**: Tokens refreshed before expiration (5-minute buffer)
- **Efficient Polling**: Token check runs every minute
- **Request Retry**: Failed requests retried once after token refresh
- **Session Caching**: NextAuth session cached to reduce API calls
- **Turbopack**: Fast development builds with Next.js Turbopack

## Development

### Code Quality

- **Biome**: Fast linter and formatter
- **TypeScript**: Type safety (when enabled)
- **ESLint**: Code quality checks
- **Prettier**: Code formatting

### Testing

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing (when configured)

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables for Production

- Set `NEXTAUTH_URL` to your production domain
- Configure OAuth providers with production URLs
- Use secure `NEXTAUTH_SECRET` for production

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test authentication flows thoroughly
4. Update documentation for new features

## Troubleshooting

### Common Issues

- **Token Refresh Loops**: Check backend API connectivity
- **OAuth Errors**: Verify provider credentials
- **CORS Issues**: Ensure backend CORS is configured for frontend URL
- **Session Persistence**: Check NextAuth configuration
