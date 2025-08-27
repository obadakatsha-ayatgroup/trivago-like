"""
Hotel Data Transfer Objects.
Separates API contract from domain models (SRP).
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime
from app.domain.models.hotel import Hotel, HotelCategory, Amenity, Room, Location

class LocationDTO(BaseModel):
    """Location data transfer object"""
    address: str
    city: str
    country: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    postal_code: Optional[str] = None

class RoomDTO(BaseModel):
    """Room data transfer object"""
    room_type: str
    price_per_night: float = Field(gt=0)
    capacity: int = Field(ge=1, le=10)
    available_count: int = Field(ge=0)
    description: Optional[str] = ""

class CreateHotelDTO(BaseModel):
    """DTO for creating a new hotel"""
    name: str = Field(min_length=1, max_length=200)
    description: str
    location: LocationDTO
    category: HotelCategory
    star_rating: int = Field(ge=1, le=5)
    amenities: List[Amenity] = []
    rooms: List[RoomDTO]
    images: List[str] = []
    check_in_time: str = "14:00"
    check_out_time: str = "11:00"
    policies: Optional[Dict[str, str]] = None

    def to_domain(self) -> Hotel:
        """Convert DTO to domain model"""
        location = Location(
            address=self.location.address,
            city=self.location.city,
            country=self.location.country,
            latitude=self.location.latitude,
            longitude=self.location.longitude,
            postal_code=self.location.postal_code
        )
        
        rooms = [
            Room(
                room_type=r.room_type,
                price_per_night=r.price_per_night,
                capacity=r.capacity,
                available_count=r.available_count,
                description=r.description
            )
            for r in self.rooms
        ]
        
        return Hotel(
            hotel_id=None,
            name=self.name,
            description=self.description,
            location=location,
            category=self.category,
            star_rating=self.star_rating,
            amenities=self.amenities,
            rooms=rooms,
            images=self.images,
            check_in_time=self.check_in_time,
            check_out_time=self.check_out_time,
            policies=self.policies
        )
    
class UpdateHotelDTO(BaseModel):
    """DTO for updating hotel information"""
    name: Optional[str] = None
    description: Optional[str] = None
    star_rating: Optional[int] = Field(None, ge=1, le=5)
    amenities: Optional[List[Amenity]] = None
    rooms: Optional[List[RoomDTO]] = None
    images: Optional[List[str]] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    policies: Optional[Dict[str, str]] = None

    def apply_to_domain(self, hotel: Hotel) -> Hotel:
        """Apply updates to existing hotel"""
        if self.name is not None:
            hotel.name = self.name
        if self.description is not None:
            hotel.description = self.description
        if self.star_rating is not None:
            hotel.star_rating = self.star_rating
        if self.amenities is not None:
            hotel.amenities = self.amenities
        if self.rooms is not None:
            hotel.rooms = [
                Room(
                    room_type=r.room_type,
                    price_per_night=r.price_per_night,
                    capacity=r.capacity,
                    available_count=r.available_count,
                    description=r.description
                )
                for r in self.rooms
            ]
        if self.images is not None:
            hotel.images = self.images
        if self.check_in_time is not None:
            hotel.check_in_time = self.check_in_time
        if self.check_out_time is not None:
            hotel.check_out_time = self.check_out_time
        if self.policies is not None:
            hotel.policies = self.policies
        
        hotel.updated_at = datetime.utcnow()
        return hotel
    
class HotelResponseDTO(BaseModel):
    """DTO for hotel responses"""
    id: str
    name: str
    description: str
    location: LocationDTO
    category: str
    star_rating: int
    amenities: List[str]
    rooms: List[RoomDTO]
    images: List[str]
    check_in_time: str
    check_out_time: str
    policies: Dict[str, str]
    minimum_price: float
    available_rooms: int
    created_at: str
    updated_at: str
    
    @classmethod
    def from_domain(cls, hotel: Hotel) -> "HotelResponseDTO":
        """Create DTO from domain model"""
        return cls(
            id=hotel.hotel_id,
            name=hotel.name,
            description=hotel.description,
            location=LocationDTO(
                address=hotel.location.address,
                city=hotel.location.city,
                country=hotel.location.country,
                latitude=hotel.location.latitude,
                longitude=hotel.location.longitude,
                postal_code=hotel.location.postal_code
            ),
            category=hotel.category,
            star_rating=hotel.star_rating,
            amenities=hotel.amenities,
            rooms=[
                RoomDTO(
                    room_type=r.room_type,
                    price_per_night=r.price_per_night,
                    capacity=r.capacity,
                    available_count=r.available_count,
                    description=r.description
                )
                for r in hotel.rooms
            ],
            images=hotel.images,
            check_in_time=hotel.check_in_time,
            check_out_time=hotel.check_out_time,
            policies=hotel.policies,
            minimum_price=hotel.get_minimum_price(),
            available_rooms=hotel.get_available_rooms_count(),
            created_at=hotel.created_at.isoformat() if hotel.created_at else "",
            updated_at=hotel.updated_at.isoformat() if hotel.updated_at else ""
        )