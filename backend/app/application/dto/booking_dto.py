"""
Booking Data Transfer Objects.
"""
from typing import Optional
from pydantic import BaseModel, Field, validator
from datetime import date
from app.domain.models.booking import Booking

class CreateBookingDTO(BaseModel):
    """DTO for creating a booking"""
    hotel_id: str
    user_id: str
    room_type: str
    check_in_date: date
    check_out_date: date
    guests_count: int = Field(ge=1, le=10)
    special_requests: Optional[str] = None

    @validator('check_out_date')
    def validate_dates(cls, v, values):
        if 'check_in_date' in values and v <= values['check_in_date']:
            raise ValueError('Check-out must be after check-in')
        return v
    
class BookingResponseDTO(BaseModel):
    """DTO for booking responses"""
    id: str
    hotel_id: str
    hotel_name: str
    user_id: str
    room_type: str
    check_in_date: str
    check_out_date: str
    guests_count: int
    total_price: float
    nights_count: int
    status: str
    payment_status: str
    special_requests: Optional[str]
    can_cancel: bool
    created_at: str
    updated_at: str

    @classmethod
    def from_domain(cls, booking: Booking, hotel_name: str) -> "BookingResponseDTO":
        """Create DTO from domain model"""
        return cls(
            id=booking.booking_id,
            hotel_id=booking.hotel_id,
            hotel_name=hotel_name,
            user_id=booking.user_id,
            room_type=booking.room_type,
            check_in_date=booking.check_in_date.isoformat(),
            check_out_date=booking.check_out_date.isoformat(),
            guests_count=booking.guests_count,
            total_price=booking.total_price,
            nights_count=booking.get_nights_count(),
            status=booking.status,
            payment_status=booking.payment_status,
            special_requests=booking.special_requests,
            can_cancel=booking.can_cancel(),
            created_at=booking.created_at.isoformat() if booking.created_at else "",
            updated_at=booking.updated_at.isoformat() if booking.updated_at else ""
        )

    