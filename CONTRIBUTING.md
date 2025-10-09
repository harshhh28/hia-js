# Contributing to HIA (Health Insights Agent) 🩺

Thank you for considering contributing to HIA! This document provides guidelines and instructions to help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Security](#security)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We aim to foster an inclusive and respectful community.

## Getting Started

### Prerequisites

- Node.js 18+

### Development Environment Setup

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/harshhh28/hia-js.git
   cd hia-js
   ```

2. **Install dependencies**:

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Configure environment variables**:
   Create `.env` in backend directory:

   ```env
   PORT=your-backend-port
   JWT_SECRET=your-jwt-secret
   ```

4. **Set up database**:

   ```bash
   # Create database and run migrations
   ```

5. **Run the application**:

   ```bash
   # Terminal 1: Start frontend
   cd frontend
   npm run dev

   # Terminal 2: Start backend
   cd backend
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Git Workflow

1. **Create a branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
3. **Write commit messages**:

   ```
   feat: Add new blood analysis component

   - Implement report analysis visualization
   - Add validation for blood test values
   - Update documentation
   ```

4. **Push changes**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

### Pull Request Guidelines

- Fill out the PR template completely
- Reference any related issues
- Include screenshots for UI changes
- Update documentation if needed
- Add tests for new functionality

## Coding Standards

## Testing Guidelines

1. **Test Coverage**

   - Unit tests for utilities and services
   - Integration tests for major features
   - UI component tests

2. **Running Tests**
   ```bash
   npm test
   ```

## Documentation

- Update README.md for new features
- Add docstrings to new functions/classes
- Include example usage where appropriate
- Document environment variables
- Keep API documentation current

## Security

- Never commit sensitive data
- Follow secure coding practices
- Validate all user inputs
- Report security issues privately
- Follow the [Security Policy](SECURITY.md)

---

We appreciate your contributions to making HIA better! If you have questions, feel free to open an issue or contact the maintainers.
