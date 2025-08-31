import asyncio
import sys
import os
from datetime import datetime, date
from typing import List

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from infrastructure.database.mongodb import MongoDB
from domain.models.hotel import Hotel, HotelCategory, Amenity, Room, Location
from domain.models.user import User, UserRole
from domain.models.booking import Booking, BookingStatus, PaymentStatus

# Sample data
SAMPLE_HOTELS = [
    {
        "name": "Grand Palace Hotel",
        "description": "A luxurious 5-star hotel in the heart of Paris with stunning views of the Eiffel Tower and world-class amenities.",
        "location": {
            "address": "123 Champs-Élysées",
            "city": "Paris",
            "country": "France",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "postal_code": "75008"
        },
        "category": HotelCategory.LUXURY,
        "star_rating": 5,
        "amenities": [Amenity.WIFI, Amenity.POOL, Amenity.SPA, Amenity.RESTAURANT, Amenity.GYM, Amenity.ROOM_SERVICE],
        "rooms": [
            {
                "room_type": "Deluxe Room",
                "price_per_night": 250.0,
                "capacity": 2,
                "available_count": 10,
                "description": "Elegant room with city view and modern amenities"
            },
            {
                "room_type": "Presidential Suite",
                "price_per_night": 500.0,
                "capacity": 4,
                "available_count": 2,
                "description": "Luxurious suite with panoramic views and butler service"
            }
        ],
        "images": [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            "https://images.unsplash.com/photo-1578774204375-51d5c86de3d2?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
        ],
        "check_in_time": "15:00",
        "check_out_time": "11:00",
        "policies": {
            "cancellation": "Free cancellation up to 24 hours before check-in",
            "pets": "Pets are welcome with additional fee",
            "smoking": "Non-smoking property"
        }
    },
    {
        "name": "Tokyo Bay Resort",
        "description": "Modern waterfront hotel with panoramic bay views, authentic Japanese cuisine, and traditional spa services.",
        "location": {
            "address": "1-1-1 Shibaura",
            "city": "Tokyo",
            "country": "Japan",
            "latitude": 35.6762,
            "longitude": 139.6503,
            "postal_code": "108-0023"
        },
        "category": HotelCategory.STANDARD,
        "star_rating": 4,
        "amenities": [Amenity.WIFI, Amenity.RESTAURANT, Amenity.SPA, Amenity.GYM],
        "rooms": [
            {
                "room_type": "Standard Room",
                "price_per_night": 180.0,
                "capacity": 2,
                "available_count": 15,
                "description": "Comfortable room with modern Japanese design"
            },
            {
                "room_type": "Bay View Room",
                "price_per_night": 220.0,
                "capacity": 2,
                "available_count": 8,
                "description": "Stunning bay views with traditional Japanese elements"
            }
        ],
        "images": [
            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
        ],
        "check_in_time": "14:00",
        "check_out_time": "11:00",
        "policies": {
            "cancellation": "Free cancellation up to 48 hours before check-in",
            "pets": "No pets allowed",
            "smoking": "Designated smoking areas available"
        }
    },
    {
        "name": "Manhattan Downtown Hotel",
        "description": "Stylish boutique hotel in the financial district, walking distance to Wall Street and Brooklyn Bridge.",
        "location": {
            "address": "85 West Street",
            "city": "New York",
            "country": "USA",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "postal_code": "10006"
        },
        "category": HotelCategory.BOUTIQUE,
        "star_rating": 4,
        "amenities": [Amenity.WIFI, Amenity.GYM, Amenity.RESTAURANT, Amenity.BAR],
        "rooms": [
            {
                "room_type": "City View Room",
                "price_per_night": 320.0,
                "capacity": 2,
                "available_count": 12,
                "description": "Modern room with stunning city skyline views"
            },
            {
                "room_type": "Executive Suite",
                "price_per_night": 450.0,
                "capacity": 3,
                "available_count": 4,
                "description": "Spacious suite with separate living area and premium amenities"
            }
        ],
        "images": [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
        ],
        "check_in_time": "16:00",
        "check_out_time": "12:00",
        "policies": {
            "cancellation": "Free cancellation up to 24 hours before check-in",
            "pets": "Service animals only",
            "smoking": "Non-smoking property"
        }
    },
    {
        "name": "Royal London Hotel",
        "description": "Classic British elegance meets modern comfort in this historic hotel near Hyde Park and Buckingham Palace.",
        "location": {
            "address": "1 Park Lane",
            "city": "London",
            "country": "United Kingdom",
            "latitude": 51.5074,
            "longitude": -0.1278,
            "postal_code": "W1K 1QA"
        },
        "category": HotelCategory.LUXURY,
        "star_rating": 5,
        "amenities": [Amenity.WIFI, Amenity.POOL, Amenity.SPA, Amenity.RESTAURANT, Amenity.BAR, Amenity.ROOM_SERVICE],
        "rooms": [
            {
                "room_type": "Classic Room",
                "price_per_night": 350.0,
                "capacity": 2,
                "available_count": 20,
                "description": "Elegantly appointed room with traditional British décor"
            },
            {
                "room_type": "Royal Suite",
                "price_per_night": 750.0,
                "capacity": 4,
                "available_count": 3,
                "description": "Opulent suite with park views and butler service"
            }
        ],
        "images": [
            "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
        ],
        "check_in_time": "15:00",
        "check_out_time": "11:00",
        "policies": {
            "cancellation": "Free cancellation up to 48 hours before check-in",
            "pets": "Pets are welcome with advance notice",
            "smoking": "Non-smoking property with designated outdoor areas"
        }
    },
    {
        "name": "Barcelona Beach Resort",
        "description": "Mediterranean paradise with private beach access, rooftop terrace, and authentic Catalan cuisine.",
        "location": {
            "address": "Passeig Marítim de la Barceloneta",
            "city": "Barcelona",
            "country": "Spain",
            "latitude": 41.3851,
            "longitude": 2.1734,
            "postal_code": "08003"
        },
        "category": HotelCategory.RESORT,
        "star_rating": 4,
        "amenities": [Amenity.WIFI, Amenity.POOL, Amenity.RESTAURANT, Amenity.BAR, Amenity.SPA],
        "rooms": [
            {
                "room_type": "Ocean View Room",
                "price_per_night": 280.0,
                "capacity": 2,
                "available_count": 25,
                "description": "Bright room with stunning Mediterranean sea views"
            },
            {
                "room_type": "Beach Suite",
                "price_per_night": 420.0,
                "capacity": 4,
                "available_count": 6,
                "description": "Spacious suite with direct beach access and private terrace"
            }
        ],
        "images": [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1559599238-1c2c0cb9d7d5?w=800"
        ],
        "check_in_time": "14:00",
        "check_out_time": "12:00",
        "policies": {
            "cancellation": "Free cancellation up to 24 hours before check-in",
            "pets": "Small pets are welcome with additional fee",
            "smoking": "Smoking allowed on private terraces only"
        }
    }
]

