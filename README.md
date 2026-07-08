# 🎓 Study Group Matcher

An AI-driven, premium study partner matchmaking and collaborative study platform. Study Group Matcher connects students based on their skills, subjects, goals, and learning compatibility. It provides automated study planning using the Gemini API, real-time messaging, study groups, scheduling planners, and an interactive dashboard.

---

## ✨ Key Features

- **🤖 AI Matchmaking Engine**: Computes compatibility scores based on learning goals, skills, and subjects. Generates custom match explanations using **Gemini 2.5 Flash**.
- **📅 AI-Generated Study Planner**: Instantly creates personalized daily study plans tailored to student needs.
- **💬 Real-Time Group Chat**: Seamless real-time messaging inside study groups powered by **Socket.IO**.
- **📊 Dynamic Analytics Dashboard**: Visualizes study statistics, matches, and notifications using **Recharts**.
- **🔔 Notification Center**: Alerts students to matching events, messages, and plan reminders (with email support via **Nodemailer**).
- **🔒 Secure Authentication**: Robust JWT-based authentication and secure password hashing.
- **🎨 Modern Dark UI/UX**: Sleek, glassmorphism-infused dark mode layout crafted with **Tailwind CSS v4** and **Framer Motion**.

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **AI Integration**: `@google/genai` (Gemini API)
- **Real-Time Communication**: Socket.IO
- **Security**: JWT & Bcryptjs
- **Mailing**: Nodemailer
- **Environment**: Dotenv

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: React Icons
- **Routing**: React Router DOM
- **Socket Client**: socket.io-client

---

## ⚙️ Project Structure

```text
study-group-matcher/
├── backend/            # Express Server, Mongoose Models, Controllers, Services & Socket.io
│   ├── config/         # Database and server configuration
│   ├── controllers/    # API controllers containing logic for routes
│   ├── middleware/     # Authentication & request validation middleware
│   ├── models/         # MongoDB Schemas (User, Match, Group, Message, Plan)
│   ├── routes/         # Express API endpoints
│   ├── services/       # Integration logic (Gemini API, email notification)
│   └── server.js       # Main server entrypoint
│
├── frontend/           # Vite + React Client App
│   ├── public/         # Static assets
│   ├── src/            # Components, pages, hooks, styling, and views
│   └── vite.config.js  # Vite configuration
│
├── package.json        # Concurrent workspace manager scripts
└── render.yaml         # Blueprint specification for Render deployment
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas cluster (or a running local MongoDB instance)
- Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### 1. Installation
Clone the repository and install dependencies at the root workspace:

```bash
# Clone the repository
git clone https://github.com/AnkitAnand360/STUDY-GROUP-MATCHER.git
cd study-group-matcher

# Install dependencies for both backend and frontend concurrently
npm run install-all
```

### 2. Configuration
Create a `.env` file inside the `backend` directory:

```bash
# Navigate to backend and create .env
cd backend
touch .env
```

Populate the `backend/.env` with your settings:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

> [!IMPORTANT]
> **MongoDB Network Access**: If you are using MongoDB Atlas, make sure to whitelist your IP address under **Network Access** in the Atlas console. For deployment, add `0.0.0.0/0` (Allow Access from Anywhere) to permit connection from cloud environments.

### 3. Local Run
To run both the backend server and the frontend client concurrently, execute the following command in the **root** folder:

```bash
npm run dev
```

- Backend server: [http://localhost:5000](http://localhost:5000)
- Frontend application: [http://localhost:5173](http://localhost:5173)

---

## ☁️ Deployment (Render)

This project is configured for deployment on **Render** using the [render.yaml](file:///c:/Users/ankit/OneDrive/Desktop/study-group-matcher/render.yaml) blueprint.

1. Connect your GitHub account to Render.
2. In the Render Dashboard, click **New > Blueprint**.
3. Select this repository.
4. Render will read `render.yaml` and provision the web services.
5. In the Render dashboard, go to the **Environment** settings for the backend service and manually enter your sensitive environment variables (`MONGO_URI`, `GEMINI_API_KEY`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`).
