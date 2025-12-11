# Deployment Guide (Render.com)

This guide explains how to deploy your **Smart Transport** project for free using [Render](https://render.com).

## Prerequisites
1.  Push your latest code to GitHub (You have already done this!).
2.  Sign up for a free account on [Render.com](https://render.com).

---

## Part 1: Deploy the Backend (Web Service)

1.  Click **New +** and select **Web Service**.
2.  Connect your GitHub repository (`smartTransport`).
3.  **Name**: `transport-backend` (or similar).
4.  **Region**: Choose one close to you (e.g., Singapore, Frankfurt).
5.  **Branch**: `main`.
6.  **Root Directory**: `backend` (Important!).
7.  **Runtime**: `Python 3`.
8.  **Build Command**: `pip install -r requirements.txt`.
9.  **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`.
10. **Free Instance**: Select the Free plan.
11. **Environment Variables**:
    *   Scroll down to "Environment Variables" and add:
        *   `PYTHON_VERSION`: `3.9.0` (Recommended)
        *   `DATABASE_URL`: (Optional) If you want to use a real database, create a PostgreSQL database on Render and paste the internal connection string here. If left blank, it will use SQLite (data will generally be lost on restart).
12. Click **Create Web Service**.

**Wait for it to deploy.** Once finished, copy the **Backend URL** (e.g., `https://transport-backend.onrender.com`).

---

## Part 2: Deploy the Frontend (Static Site)

1.  Go to Dashboard, click **New +** and select **Static Site**.
2.  Connect the same GitHub repository.
3.  **Name**: `transport-frontend`.
4.  **Root Directory**: `frontend`.
5.  **Build Command**: `npm install && npm run build`.
6.  **Publish Directory**: `dist`.
7.  **Environment Variables**:
    *   Add a variable named `VITE_API_URL`.
    *   Value: Paste your **Backend URL** from Part 1 (No trailing slash, e.g., `https://transport-backend.onrender.com`).
8.  Click **Create Static Site**.

---

## Part 3: Final Configuration

1.  **Rewrite Rules (Frontend)**:
    *   Go to your **Frontend** service settings -> **Redirects/Rewrites**.
    *   Add a rule:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite`
    *   Save changes. This ensures that refreshing a page like `/login` doesn't give a 404 error.

2.  **CORS (Backend)**:
    *   Currently, the backend allows all origins (`*`). This is fine for testing.
    *   For better security, you can update `backend/app/main.py` locally to only allow your Frontend URL, committed, and push.

## 🎉 Done!
Open your **Frontend URL**. Your app should be live and connected to the backend.