SAMPLE_USERS = [
    {
        "email": "john.doe@example.com",
        "full_name": "John Doe",
        "phone_number": "+1-555-123-4567",
        "role": UserRole.GUEST,
        "is_active": True,
        "is_verified": True,
        "preferences": {
            "password_hash": "$2b$12$rBV2y5OY4hRz9.HJqKi7OOHyFzP8VgG0vGF.U.H1.HFEzU2Vz1Z2i", # "password123"
            "currency": "USD",
            "language": "en",
            "newsletter": True
        }
    },
    {
        "email": "jane.smith@example.com",
        "full_name": "Jane Smith",
        "phone_number": "+1-555-987-6543",
        "role": UserRole.GUEST,
        "is_active": True,
        "is_verified": True,
        "preferences": {
            "password_hash": "$2b$12$rBV2y5OY4hRz9.HJqKi7OOHyFzP8VgG0vGF.U.H1.HFEzU2Vz1Z2i", # "password123"
            "currency": "EUR",
            "language": "en",
            "newsletter": False
        }
    },
    {
        "email": "admin@tripfinder.com",
        "full_name": "Admin User",
        "phone_number": "+1-555-000-0001",
        "role": UserRole.ADMIN,
        "is_active": True,
        "is_verified": True,
        "preferences": {
            "password_hash": "$2b$12$rBV2y5OY4hRz9.HJqKi7OOHyFzP8VgG0vGF.U.H1.HFEzU2Vz1Z2i", # "password123"
            "currency": "USD",
            "language": "en"
        }
    }
]

