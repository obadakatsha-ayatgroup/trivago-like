"""
Dependency injection configuration.
Implements IoC container for clean architecture.
"""
from functools import lru_cache
from infrastructure.database.repositories.hotel_repository import MongoHotelRepository
from infrastructure.database.repositories.booking_repository import MongoBookingRepository
from infrastructure.database.repositories.user_repository import MongoUserRepository
from application.services.hotel_service import HotelService
from application.services.booking_service import BookingService
from application.services.search_service import SearchService

@lru_cache()
def get_hotel_repository():
    """Get hotel repository instance"""
    return MongoHotelRepository()

@lru_cache()
def get_booking_repository():
    """Get booking repository instance"""
    return MongoBookingRepository()

@lru_cache()
def get_user_repository():
    """Get user repository instance"""
    return MongoUserRepository()

def get_hotel_service() -> HotelService:
    """Get hotel service with dependencies"""
    return HotelService(get_hotel_repository())


def get_booking_service() -> BookingService:
    """Get booking service with dependencies"""
    return BookingService(
    get_booking_repository(),
    get_hotel_repository()
    )


def get_search_service() -> SearchService:
    """Get search service with dependencies"""
    return SearchService(get_hotel_repository())