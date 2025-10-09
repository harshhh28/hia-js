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
- Secure user authentication and session management
- Session history with report analysis tracking
- Modern, responsive UI with real-time feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **AI Integration**: Multi-model architecture via Groq
  - Primary: meta-llama/llama-4-maverick-17b-128e-instruct
  - Secondary: llama-3.3-70b-versatile
  - Tertiary: llama-3.1-8b-instant
  - Fallback: llama3-70b-8192
- **PDF Processing**: PDFPlumber
- **Authentication**: JWT, PostgreSQL

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

3. Required environment variables (in `.env`):

```env
# backend/.env
PORT=your-backend-port
JWT_SECRET=your-jwt-secret
```

4. Set up Supabase database schema:

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
