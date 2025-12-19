from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

class VehicleBase(SQLModel):
    type: str # e.g. Truck, Van
    capacity: str # e.g. "10 tons" or "500 sq ft"
    registration_number: str = Field(unique=True)

class Vehicle(VehicleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")

class VehicleCreate(VehicleBase):
    pass

class VehicleRead(VehicleBase):
    id: int
    owner_id: int
