from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

from enum import Enum

class TripStatus(str, Enum):
    OPEN = "open"
    FULL = "full"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TripBase(SQLModel):
    start_location: str
    end_location: str
    start_datetime: datetime
    available_capacity: str # Should match vehicle capacity format logic
    price_per_unit: float # e.g. per ton or fixed
    description: Optional[str] = None
    status: str = Field(default="open") # Using str for simplicity with SQLite

class Trip(TripBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicle.id")

class TripCreate(TripBase):
    vehicle_id: int

class TripRead(TripBase):
    id: int
    vehicle_id: int
