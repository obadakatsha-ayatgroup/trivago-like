from typing import Optional, Dict, Any
from datetime import datetime, date
from enum import Enum

class BookingStatus(str, Enum):
    """Booking status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"

class PaymentStatus(str, Enum):
    """Payment status enumeration"""
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"

class Booking:
    """
    Booking domain entity.
    Encapsulates booking business logic and invariants.
    """
    def __init__(self, 
                 booking_id: Optional[str], 
                 hotel_id: str,
                 user_id: str,
                 room_type: str,
                 check_in_date: date,
                 check_out_date: date,
                 guests_count: int,
                 total_price: float,
                 status: BookingStatus = BookingStatus.PENDING,
                 payment_status: PaymentStatus = PaymentStatus.PENDING,
                 special_requests: Optional[str] = None,
                 created_at: Optional[datetime] = None,
                 updated_at: Optional[datetime] = None):
        self.booking_id = booking_id
        self.hotel_id = hotel_id
        self.user_id = user_id
        self.room_type = room_type
        self.check_in_date = check_in_date
        self.check_out_date = check_out_date
        self.guests_count = guests_count
        self.total_price = total_price
        self.status = status
        self.payment_status = payment_status
        self.special_requests = special_requests
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self._validate_dates()
        self._validate_guests()
        self._validate_price()
    
    def _validate_dates(self):
        """Validate check-in and check-out dates"""
        if self.check_out_date <= self.check_in_date:
            raise ValueError("Check-out date must be after check-in date")
        # Allow past dates for demo/testing purposes
        # Uncomment this line in production:
        # if self.check_in_date < date.today():
        #     raise ValueError("Check-in date cannot be in the past")

    def _validate_guests(self):
        """Validate guest count"""
        if self.guests_count < 1:
            raise ValueError("At least one guest is required")
        if self.guests_count > 10:
            raise ValueError("Maximum 10 guests per booking")

    def _validate_price(self):
        """Validate total price"""
        if self.total_price <= 0:
            raise ValueError("Total price must be positive")

    def get_nights_count(self) -> int:
        """Calculate number of nights"""
        return (self.check_out_date - self.check_in_date).days

    def can_cancel(self) -> bool:
        """Check if booking can be cancelled"""
        return self.status in [BookingStatus.PENDING, BookingStatus.CONFIRMED]

    def cancel(self):
        """Cancel the booking"""
        if not self.can_cancel():
            raise ValueError(f"Cannot cancel booking with status: {self.status}")
        self.status = BookingStatus.CANCELLED
        self.updated_at = datetime.utcnow()

    def confirm(self):
        """Confirm the booking"""
        if self.status != BookingStatus.PENDING:
            raise ValueError(f"Cannot confirm booking with status: {self.status}")
        self.status = BookingStatus.CONFIRMED
        self.updated_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert booking to dictionary representation"""
        return {
            "_id": self.booking_id,
            "hotel_id": self.hotel_id,
            "user_id": self.user_id,
            "room_type": self.room_type,
            "check_in_date": self.check_in_date.isoformat(),
            "check_out_date": self.check_out_date.isoformat(),
            "guests_count": self.guests_count,
            "total_price": self.total_price,
            "status": self.status,
            "payment_status": self.payment_status,
            "special_requests": self.special_requests,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }