from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth

app = FastAPI(
    title="Smart Transport Load-Matching System",
    description="API for matching transport vehicle owners with customers.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you might want to restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
from .routers import vehicles, trips
app.include_router(vehicles.router)
app.include_router(trips.router)
from .routers import bookings, admin, users, notifications
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(users.router)
app.include_router(notifications.router)

@app.on_event("startup")
def on_startup():
    from .core.database import create_db_and_tables
    create_db_and_tables()
    
    # Auto-create default admin on startup for deployment convenience
    try:
        from create_admin import create_admin_user
        create_admin_user("admin@example.com", "admin123", "System Admin")
        print("Default admin verified/created.")
    except ImportError:
        # Fallback if the script isn't in the path (though it should be in rootDir)
        pass
    except Exception as e:
        print(f"Error creating default admin: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Transport Load-Matching System API"}
