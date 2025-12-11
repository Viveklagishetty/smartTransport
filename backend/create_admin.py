from sqlmodel import Session, select
from app.core.database import engine
from app.models.user import User, Role
from app.core.security import get_password_hash
import sys

def create_admin_user(email, password, full_name="Admin User"):
    with Session(engine) as session:
        # Check if user exists
        user = session.exec(select(User).where(User.email == email)).first()
        
        if user:
            print(f"User {email} already exists. Updating role to ADMIN.")
            user.role = Role.ADMIN
            user.hashed_password = get_password_hash(password)
            user.is_verified = True
            session.add(user)
        else:
            print(f"Creating new admin user {email}.")
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name=full_name,
                role=Role.ADMIN,
                is_verified=True
            )
            session.add(user)
        
        session.commit()
        session.refresh(user)
        print(f"Admin user {user.email} successfully created/updated.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [full_name]")
    else:
        email = sys.argv[1]
        password = sys.argv[2]
        full_name = sys.argv[3] if len(sys.argv) > 3 else "Admin User"
        create_admin_user(email, password, full_name)
