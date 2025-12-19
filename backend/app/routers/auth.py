from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from ..core.database import get_session
from ..core.security import verify_password, create_access_token, get_password_hash, oauth2_scheme
from ..models.user import User, UserCreate, UserRead, Role
from datetime import timedelta
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserRead)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    results = session.exec(statement)
    existing_user = results.first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        hashed_pass = get_password_hash(user.password)
        user_data = user.dict()
        if "password" in user_data:
            del user_data["password"]
        db_user = User(**user_data, hashed_password=hashed_pass)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # Send Welcome Notification
    from ..core.notification_service import send_notification
    # Note: user_id might be None before commit/refresh, but here it is refreshed
    if db_user.id:
        send_notification(db_user.phone, db_user.email, f"Welcome {db_user.full_name} to SmartTrans! Your account is created.", db_user.id, session)
    
    return db_user

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    results = session.exec(statement) # returns an iterator
    user = results.first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "user_id": user.id}
