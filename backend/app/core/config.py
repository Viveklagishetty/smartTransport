from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Transport Load-Matching System"
    DATABASE_URL: str = "sqlite:///./transport_v4.db" # Default to SQLite for easy dev
    SECRET_KEY: str = "your-super-secret-key-change-this" # TODO: Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email Settings (for free Gmail/Outlook SMTP)
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "" # Enter your email
    SMTP_PASSWORD: str = "" # Enter your App Password
    EMAILS_ENABLED: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
