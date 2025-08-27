"""
Hotel business logic service.
Orchestrates hotel-related operations following SRP.
"""
from typing import List, Optional
from datetime import date
from app.domain.models.hotel import Hotel
from app.domain.interfaces.repositories import IHotelRepository
from app.application.dto.hotel_dto import CreateHotelDTO, UpdateHotelDTO, HotelResponseDTO

class HotelService:
    """
    Hotel service layer.
    Implements business logic for hotel operations.
    Follows SRP: Only handles hotel business operations.
    """
    def __init__(self, hotel_repository: IHotelRepository):
        """
        Initialize with repository dependency.
        Follows DIP: Depends on abstraction, not concrete implementation.
        """
        self.hotel_repository = hotel_repository

    async def create_hotel(self, dto: CreateHotelDTO) -> HotelResponseDTO:
        """Create a new hotel"""
        hotel = dto.to_domain()
        created_hotel = await self.hotel_repository.create(hotel)
        return HotelResponseDTO.from_domain(created_hotel)

    async def get_hotel(self, hotel_id: str) -> Optional[HotelResponseDTO]:
        """Get hotel by ID"""
        hotel = await self.hotel_repository.get_by_id(hotel_id)
        return HotelResponseDTO.from_domain(hotel) if hotel else None

    async def list_hotels(self, skip: int = 0, limit: int = 100) -> List[HotelResponseDTO]:
        """List all hotels with pagination"""
        hotels = await self.hotel_repository.get_all(skip, limit)
        return [HotelResponseDTO.from_domain(hotel) for hotel in hotels]

    async def update_hotel(self, hotel_id: str, dto: UpdateHotelDTO) -> Optional[HotelResponseDTO]:
        """Update hotel information"""
        existing_hotel = await self.hotel_repository.get_by_id(hotel_id)
        if not existing_hotel:
            return None
        
        # Apply updates to existing hotel
        updated_hotel = dto.apply_to_domain(existing_hotel)
        saved_hotel = await self.hotel_repository.update(hotel_id, updated_hotel)
        return HotelResponseDTO.from_domain(saved_hotel) if saved_hotel else None

    async def delete_hotel(self, hotel_id: str) -> bool:
        """Delete a hotel"""
        return await self.hotel_repository.delete(hotel_id)

    async def search_hotels(
        self,
        city: Optional[str] = None,
        check_in: Optional[date] = None,
        check_out: Optional[date] = None,
        guests: int = 1,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        amenities: Optional[List[str]] = None,
        min_rating: Optional[int] = None
    ) -> List[HotelResponseDTO]:
        """Search hotels with filters"""
        hotels = await self.hotel_repository.search(
            city=city,
            check_in=check_in,
            check_out=check_out,
            guests=guests,
            min_price=min_price,
            max_price=max_price,
            amenities=amenities,
            min_rating=min_rating
        )
        return [HotelResponseDTO.from_domain(hotel) for hotel in hotels]