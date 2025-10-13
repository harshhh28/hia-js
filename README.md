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

- Intelligent agent-based architecture with multi-model cascade system
- In-context learning from previous analyses and knowledge base building
- Medical report analysis with personalized health insights
- PDF upload, validation and text extraction (up to 20MB)
- **Multi-Provider Authentication**: Google OAuth, GitHub OAuth, and email/password
- **Secure JWT Token System**: Access tokens (15 min) + Refresh tokens (7 days)
- **Automatic Token Refresh**: Seamless token renewal without user interruption
- Session history with report analysis tracking
- Modern, responsive UI with real-time feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Node.js, Express.js 5
- **Database**: PostgreSQL with UUID support
- **Authentication**:
  - NextAuth.js 4 (OAuth + JWT)
  - Google OAuth 2.0
  - GitHub OAuth 2.0
  - JWT tokens with automatic refresh
- **AI Integration**: Multi-model architecture via Groq
  - Primary: meta-llama/llama-4-maverick-17b-128e-instruct
  - Secondary: llama-3.3-70b-versatile
  - Tertiary: llama-3.1-8b-instant
  - Fallback: llama3-70b-8192
- **PDF Processing**: PDFPlumber
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
ADMIN_TOKEN=your-super-secret-admin-token-here
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

4. Set up PostgreSQL database:

```bash
# Using Docker (Recommended)
cd backend
docker-compose up -d

# Or manually create database
createdb hia_db
```

5. **Set up OAuth providers (Optional)**:

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
├── backend/                 # Express backend
├── frontend/                # Next.js frontend
```

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

## 🙋‍♂️ Author

Created by [Harsh Gajjar](https://harshgajjar.vercel.app)
