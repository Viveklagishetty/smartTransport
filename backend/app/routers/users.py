from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..core.database import get_session
from ..models.user import User, UserRead, UserUpdate
from ..routers.vehicles import get_current_user
from ..core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.put("/me", response_model=UserRead)
def update_my_profile(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    user_data = user_update.dict(exclude_unset=True)
    if "password" in user_data:
        password = user_data["password"]
        if password:
             hashed_password = get_password_hash(password)
             user_data["hashed_password"] = hashed_password
        del user_data["password"]
        
    for key, value in user_data.items():
        setattr(current_user, key, value)
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.get("/me", response_model=UserRead)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user
