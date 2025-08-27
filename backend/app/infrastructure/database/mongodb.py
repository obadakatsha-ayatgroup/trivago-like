from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.config import settings

class MongoDB:
    """
    MongoDB connection manager.
    Manages database connection lifecycle using singleton pattern.
    """
    _instance: Optional['MongoDB'] = None
    _client: Optional[AsyncIOMotorClient] = None
    _database: Optional[AsyncIOMotorDatabase] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Only initialize once
        if not hasattr(self, '_initialized'):
            self._initialized = True
    
    @classmethod
    async def connect_to_mongo(cls):
        """Create database connection"""
        if cls._client is None:
            print(f"🔗 Connecting to MongoDB: {settings.MONGODB_URL}")
            cls._client = AsyncIOMotorClient(settings.MONGODB_URL)
            cls._database = cls._client[settings.DATABASE_NAME]
            print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
    
    @classmethod
    async def close_mongo_connection(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._database = None
            print("🛑 Disconnected from MongoDB")
    
    @classmethod
    def get_database(cls) -> AsyncIOMotorDatabase:
        """Get database instance"""
        if cls._database is None:
            raise RuntimeError("Database is not initialized. Call connect_to_mongo() first.")
        return cls._database
    
    # Instance methods for backward compatibility
    async def connect(self):
        """Instance method wrapper"""
        await self.connect_to_mongo()
    
    async def close(self):
        """Instance method wrapper"""
        await self.close_mongo_connection()
    
    def get_db(self) -> AsyncIOMotorDatabase:
        """Instance method wrapper"""
        return self.get_database()