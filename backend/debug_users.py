from sqlmodel import Session, select, create_engine
from app.models.user import User
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

with Session(engine) as session:
    users = session.exec(select(User)).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}, Verified: {user.is_verified}")
