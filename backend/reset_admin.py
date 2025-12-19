from sqlmodel import Session, select, create_engine
from app.models.user import User, Role
from app.core.config import settings
from app.core.security import get_password_hash

engine = create_engine(settings.DATABASE_URL)

def reset_admin():
    with Session(engine) as session:
        email = "admin@example.com"
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            print(f"User {email} not found. Creating new admin...")
            user = User(
                email=email,
                hashed_password=get_password_hash("Admin123!"),
                role=Role.ADMIN,
                is_verified=True,
                full_name="System Admin"
            )
            session.add(user)
        else:
            print(f"User {email} found. Updating credentials and role...")
            user.hashed_password = get_password_hash("Admin123!")
            user.role = Role.ADMIN
            user.is_verified = True
            session.add(user)
        
        session.commit()
        session.refresh(user)
        print(f"Admin reset successful. Email: {user.email}, Role: {user.role}")

if __name__ == "__main__":
    reset_admin()