class DatabaseSeeder:
    def __init__(self):
        self.db = None

    async def connect(self):
        """Connect to MongoDB"""
        await MongoDB.connect_to_mongo()
        self.db = MongoDB.get_database()
        print("✅ Connected to database")

    async def clear_collections(self):
        """Clear existing data"""
        collections = ["hotels", "users", "bookings"]
        for collection_name in collections:
            collection = self.db[collection_name]
            result = await collection.delete_many({})
            print(f"🗑️ Cleared {result.deleted_count} documents from {collection_name}")

    async def seed_hotels(self) -> List[str]:
        """Seed hotels data"""
        hotel_ids = []
        hotels_collection = self.db["hotels"]
        
        print("🏨 Seeding hotels...")
        for hotel_data in SAMPLE_HOTELS:
            # Create location object
            location = Location(
                address=hotel_data["location"]["address"],
                city=hotel_data["location"]["city"],
                country=hotel_data["location"]["country"],
                latitude=hotel_data["location"]["latitude"],
                longitude=hotel_data["location"]["longitude"],
                postal_code=hotel_data["location"].get("postal_code")
            )
            
            # Create room objects
            rooms = [
                Room(
                    room_type=room["room_type"],
                    price_per_night=room["price_per_night"],
                    capacity=room["capacity"],
                    available_count=room["available_count"],
                    description=room["description"]
                )
                for room in hotel_data["rooms"]
            ]
            
            # Create hotel object
            hotel = Hotel(
                hotel_id=None,
                name=hotel_data["name"],
                description=hotel_data["description"],
                location=location,
                category=hotel_data["category"],
                star_rating=hotel_data["star_rating"],
                amenities=hotel_data["amenities"],
                rooms=rooms,
                images=hotel_data["images"],
                check_in_time=hotel_data["check_in_time"],
                check_out_time=hotel_data["check_out_time"],
                policies=hotel_data["policies"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # Insert into database
            doc = hotel.to_dict()
            doc["created_at"] = datetime.utcnow().isoformat()
            doc["updated_at"] = datetime.utcnow().isoformat()
            doc.pop("_id", None)  # Remove _id to let MongoDB generate it
            
            result = await hotels_collection.insert_one(doc)
            hotel_ids.append(str(result.inserted_id))
            print(f"  ✅ Created hotel: {hotel_data['name']}")
        
        return hotel_ids

    async def seed_users(self) -> List[str]:
        """Seed users data with proper password hashing"""
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Hash the password properly
        password_hash = pwd_context.hash("password123")
        
        user_ids = []
        users_collection = self.db["users"]
        
        users_data = [
            {
                "email": "john.doe@example.com",
                "full_name": "John Doe",
                "phone_number": "+1-555-123-4567",
                "role": UserRole.GUEST,
                "is_active": True,
                "is_verified": True,
                "preferences": {
                    "password_hash": password_hash,
                    "currency": "USD",
                    "language": "en",
                    "newsletter": True
                }
            },
            {
                "email": "jane.smith@example.com",
                "full_name": "Jane Smith",
                "phone_number": "+1-555-987-6543",
                "role": UserRole.GUEST,
                "is_active": True,
                "is_verified": True,
                "preferences": {
                    "password_hash": password_hash,
                    "currency": "EUR",
                    "language": "en",
                    "newsletter": False
                }
            },
            {
                "email": "admin@tripfinder.com",
                "full_name": "Admin User",
                "phone_number": "+1-555-000-0001",
                "role": UserRole.ADMIN,
                "is_active": True,
                "is_verified": True,
                "preferences": {
                    "password_hash": password_hash,
                    "currency": "USD",
                    "language": "en"
                }
            }
        ]
        
        print("👤 Seeding users...")
        for user_data in users_data:
            # Create user object
            user = User(
                user_id=None,
                email=user_data["email"],
                full_name=user_data["full_name"],
                phone_number=user_data["phone_number"],
                role=user_data["role"],
                is_active=user_data["is_active"],
                is_verified=user_data["is_verified"],
                preferences=user_data["preferences"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # Insert into database
            doc = user.to_dict()
            doc["created_at"] = datetime.utcnow().isoformat()
            doc["updated_at"] = datetime.utcnow().isoformat()
            doc.pop("_id", None)
            
            result = await users_collection.insert_one(doc)
            user_ids.append(str(result.inserted_id))
            print(f"  ✅ Created user: {user_data['email']}")
        
        return user_ids

    async def seed_bookings(self, hotel_ids: List[str], user_ids: List[str]):
        """Seed sample bookings"""
        bookings_collection = self.db["bookings"]
        
        print("📅 Seeding bookings...")
        sample_bookings = [
            {
                "hotel_id": hotel_ids[0],  # Grand Palace Hotel
                "user_id": user_ids[0],    # John Doe
                "room_type": "Deluxe Room",
                "check_in_date": date(2024, 3, 15),
                "check_out_date": date(2024, 3, 18),
                "guests_count": 2,
                "total_price": 750.0,
                "status": BookingStatus.CONFIRMED,
                "payment_status": PaymentStatus.PAID,
                "special_requests": "Late check-in requested"
            },
            {
                "hotel_id": hotel_ids[1],  # Tokyo Bay Resort
                "user_id": user_ids[0],    # John Doe
                "room_type": "Bay View Room",
                "check_in_date": date(2024, 4, 20),
                "check_out_date": date(2024, 4, 25),
                "guests_count": 2,
                "total_price": 1100.0,
                "status": BookingStatus.PENDING,
                "payment_status": PaymentStatus.PENDING,
                "special_requests": None
            },
            {
                "hotel_id": hotel_ids[3],  # Royal London Hotel
                "user_id": user_ids[1],    # Jane Smith
                "room_type": "Classic Room",
                "check_in_date": date(2024, 5, 10),
                "check_out_date": date(2024, 5, 14),
                "guests_count": 1,
                "total_price": 1400.0,
                "status": BookingStatus.CONFIRMED,
                "payment_status": PaymentStatus.PAID,
                "special_requests": "Quiet room preferred"
            }
        ]
        
        for booking_data in sample_bookings:
            booking = Booking(
                booking_id=None,
                hotel_id=booking_data["hotel_id"],
                user_id=booking_data["user_id"],
                room_type=booking_data["room_type"],
                check_in_date=booking_data["check_in_date"],
                check_out_date=booking_data["check_out_date"],
                guests_count=booking_data["guests_count"],
                total_price=booking_data["total_price"],
                status=booking_data["status"],
                payment_status=booking_data["payment_status"],
                special_requests=booking_data["special_requests"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            doc = booking.to_dict()
            doc["created_at"] = datetime.utcnow().isoformat()
            doc["updated_at"] = datetime.utcnow().isoformat()
            doc.pop("_id", None)
            
            result = await bookings_collection.insert_one(doc)
            print(f"  ✅ Created booking: {result.inserted_id}")

    async def run_seed(self):
        """Run the complete seeding process"""
        try:
            print("🌱 Starting database seeding...")
            
            await self.connect()
            
            # Ask user if they want to clear existing data
            response = input("⚠️ This will clear all existing data. Continue? (y/N): ")
            if response.lower() != 'y':
                print("❌ Seeding cancelled")
                return
            
            await self.clear_collections()
            
            # Seed data
            hotel_ids = await self.seed_hotels()
            user_ids = await self.seed_users()
            await self.seed_bookings(hotel_ids, user_ids)
            
            print(f"""
🎉 Database seeding completed successfully!

📊 Summary:
   • Hotels: {len(hotel_ids)} created
   • Users: {len(user_ids)} created
   • Bookings: 3 created

🔐 Test accounts created:
   • Email: john.doe@example.com
   • Email: jane.smith@example.com  
   • Email: admin@tripfinder.com
   • Password for all: password123

🚀 Your application is now ready with sample data!
            """)
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            raise
        finally:
            await MongoDB.close_mongo_connection()

async def main():
    """Main function to run the seeder"""
    seeder = DatabaseSeeder()
    await seeder.run_seed()

if __name__ == "__main__":
    asyncio.run(main())