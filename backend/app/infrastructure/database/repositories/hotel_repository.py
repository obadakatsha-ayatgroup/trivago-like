"""
Concrete implementation of Hotel repository.
Implements IHotelRepository interface with MongoDB.
"""
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from bson import ObjectId
from domain.interfaces.repositories import IHotelRepository
from domain.models.hotel import Hotel, HotelCategory, Amenity, Room, Location
from infrastructure.database.mongodb import MongoDB

class MongoHotelRepository(IHotelRepository):
    """
    MongoDB implementation of Hotel repository.
    Follows SRP: Only handles hotel data persistence.
    """
    def __init__(self):
        self.collection_name = "hotels"
        self.mongo = MongoDB()

    def _get_collection(self):
        """Get hotels collection"""
        db = self.mongo.get_database()
        return db[self.collection_name]

    def _document_to_hotel(self, doc: Dict[str, Any]) -> Hotel:
        """Convert MongoDB document to Hotel domain object"""
        location = Location(
            address=doc["location"]["address"],
            city=doc["location"]["city"],
            country=doc["location"]["country"],
            latitude=doc["location"]["latitude"],
            longitude=doc["location"]["longitude"],
            postal_code=doc["location"].get("postal_code")
        )
        
        rooms = [
            Room(
                room_type=r["room_type"],
                price_per_night=r["price_per_night"],
                capacity=r["capacity"],
                available_count=r["available_count"],
                description=r.get("description", "")
            )
            for r in doc.get("rooms", [])
        ]
        
        return Hotel(
            hotel_id=str(doc["_id"]),
            name=doc["name"],
            description=doc["description"],
            location=location,
            category=HotelCategory(doc["category"]),
            star_rating=doc["star_rating"],
            amenities=[Amenity(a) for a in doc.get("amenities", [])],
            rooms=rooms,
            images=doc.get("images", []),
            check_in_time=doc.get("check_in_time", "14:00"),
            check_out_time=doc.get("check_out_time", "11:00"),
            policies=doc.get("policies", {}),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at")
        )

    def _hotel_to_document(self, hotel: Hotel) -> Dict[str, Any]:
        """Convert Hotel domain object to MongoDB document"""
        doc = hotel.to_dict()
        if hotel.hotel_id:
            doc["_id"] = ObjectId(hotel.hotel_id)
        else:
            doc.pop("_id", None)
        return doc

    async def create(self, hotel: Hotel) -> Hotel:
        """Create a new hotel"""
        collection = self._get_collection()
        doc = self._hotel_to_document(hotel)
        doc["created_at"] = datetime.utcnow()
        doc["updated_at"] = datetime.utcnow()
        
        result = await collection.insert_one(doc)
        hotel.hotel_id = str(result.inserted_id)
        return hotel

    async def get_by_id(self, hotel_id: str) -> Optional[Hotel]:
        """Get hotel by ID"""
        collection = self._get_collection()
        doc = await collection.find_one({"_id": ObjectId(hotel_id)})
        return self._document_to_hotel(doc) if doc else None

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Hotel]:
        """Get all hotels with pagination"""
        collection = self._get_collection()
        cursor = collection.find().skip(skip).limit(limit)
        hotels = []
        async for doc in cursor:
            hotels.append(self._document_to_hotel(doc))
        return hotels

    async def update(self, hotel_id: str, hotel: Hotel) -> Optional[Hotel]:
        """Update hotel"""
        collection = self._get_collection()
        doc = self._hotel_to_document(hotel)
        doc["updated_at"] = datetime.utcnow()
        doc.pop("_id", None)  # Remove _id from update
        
        result = await collection.update_one(
            {"_id": ObjectId(hotel_id)},
            {"$set": doc}
        )
        
        if result.modified_count > 0:
            return await self.get_by_id(hotel_id)
        return None

    async def delete(self, hotel_id: str) -> bool:
        """Delete hotel"""
        collection = self._get_collection()
        result = await collection.delete_one({"_id": ObjectId(hotel_id)})
        return result.deleted_count > 0

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
        collection = self._get_collection()
        query = {}
        
        # City filter
        if city:
            query["location.city"] = {"$regex": city, "$options": "i"}
        
        # Price range filter
        price_query = {}
        if min_price is not None:
            price_query["$gte"] = min_price
        if max_price is not None:
            price_query["$lte"] = max_price
        if price_query:
            query["rooms.price_per_night"] = price_query
        
        # Amenities filter
        if amenities:
            query["amenities"] = {"$all": amenities}
        
        # Rating filter
        if min_rating:
            query["star_rating"] = {"$gte": min_rating}
        
        # Guest capacity filter
        query["rooms.capacity"] = {"$gte": guests}
        
        cursor = collection.find(query).limit(50)
        hotels = []
        async for doc in cursor:
            hotels.append(self._document_to_hotel(doc))
        
        return hotels