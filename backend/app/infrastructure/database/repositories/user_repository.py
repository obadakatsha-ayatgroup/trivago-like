"""
Concrete implementation of User repository.
Implements IUserRepository interface with MongoDB.
"""
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from domain.interfaces.repositories import IUserRepository
from domain.models.user import User, UserRole
from infrastructure.database.mongodb import MongoDB

class MongoUserRepository(IUserRepository):
    """
    MongoDB implementation of User repository.
    Manages user data persistence.
    """
    def __init__(self):
        self.collection_name = "users"
        self.mongo = MongoDB()

    def _get_collection(self):
        """Get users collection"""
        db = self.mongo.get_database()
        return db[self.collection_name]

    def _document_to_user(self, doc: Dict[str, Any]) -> User:
        """Convert MongoDB document to User domain object"""
        return User(
            user_id=str(doc["_id"]),
            email=doc["email"],
            full_name=doc["full_name"],
            phone_number=doc.get("phone_number"),
            role=UserRole(doc.get("role", UserRole.GUEST)),
            is_active=doc.get("is_active", True),
            is_verified=doc.get("is_verified", False),
            preferences=doc.get("preferences", {}),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at")
        )

    def _user_to_document(self, user: User) -> Dict[str, Any]:
        """Convert User domain object to MongoDB document"""
        doc = user.to_dict()
        if user.user_id:
            doc["_id"] = ObjectId(user.user_id)
        else:
            doc.pop("_id", None)
        return doc

    async def create(self, user: User) -> User:
        """Create a new user"""
        collection = self._get_collection()
        doc = self._user_to_document(user)
        doc["created_at"] = datetime.utcnow()
        doc["updated_at"] = datetime.utcnow()
        
        result = await collection.insert_one(doc)
        user.user_id = str(result.inserted_id)
        return user

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        collection = self._get_collection()
        doc = await collection.find_one({"_id": ObjectId(user_id)})
        return self._document_to_user(doc) if doc else None

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        collection = self._get_collection()
        doc = await collection.find_one({"email": email})
        return self._document_to_user(doc) if doc else None

    async def update(self, user_id: str, user: User) -> Optional[User]:
        """Update user"""
        collection = self._get_collection()
        doc = self._user_to_document(user)
        doc["updated_at"] = datetime.utcnow()
        doc.pop("_id", None)
        
        result = await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": doc}
        )
        
        if result.modified_count > 0:
            return await self.get_by_id(user_id)
        return None

    async def delete(self, user_id: str) -> bool:
        """Delete user"""
        collection = self._get_collection()
        result = await collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0