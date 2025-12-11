from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..core.database import get_session
from ..models.notification import Notification
from ..routers.vehicles import get_current_user
from ..models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[Notification])
def get_my_notifications(
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    statement = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    return session.exec(statement).all()

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    notification = session.get(Notification, notification_id)
    if notification and notification.user_id == current_user.id:
        notification.is_read = True
        session.add(notification)
        session.commit()
    return {"status": "success"}
