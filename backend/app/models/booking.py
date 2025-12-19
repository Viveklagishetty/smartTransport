from sqlmodel import SQLModel, Field
from typing import Optional

from enum import Enum

class BookingStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class BookingBase(SQLModel):
    cargo_size: str
    total_price: float
    status: str = Field(default="pending")

class Booking(BookingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    booking_reference: str = Field(index=True, unique=True)
    trip_id: int = Field(foreign_key="trip.id")
    customer_id: int = Field(foreign_key="user.id")

class BookingCreate(BookingBase):
    trip_id: int

class BookingRead(BookingBase):
    id: int
    booking_reference: str
    trip_id: int
    customer_id: int
