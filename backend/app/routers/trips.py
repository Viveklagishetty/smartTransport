from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..core.database import get_session
from ..models.trip import Trip, TripCreate, TripRead, TripStatus
from ..models.vehicle import Vehicle
from ..models.user import User, Role
from .vehicles import get_current_user # importing dependency

router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/", response_model=TripRead)
def create_trip(trip: TripCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != Role.OWNER:
        raise HTTPException(status_code=403, detail="Only vehicle owners can create trips")
    
    # Verify vehicle belongs to user
    vehicle = session.get(Vehicle, trip.vehicle_id)
    if not vehicle or vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Vehicle not found or does not belong to you")
        
    db_trip = Trip.from_orm(trip)
    session.add(db_trip)
    session.commit()
    session.refresh(db_trip)
    return db_trip

@router.get("/", response_model=List[TripRead])
def read_trips(
    start_location: str = None, 
    end_location: str = None, 
    min_capacity: str = None, # Simple string match or complex logic?
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    # If owner, show my trips? Or all trips for customer?
    # Spec says: Customer Search return trips based on From, To, Date
    
    statement = select(Trip).where(Trip.status == TripStatus.OPEN)
    
    if start_location:
         statement = statement.where(Trip.start_location.contains(start_location))
    if end_location:
         statement = statement.where(Trip.end_location.contains(end_location))
    
    if current_user.role == Role.OWNER:
         # Owner might want to see THEIR trips regardless of status or search
         # For now letting them search globally or we can add /my-trips endpoint
         pass

    results = session.exec(statement)
    return results.all()

@router.get("/my-trips", response_model=List[TripRead])
def read_my_trips(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != Role.OWNER:
        raise HTTPException(status_code=403, detail="Not authorized")
    statement = select(Trip).where(Trip.vehicle_id.in_(
        select(Vehicle.id).where(Vehicle.owner_id == current_user.id)
    ))
    results = session.exec(statement)
    return results.all()
