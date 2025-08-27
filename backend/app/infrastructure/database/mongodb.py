"""
MongoDB connection manager.
Handles database connectivity following SRP.
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from config import settings

class MongoDB:
    """
    MongoDB connection manager.
    Manages database connection lifecycle.
    """
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.database: Optional[AsyncIOMotorDatabase] = None

    async def connect_to_mongo(self):
        """Create database connection"""
        self.client = AsyncIOMotorClient(settings.mongodb_url)
        self.database = self.client[settings.database_name]
        print(f"✅ Connected to MongoDB: {settings.database_name}")

    async def close_mongo_connection(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            print("🛑 Disconnected from MongoDB")

    def get_database(self) -> AsyncIOMotorDatabase:
        """Get database instance"""
        if not self.database:
            raise RuntimeError("Database is not initialized")
        return self.database