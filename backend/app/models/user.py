from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum

class Role(str, Enum):
    OWNER = "owner"
    CUSTOMER = "customer"
    ADMIN = "admin"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Role = Field(default=Role.CUSTOMER)
    is_verified: bool = Field(default=False)
    profile_picture: Optional[str] = None # URL or path

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = None

class UserRead(UserBase):
    id: int
