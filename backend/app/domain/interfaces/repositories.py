"""
Repository interfaces following Dependency Inversion Principle.
Domain layer defines interfaces, infrastructure implements them.
"""
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from datetime import date
from domain.models.hotel import Hotel
from domain.models.booking import Booking
from domain.models.user import User
class IHotelRepository(ABC):
    """
    Hotel repository interface.
    Defines contract for hotel data access without implementation details.
    """
    @abstractmethod
    async def create(self, hotel: Hotel) -> Hotel:
        """Create a new hotel"""
        pass

    @abstractmethod
    async def get_by_id(self, hotel_id: str) -> Optional[Hotel]:
        """Get hotel by ID"""
        pass

    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Hotel]:
        """Get all hotels with pagination"""
        pass

    @abstractmethod
    async def update(self, hotel_id: str, hotel: Hotel) -> Optional[Hotel]:
        """Update hotel"""
        pass

    @abstractmethod
    async def delete(self, hotel_id: str) -> bool:
        """Delete hotel"""
        pass

    @abstractmethod
    async def search(
        self,
        city: Optional[str] = None,
        check_in: Optional[date] = None,
        check_out: Optional[date] = None,
        guests: int = 1,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        amenities: Optional[List[str]] = None,
        min_rating: Optional[int] = None
    ) -> List[Hotel]:
        """Search hotels with filters"""
        pass

class IBookingRepository(ABC):
    """
    Booking repository interface.
    Abstracts booking data persistence.
    """
    @abstractmethod
    async def create(self, booking: Booking) -> Booking:
        """Create a new booking"""
        pass

    @abstractmethod
    async def get_by_id(self, booking_id: str) -> Optional[Booking]:
        """Get booking by ID"""
        pass

    @abstractmethod
    async def get_by_user_id(self, user_id: str) -> List[Booking]:
        """Get all bookings for a user"""
        pass

    @abstractmethod
    async def get_by_hotel_id(self, hotel_id: str) -> List[Booking]:
        """Get all bookings for a hotel"""
        pass

    @abstractmethod
    async def update(self, booking_id: str, booking: Booking) -> Optional[Booking]:
        """Update booking"""
        pass

    @abstractmethod
    async def delete(self, booking_id: str) -> bool:
        """Delete booking"""
        pass

    @abstractmethod
    async def check_availability(
        self,
        hotel_id: str,
        room_type: str,
        check_in: date,
        check_out: date
    ) -> bool:
        """Check room availability for dates"""
        pass

class IUserRepository(ABC):
    """
    User repository interface.
    Defines user data access contract.
    """
    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass

    @abstractmethod
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        pass

    @abstractmethod
    async def update(self, user_id: str, user: User) -> Optional[User]:
        """Update user"""
        pass

    @abstractmethod
    async def delete(self, user_id: str) -> bool:
        """Delete user"""
        pass

