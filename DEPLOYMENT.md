# Deployment Guide (Render.com)

This guide explains how to deploy your **Smart Transport** project for free using [Render](https://render.com).

## Prerequisites
1.  Push your latest code to GitHub (You have already done this!).
2.  Sign up for a free account on [Render.com](https://render.com).

---

# Deployment Guide (Render.com)

This guide explains how to deploy your **Smart Transport** project for free using [Render](https://render.com) and the **Blueprint** feature (Infrastructure as Code).

## Prerequisites
1.  Push your latest code to GitHub (including `render.yaml`).
2.  Sign up for a free account on [Render.com](https://render.com).

---

## 🚀 One-Click Deployment (Recommended)

1.  Go to your **[Render Dashboard](https://dashboard.render.com/)**.
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository (`smartTransport`).
4.  **Service Name**: You can leave it as default or change it if you like.
5.  **Click Apply**.

Render will automatically:
1.  Read the `render.yaml` file.
2.  Create the **Backend** service.
3.  Create the **Frontend** static site.
4.  **Magically link them**: It will inject the Backend's URL into the Frontend's build configuration automatically.

---

## ⚠️ Important Post-Deployment Check

Once the deployment finishes (green checkmarks):

1.  Click the **Frontend URL** (e.g., `https://transport-frontend.onrender.com`).
2.  Try to **Login** or **Sign Up**.
3.  If successful, the connection is working perfectly!

## 🔧 Troubleshooting

-   **"Login Failed"**: 
    -   Check the **Backend** logs in the Render dashboard to see if there are any errors.
    -   Ensure the **Backend** service status is "Live".
    -   Wait a minute; sometimes the free instance takes a moment to wake up ("Cold Start").

-   **Database**:
    -   By default, this uses a local SQLite database file. **Data will be reset every time the backend redeploys.**
    -   For persistent data, you should create a **PostgreSQL** database on Render and add the `DATABASE_URL` environment variable to the backend service.
