"""
Domain model for Hotel entity.
Pure domain object following SRP - only contains hotel business logic.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class HotelCategory(str, Enum):
    """Hotel category enumeration"""
    BUDGET = "budget"
    STANDARD = "standard"
    LUXURY = "luxury"
    BOUTIQUE = "boutique"
    RESORT = "resort"

class Amenity(str, Enum):
    """Available hotel amenities"""
    WIFI = "wifi"
    PARKING = "parking"
    POOL = "pool"
    GYM = "gym"
    SPA = "spa"
    RESTAURANT = "restaurant"
    BAR = "bar"
    ROOM_SERVICE = "room_service"
    AIRPORT_SHUTTLE = "airport_shuttle"
    PET_FRIENDLY = "pet_friendly"

class Room:
    """Room value object"""
    def init(self, room_type: str, price_per_night: float,
            capacity: int,
            available_count: int,
            description: str = "" ):
        
        self.room_type = room_type
        self.price_per_night = price_per_night
        self.capacity = capacity
        self.available_count = available_count
        self.description = description

    def to_dict(self) -> Dict[str, Any]:
        return {
            "room_type": self.room_type,
            "price_per_night": self.price_per_night,
            "capacity": self.capacity,
            "available_count": self.available_count,
            "description": self.description
        }
    
class Location:
    """Location value object"""
    def init(self, address: str, city: str, country: str,
            latitude: float,
            longitude: float,
            postal_code: Optional[str] = None ):
        
        self.address = address
        self.city = city
        self.country = country
        self.latitude = latitude
        self.longitude = longitude
        self.postal_code = postal_code

    def to_dict(self) -> Dict[str, Any]:
        return {
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "postal_code": self.postal_code
        }
    
class Hotel:
    """
    Hotel domain entity.
    Represents core hotel business logic and rules.
    """
    def init(self, hotel_id: Optional[str], name: str,
            description: str,
            location: Location,
            category: HotelCategory,
            star_rating: int,
            amenities: List[Amenity],
            rooms: List[Room],
            images: List[str],
            check_in_time: str = "14:00",
            check_out_time: str = "11:00",
            policies: Optional[Dict[str, str]] = None,
            created_at: Optional[datetime] = None,
            updated_at: Optional[datetime] = None):
        self.hotel_id = hotel_id
        self.name = name
        self.description = description
        self.location = location
        self.category = category
        self.star_rating = self._validate_star_rating(star_rating)
        self.amenities = amenities
        self.rooms = rooms
        self.images = images
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.policies = policies or {}
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        
    @staticmethod
    def _validate_star_rating(rating: int) -> int:
        """Validate star rating is between 1 and 5"""
        if not 1 <= rating <= 5:
            raise ValueError("Star rating must be between 1 and 5")
        return rating

    def get_minimum_price(self) -> float:
        """Get the minimum room price for this hotel"""
        if not self.rooms:
            return 0.0
        return min(room.price_per_night for room in self.rooms)

    def get_available_rooms_count(self) -> int:
        """Get total number of available rooms"""
        return sum(room.available_count for room in self.rooms)

    def has_amenity(self, amenity: Amenity) -> bool:
        """Check if hotel has specific amenity"""
        return amenity in self.amenities

    def to_dict(self) -> Dict[str, Any]:
        """Convert hotel to dictionary representation"""
        return {
            "_id": self.hotel_id,
            "name": self.name,
            "description": self.description,
            "location": self.location.to_dict(),
            "category": self.category,
            "star_rating": self.star_rating,
            "amenities": self.amenities,
            "rooms": [room.to_dict() for room in self.rooms],
            "images": self.images,
            "check_in_time": self.check_in_time,
            "check_out_time": self.check_out_time,
            "policies": self.policies,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }