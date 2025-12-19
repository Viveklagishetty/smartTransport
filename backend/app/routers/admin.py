from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..core.database import get_session
from ..models.user import User, Role, UserRead
from ..models.trip import Trip
from ..models.booking import Booking
from .vehicles import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/users", response_model=List[UserRead])
def get_all_users(session: Session = Depends(get_session), admin: User = Depends(get_current_admin)):
    users = session.exec(select(User)).all()
    return users

@router.put("/users/{user_id}/verify", response_model=UserRead)
def verify_user(user_id: int, session: Session = Depends(get_session), admin: User = Depends(get_current_admin)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/stats")
def get_system_stats(session: Session = Depends(get_session), admin: User = Depends(get_current_admin)):
    user_count = len(session.exec(select(User)).all())
    trip_count = len(session.exec(select(Trip)).all())
    booking_count = len(session.exec(select(Booking)).all())
    return {
        "total_users": user_count,
        "total_trips": trip_count,
        "total_bookings": booking_count
    }

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, session: Session = Depends(get_session), admin: User = Depends(get_current_admin)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Optional: Prevent deleting self
    if user.id == admin.id:
         raise HTTPException(status_code=400, detail="Cannot delete yourself")

    session.delete(user)
    session.commit()
    return None
