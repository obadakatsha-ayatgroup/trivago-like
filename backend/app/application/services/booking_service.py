"""
Booking business logic service.
Manages booking operations and validations.
"""
from typing import List, Optional
from datetime import date
from app.domain.models.booking import Booking, BookingStatus
from app.domain.interfaces.repositories import IBookingRepository, IHotelRepository
from app.application.dto.booking_dto import CreateBookingDTO, BookingResponseDTO

class BookingService:
    """
    Booking service layer.
    Coordinates booking operations between repositories.
    """
    def __init__(
    self,
    booking_repository: IBookingRepository,
    hotel_repository: IHotelRepository ):
        """Initialize with repository dependencies"""
        self.booking_repository = booking_repository
        self.hotel_repository = hotel_repository

    async def create_booking(self, dto: CreateBookingDTO) -> Optional[BookingResponseDTO]:
        """Create a new booking with availability check"""
        # Check hotel exists
        hotel = await self.hotel_repository.get_by_id(dto.hotel_id)
        if not hotel:
            raise ValueError("Hotel not found")
        
        # Check room type exists
        room_types = [room.room_type for room in hotel.rooms]
        if dto.room_type not in room_types:
            raise ValueError("Invalid room type")
        
        # Check availability
        is_available = await self.booking_repository.check_availability(
            dto.hotel_id,
            dto.room_type,
            dto.check_in_date,
            dto.check_out_date
        )
        
        if not is_available:
            raise ValueError("Room not available for selected dates")
        
        # Calculate total price
        room = next(r for r in hotel.rooms if r.room_type == dto.room_type)
        nights = (dto.check_out_date - dto.check_in_date).days
        total_price = room.price_per_night * nights
        
        # Create booking
        booking = Booking(
            booking_id=None,
            hotel_id=dto.hotel_id,
            user_id=dto.user_id,
            room_type=dto.room_type,
            check_in_date=dto.check_in_date,
            check_out_date=dto.check_out_date,
            guests_count=dto.guests_count,
            total_price=total_price,
            special_requests=dto.special_requests
        )
        
        created_booking = await self.booking_repository.create(booking)
        return BookingResponseDTO.from_domain(created_booking, hotel.name)

    async def get_booking(self, booking_id: str) -> Optional[BookingResponseDTO]:
        """Get booking by ID"""
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            return None
        
        hotel = await self.hotel_repository.get_by_id(booking.hotel_id)
        hotel_name = hotel.name if hotel else "Unknown Hotel"
        return BookingResponseDTO.from_domain(booking, hotel_name)

    async def get_user_bookings(self, user_id: str) -> List[BookingResponseDTO]:
        """Get all bookings for a user"""
        bookings = await self.booking_repository.get_by_user_id(user_id)
        result = []
        
        for booking in bookings:
            hotel = await self.hotel_repository.get_by_id(booking.hotel_id)
            hotel_name = hotel.name if hotel else "Unknown Hotel"
            result.append(BookingResponseDTO.from_domain(booking, hotel_name))
        
        return result

    async def cancel_booking(self, booking_id: str) -> Optional[BookingResponseDTO]:
        """Cancel a booking"""
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            return None
        
        booking.cancel()
        updated_booking = await self.booking_repository.update(booking_id, booking)
        
        if updated_booking:
            hotel = await self.hotel_repository.get_by_id(updated_booking.hotel_id)
            hotel_name = hotel.name if hotel else "Unknown Hotel"
            return BookingResponseDTO.from_domain(updated_booking, hotel_name)
        
        return None

    async def confirm_booking(self, booking_id: str) -> Optional[BookingResponseDTO]:
        """Confirm a booking"""
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            return None
        
        booking.confirm()
        updated_booking = await self.booking_repository.update(booking_id, booking)
        
        if updated_booking:
            hotel = await self.hotel_repository.get_by_id(updated_booking.hotel_id)
            hotel_name = hotel.name if hotel else "Unknown Hotel"
            return BookingResponseDTO.from_domain(updated_booking, hotel_name)
        
        return None