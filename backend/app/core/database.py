from sqlmodel import SQLModel, create_engine, Session
from .config import settings
from ..models import user, vehicle, trip, booking # Import models to register them

engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
