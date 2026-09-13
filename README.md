# SkillBridge

**SkillBridge** is a modern full-stack web application designed to bridge the gap between students and the real world by connecting them with startup projects, mentorship opportunities, and career experiences.

## Project Architecture

SkillBridge follows a **monorepo architecture** containing both the frontend and backend applications:

* **`frontend/`** – React + Vite application styled with Tailwind CSS and Framer Motion.
* **`backend/`** – Node.js + Express REST API with MongoDB support and an in-memory fallback for local development.

## Getting Started

### Prerequisites

Before running the project, make sure you have:

* Node.js **v18 or higher**
* npm
* MongoDB *(optional)*

> MongoDB is optional for local development. If MongoDB is unavailable, the backend automatically uses an in-memory state engine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillBridge
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend API will run at:

`http://localhost:5000`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will run at:

`http://localhost:3000`

## Key Features

### 👨‍🎓 Student Portal

* Create and manage student profiles.
* Showcase skills, experience, and portfolio information.
* Browse and apply for startup projects.
* Track project applications and opportunities.

### 🚀 Startup & Company Portal

* Create and publish project opportunities.
* Review student applications and submissions.
* Select and manage project teams.
* Connect with students based on their skills and experience.

### 🛠️ Project Marketplace

* Browse available startup projects.
* Search and filter projects based on relevant criteria.
* View project details and application requirements.
* Apply to projects that match student skills and interests.

### 👑 Admin Dashboard

* Manage users and platform activity.
* Monitor system metrics and analytics.
* Manage projects and platform-level data.

## Technology Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* Framer Motion

**Backend**

* Node.js
* Express.js
* REST APIs
* MongoDB
* In-memory state engine

## Project Structure

```text
SkillBridge/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── package.json
│
└── README.md
```


## License

This project is licensed under the **MIT License**.
