from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..core.database import get_session
from ..core.security import oauth2_scheme, verify_password
from ..models.user import User, Role
from ..models.vehicle import Vehicle, VehicleCreate, VehicleRead
from ..routers.auth import login # To reuse dependency if needed, but better to create get_current_user

# We need a get_current_user dependency. 
# Since it wasn't in security.py, I'll add it here or refactor. 
# Best practice: put it in deps.py or security.py. I'll define it here for now or update security.py.

from jose import jwt, JWTError
from ..core.config import settings

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.post("/", response_model=VehicleRead)
def create_vehicle(vehicle: VehicleCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != Role.OWNER:
        raise HTTPException(status_code=403, detail="Only vehicle owners can add vehicles")
    
    db_vehicle = Vehicle.from_orm(vehicle, update={"owner_id": current_user.id})
    session.add(db_vehicle)
    session.commit()
    session.refresh(db_vehicle)
    return db_vehicle

@router.get("/", response_model=List[VehicleRead])
def read_my_vehicles(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role == Role.ADMIN:
         # Admin sees all? Or maybe just owners see theirs.
         statement = select(Vehicle)
    else:
        statement = select(Vehicle).where(Vehicle.owner_id == current_user.id)
    
    results = session.exec(statement)
    return results.all()
