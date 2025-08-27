"""
Concrete implementation of Booking repository.
Implements IBookingRepository interface with MongoDB.
"""
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from bson import ObjectId
from domain.interfaces.repositories import IBookingRepository
from domain.models.booking import Booking, BookingStatus, PaymentStatus
from infrastructure.database.mongodb import MongoDB


class MongoBookingRepository(IBookingRepository):
    """
    MongoDB implementation of Booking repository.
    Handles booking persistence operations.
    """
    def __init__(self):
        self.collection_name = "bookings"
        self.mongo = MongoDB()

    def _get_collection(self):
        """Get bookings collection"""
        db = self.mongo.get_database()
        return db[self.collection_name]

    def _document_to_booking(self, doc: Dict[str, Any]) -> Booking:
        """Convert MongoDB document to Booking domain object"""
        return Booking(
            booking_id=str(doc["_id"]),
            hotel_id=doc["hotel_id"],
            user_id=doc["user_id"],
            room_type=doc["room_type"],
            check_in_date=date.fromisoformat(doc["check_in_date"]),
            check_out_date=date.fromisoformat(doc["check_out_date"]),
            guests_count=doc["guests_count"],
            total_price=doc["total_price"],
            status=BookingStatus(doc["status"]),
            payment_status=PaymentStatus(doc["payment_status"]),
            special_requests=doc.get("special_requests"),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at")
        )

    def _booking_to_document(self, booking: Booking) -> Dict[str, Any]:
        """Convert Booking domain object to MongoDB document"""
        doc = booking.to_dict()
        if booking.booking_id:
            doc["_id"] = ObjectId(booking.booking_id)
        else:
            doc.pop("_id", None)
        return doc
    async def create(self, booking: Booking) -> Booking:
        """Create a new booking"""
        collection = self._get_collection()
        doc = self._booking_to_document(booking)
        doc["created_at"] = datetime.utcnow()
        doc["updated_at"] = datetime.utcnow()
        
        result = await collection.insert_one(doc)
        booking.booking_id = str(result.inserted_id)
        return booking

    async def get_by_id(self, booking_id: str) -> Optional[Booking]:
        """Get booking by ID"""
        collection = self._get_collection()
        doc = await collection.find_one({"_id": ObjectId(booking_id)})
        return self._document_to_booking(doc) if doc else None

    async def get_by_user_id(self, user_id: str) -> List[Booking]:
        """Get all bookings for a user"""
        collection = self._get_collection()
        cursor = collection.find({"user_id": user_id}).sort("created_at", -1)
        bookings = []
        async for doc in cursor:
            bookings.append(self._document_to_booking(doc))
        return bookings

    async def get_by_hotel_id(self, hotel_id: str) -> List[Booking]:
        """Get all bookings for a hotel"""
        collection = self._get_collection()
        cursor = collection.find({"hotel_id": hotel_id}).sort("check_in_date", 1)
        bookings = []
        async for doc in cursor:
            bookings.append(self._document_to_booking(doc))
        return bookings

    async def update(self, booking_id: str, booking: Booking) -> Optional[Booking]:
        """Update booking"""
        collection = self._get_collection()
        doc = self._booking_to_document(booking)
        doc["updated_at"] = datetime.utcnow()
        doc.pop("_id", None)
        
        result = await collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": doc}
        )
        
        if result.modified_count > 0:
            return await self.get_by_id(booking_id)
        return None

    async def delete(self, booking_id: str) -> bool:
        """Delete booking"""
        collection = self._get_collection()
        result = await collection.delete_one({"_id": ObjectId(booking_id)})
        return result.deleted_count > 0

    async def check_availability(
        self,
        hotel_id: str,
        room_type: str,
        check_in: date,
        check_out: date
    ) -> bool:
        """Check room availability for dates"""
        collection = self._get_collection()
        
        # Find overlapping bookings
        overlapping = await collection.count_documents({
            "hotel_id": hotel_id,
            "room_type": room_type,
            "status": {"$in": [BookingStatus.CONFIRMED, BookingStatus.PENDING]},
            "$or": [
                {
                    "check_in_date": {"$lt": check_out.isoformat()},
                    "check_out_date": {"$gt": check_in.isoformat()}
                }
            ]
        })
        
        # For simplicity, assuming each room type has limited availability
        # In production, this would check against actual room inventory
        return overlapping < 5  # Max 5 rooms of each type