from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..core.database import get_session
from ..models.booking import Booking, BookingCreate, BookingRead, BookingStatus
from ..models.trip import Trip, TripStatus
from ..models.vehicle import Vehicle
from ..models.user import User, Role
from .vehicles import get_current_user # importing dependency

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingRead)
def create_booking(booking: BookingCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != Role.CUSTOMER:
        raise HTTPException(status_code=403, detail="Only customers can book trips")
    
    trip = session.get(Trip, booking.trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.OPEN:
        raise HTTPException(status_code=400, detail="Trip is not available")
    
    # Check if user already booked this trip? (Optional)
    
    # Generate Unique Reference
    import uuid
    reference = f"BK-{str(uuid.uuid4())[:8].upper()}"
    
    db_booking = Booking.from_orm(booking, update={"customer_id": current_user.id, "booking_reference": reference})
    session.add(db_booking)
    session.commit()
    session.refresh(db_booking)
    
    # Notify Truck Owner of new booking
    from ..core.notification_service import send_notification
    # Trip -> Vehicle -> Owner
    # We already fetched 'trip', now need owner
    db_trip = session.get(Trip, booking.trip_id)
    if db_trip:
        vehicle = session.get(Vehicle, db_trip.vehicle_id)
        if vehicle:
             owner = session.get(User, vehicle.owner_id)
             if owner:
                 send_notification(
                     owner.phone, 
                     owner.email, 
                     f"New Booking Request #{db_booking.id} for your trip from {db_trip.start_location} to {db_trip.end_location}",
                     owner.id,
                     session
                 )
    
    return db_booking

@router.get("/", response_model=List[BookingRead])
def read_my_bookings(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role == Role.CUSTOMER:
        statement = select(Booking).where(Booking.customer_id == current_user.id)
    elif current_user.role == Role.OWNER:
        # Get bookings for trips owned by this user
        # Join Booking -> Trip -> Vehicle -> User
        statement = select(Booking).join(Trip).join(Vehicle).where(Vehicle.owner_id == current_user.id)
    else: # Admin
        statement = select(Booking)
        
    results = session.exec(statement)
    return results.all()

@router.put("/{booking_id}/status", response_model=BookingRead)
def update_booking_status(booking_id: int, status_update: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # BookingStatus Enum: accepted, rejected
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    trip = session.get(Trip, booking.trip_id)
    vehicle = session.get(Vehicle, trip.vehicle_id)
    
    # Only owner of the trip can update status
    if vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to manage this booking")

    if status_update not in [BookingStatus.ACCEPTED, BookingStatus.REJECTED]:
         raise HTTPException(status_code=400, detail="Invalid status")
    
    booking.status = status_update
    session.add(booking)
    
    if status_update == BookingStatus.ACCEPTED:
        # Start "Simulation" or update capacity?
        # For MVP, maybe just update status.
        # If trip is full, update trip status.
        # trip.status = TripStatus.FULL (Logic dependent on capacity math)
        pass
        
    session.commit()
    session.refresh(booking)
    
    # Send Notification to Customer
    from ..core.notification_service import send_notification
    customer = session.get(User, booking.customer_id)
    if customer:
        send_notification(customer.phone, customer.email, f"Your booking #{booking.id} status is now: {status_update}", customer.id, session)
        
    return booking
