# 🩺 HIA (Health Insights Agent)

AI Agent to analyze blood reports and provide detailed health insights.

<p align="center">
  <a href="https://github.com/harshhh28/hia/issues"><img src="https://img.shields.io/github/issues/harshhh28/hia"></a> 
  <a href="https://github.com/harshhh28/hia/stargazers"><img src="https://img.shields.io/github/stars/harshhh28/hia"></a>
  <a href="https://github.com/harshhh28/hia/network/members"><img src="https://img.shields.io/github/forks/harshhh28/hia"></a>
  <a href="https://github.com/harshhh28/hia/blob/main/LICENSE">
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
  <a href="https://github.com/harshhh28/hia"><img src="https://raw.githubusercontent.com/harshhh28/hia/main/public/HIA_demo.gif" alt="Usage Demo"></a>
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
- PostgreSQL 14+
- Groq API key
- PDFPlumber
- Python 3.8+ (for PDF processing)

#### Getting Started 📝

1. Clone the repository:

```bash
git clone https://github.com/harshhh28/hia.git
cd hia
```

2. Install dependencies:

```bash
npm install
```

3. Required environment variables (in `.env`):

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
GROQ_API_KEY=your-groq-api-key
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

4. Set up Supabase database schema:

The application requires the following tables in your Supabase database:

![database schema](https://raw.githubusercontent.com/harshhh28/hia/main/public/db/schema.png)

You can use the SQL script provided at `public/db/script.sql` <a href="https://www.github.com/harshhh28/hia/blob/main/public/db/script.sql">[link]</a> to set up the required database schema.

(PS: You can turn off the email confimation on signup in Supabase settings -> signup -> email)

5. Run the application:

```bash
npm run dev
```

## 📁 Project Structure

```
hia/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── auth/             # Auth routes
│   ├── components/           # React components
│   │   ├── analysis/        # Analysis components
│   │   ├── auth/            # Auth components
│   │   └── ui/              # UI components
│   └── lib/                 # Utilities and helpers
├── server/                  # Backend Node.js server
│   ├── index.js            # Server entry point
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
└── public/                # Static assets
```

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, the development workflow, coding standards, and more.

We appreciate all contributions, from reporting bugs and improving documentation to implementing new features.

## 👨‍💻 Contributors

Thanks to all the amazing contributors who have helped improve this project!

| Avatar                                                                                              | Name         | GitHub                                        | Role                         | Contributions                      | PR(s)                                                                                                                                                                                      | Notes                 |
| --------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------- | ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| <img src="https://github.com/harshhh28.png" width="50px" height="50px" alt="harshhh28 avatar"/>     | Harsh Gajjar | [harshhh28](https://github.com/harshhh28)     | Project Creator & Maintainer | Core implementation, Documentation | N/A                                                                                                                                                                                        | Lead Developer        |
| <img src="https://github.com/gaurav98095.png" width="50px" height="50px" alt="gaurav98095 avatar"/> | Gaurav       | [gaurav98095](https://github.com/gaurav98095) | Contributor                  | DB Schema, bugs                    | [#1](https://github.com/harshhh28/hia/pull/1), [#5](https://github.com/harshhh28/hia/pull/5), [#6](https://github.com/harshhh28/hia/pull/6), [#7](https://github.com/harshhh28/hia/pull/7) | Database Design, bugs |

<!-- To future contributors: Your profile will be added here when your PR is merged! -->

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/harshhh28/hia/blob/main/LICENSE) file for details.

## 🙋‍♂️ Author

Created by [Harsh Gajjar](https://harshgajjar.vercel.app)
