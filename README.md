# Smart Transport Load-Matching System

A comprehensive web application for matching truck/vehicle owners with customers who need goods transported. This system facilitates booking, real-time tracking (simulated), and management of transportation logistics.

## 🚀 Features

-   **User Roles**:
    -   **Admin**: Full system oversight, user verification, and statistics dashboard.
    -   **Vehicle Owner**: Manage vehicles, view trip requests, and accept bookings.
    -   **Customer**: Book vehicles for trips, view history, and manage profile.
-   **Authentication**: Secure JWT-based authentication with role-based access control.
-   **Dashboard**: Interactive dashboards for all user types.
-   **Admin Tools**: Dedicated scripts for admin creation and user management.
-   **Responsive Design**: Built with TailwindCSS for a premium mobile-first experience.

## 🛠️ Tech Stack

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: SQLite (Local file `transport_v4.db`) - Easy to swap with PostgreSQL.
-   **ORM**: SQLModel (SQLAlchemy + Pydantic)
-   **Security**: OAuth2 with Password Bearer tokens (JWT).

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: TailwindCSS
-   **State Management**: React Context API
-   **HTTP Client**: Axios

## 📋 Prerequisites

-   **Python** 3.9+
-   **Node.js** 16+
-   **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd transportation
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install Node dependencies.

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start the Backend
Open a terminal in the `backend` folder (ensure venv is activated):

```bash
python -m uvicorn app.main:app --reload
# Server running at http://127.0.0.1:8000
```

### Start the Frontend
Open a new terminal in the `frontend` folder:

```bash
npm run dev
# App running at http://localhost:5173
```

## 🔐 Admin Access

To create your first Admin user, use the provided utility script in the backend folder.

```bash
cd backend
# Usage: python create_admin.py <email> <password> [Name]
python create_admin.py admin@example.com admin123 "System Admin"
```

**Default Credentials:**
-   **Email**: `admin@example.com`
-   **Password**: `admin123`

## 📂 Project Structure

```
transportation/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── core/           # Config & Security
│   │   ├── models/         # Database Models
│   │   ├── routers/        # API Endpoints
│   │   └── main.py         # Entry Point
│   ├── create_admin.py     # Admin creation script
│   └── requirements.txt
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Application Pages
    │   ├── services/       # API Services
    │   └── App.jsx
    └── package.json
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License.
