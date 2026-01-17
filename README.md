# 🚀 Agentic AI Interview Coach

A next-generation, AI-powered interview preparation platform. It simulates real-world interviews (`Google`, `Amazon`, `Startups`), analyzes your answers with AI, detects "Hinglish" or filler words, and provides actionable feedback.

**Built with:** React + Vite + TailwindCSS + Google Gemini AI + Web Speech API.

## ✨ Key Features

### 🎯 1. Realistic Practice Modes
*   **HR Round**: Focuses on soft skills and culture fit.
*   **Technical Round**: Drills into core concepts and problem solving.
*   **Managerial / Stress**: (Premium 👑) Tests leadership & pressure handling.
*   **Company Simulators**: (Premium 👑) Tailored for **Google** (Googliness) or **Amazon** (Leadership Principles).

### 🤖 2. Advanced AI Intelligence
*   **Live Transcription**: Real-time speech-to-text.
*   **Deep Analysis**: Scores your answer on Relevance, Clarity, and Confidence.
*   **Grammar & Fillers**: Highlights "um", "like" and grammar mistakes.
*   **Sentiment Analysis**: Visualizes Positive vs Negative tone.
*   **Smart Nudges**: Remembers your last session (e.g. "You spoke too fast last time") and warns you before starting.

### 💎 3. Personalization & Monetization
*   **Profile Context**: Accepts your **Resume/Bio** to generate role-specific questions.
*   **Linguistics**: Detects "Hinglish" and offers a "Polish" feature to rewrite it into Global Professional English.
*   **Gamification**: Tracks XP, Daily Streaks, and Daily Session Limits.
*   **Freemium Model**: Includes an "Upgrade to Pro" flow for advanced features.

## 🛠️ Tech Stack

*   **Frontend**: React.js, TailwindCSS, Framer Motion (Animations), Recharts (Charts).
*   **Backend**: Node.js, Express, Prisma (SQLite/Postgres).
*   **AI**: Google Generative AI (`gemini-1.5-flash`).
*   **Storage**: LocalStorage (MVP Persistence).

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Start Backend (Optional for MVP)**
    ```bash
    cd backend
    npm install
    npx prisma migrate dev
    npm start
    ```

## 📸 Screenshots
*(Add screenshots of Practice Page, Feedback Dashboard, and Upgrade Modal here)*

## 🤝 Contribution
Open for PRs! Please check `task.md` for remaining Phase 7 ideas (Deployment, PWA).

---
**Status**: Feature Complete (MVP + Phase 2)
**Version**: 1.2.0
