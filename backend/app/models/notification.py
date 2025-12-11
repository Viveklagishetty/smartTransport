from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    message: str
    type: str = "general" # email, sms, in-app
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
