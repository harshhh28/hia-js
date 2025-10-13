# HIA Frontend - Health Insights Agent

## Overview

The HIA (Health Insights Agent) frontend is a Next.js application that provides a modern, responsive interface for analyzing blood reports and providing detailed health insights. The application integrates with a backend API using a sophisticated authentication system with access tokens and refresh tokens while maintaining NextAuth compatibility.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/auth/           # NextAuth API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── components/         # React components
│   │   │   ├── auth/          # Authentication components
│   │   │   └── Loading.jsx    # Loading component
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── hooks/                 # Custom React hooks
│   │   └── useTokenRefresh.js # Token refresh hook
│   └── utils/                 # Utility functions
│       ├── api.js             # API client
│       └── auth.js            # Authentication utilities
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── next.config.mjs           # Next.js configuration
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

### 1. **Authentication System**

- **NextAuth Integration**: Seamless OAuth and email/password authentication
- **Dual Token System**: Access tokens (1 hour) + Refresh tokens (7 days)
- **Automatic Token Refresh**: Background token renewal before expiration
- **Multi-Provider Support**: Google, GitHub, and email/password authentication

### 2. **Security Features**

- **HTTP-Only Cookies**: Refresh tokens stored securely
- **CSRF Protection**: SameSite cookie attributes
- **Environment-Aware Security**: Secure flags enabled in production
- **Automatic Cleanup**: Tokens cleared on logout and user deletion

### 3. **API Integration**

- **Cookie-based Authentication**: Secure HTTP-only cookie authentication
- **Automatic Retry Logic**: Failed requests retried after token refresh
- **Error Handling**: Comprehensive error handling for auth failures
- **Request Interceptors**: Automatic token attachment and refresh

### 4. **User Experience**

- **Responsive Design**: Mobile-first Tailwind CSS design
- **Loading States**: Smooth loading indicators
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Management**: Persistent user sessions with automatic refresh

## Core Components

### Authentication System

- `src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration with OAuth providers
- `src/utils/auth.js` - Authentication utilities and session management
- `src/utils/api.js` - API client with automatic token refresh
- `src/hooks/useTokenRefresh.js` - Custom hook for automatic token refresh

### UI Components

- `src/app/page.js` - Main dashboard with user information
- `src/app/auth/page.js` - Login/signup forms
- `src/app/components/auth/AuthProvider.jsx` - Authentication context provider
- `src/app/components/auth/ProtectedRoute.jsx` - Route protection wrapper
- `src/app/components/Loading.jsx` - Loading spinner component

### Layout & Styling

- `src/app/layout.js` - Root layout with fonts and providers
- `src/app/globals.css` - Global styles and Tailwind imports

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

1. **User Login**: User authenticates via email/password or OAuth
2. **Token Generation**: Backend generates access + refresh tokens
3. **Session Storage**: Access token stored in NextAuth session
4. **Cookie Storage**: Refresh token stored in HTTP-only cookie
5. **Automatic Refresh**: Tokens refreshed before expiration
6. **Logout**: Both tokens cleared on backend and frontend

## Backend Integration

The frontend seamlessly integrates with the backend's authentication system:

- **Login/Signup**: Creates both access and refresh tokens
- **OAuth**: Handles Google/GitHub authentication with token generation
- **Token Refresh**: Automatically refreshes expired access tokens
- **Logout**: Clears all authentication cookies on backend
- **API Calls**: Uses cookie-based authentication for all requests

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
