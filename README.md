# SkillBridge 🚀

**SkillBridge** is a modern full-stack web application designed to connect students with real-world startup projects, mentorship, and career opportunities.

---

## 🏗️ Project Architecture

SkillBridge is built as a monorepo containing both frontend and backend codebases:

- **`frontend/`**: React + Vite application styled with TailwindCSS & Framer Motion.
- **`backend/`**: Node.js + Express API server with MongoDB (and fallback in-memory state engine).

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Optional — backend automatically falls back to an in-memory database if MongoDB is not running locally).

---

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```
The backend server will run at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will run at `http://localhost:3000`.

---

## 🌟 Key Features

- **Role-Based Access**: Students, Startups/Companies, and Admins.
- **Project Marketplace**: Browse, search, filter, and apply for startup projects.
- **Student Profiles & Portfolio**: Highlight skills, applications, and experience.
- **Startup Management**: Post projects, review applicant submissions, and manage teams.
- **Admin Dashboard**: Analytics, user management, and system metrics.

---

## 📜 License
MIT License
