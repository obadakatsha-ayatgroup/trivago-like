from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User role enumeration"""
    GUEST = "guest"
    HOTEL_OWNER = "hotel_owner"
    ADMIN = "admin"

class User:
    """
    User domain entity.
    Handles user authentication and profile management.
    """
    def __init__(self, 
                 user_id: Optional[str], 
                 email: str,
                 full_name: str,
                 phone_number: Optional[str] = None,
                 role: UserRole = UserRole.GUEST,
                 is_active: bool = True,
                 is_verified: bool = False,
                 preferences: Optional[Dict[str, Any]] = None,
                 created_at: Optional[datetime] = None,
                 updated_at: Optional[datetime] = None):
        self.user_id = user_id
        self.email = email
        self.full_name = full_name
        self.phone_number = phone_number
        self.role = role
        self.is_active = is_active
        self.is_verified = is_verified
        self.preferences = preferences or {}
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def has_permission(self, permission: str) -> bool:
        """Check if user has specific permission based on role"""
        permissions = {
            UserRole.GUEST: ["view_hotels", "make_booking", "view_own_bookings"],
            UserRole.HOTEL_OWNER: [
                "view_hotels", "make_booking", "view_own_bookings",
                "manage_own_hotels", "view_hotel_bookings"
            ],
            UserRole.ADMIN: ["all"]
        }
        
        user_permissions = permissions.get(self.role, [])
        return "all" in user_permissions or permission in user_permissions

    def update_preferences(self, new_preferences: Dict[str, Any]):
        """Update user preferences"""
        self.preferences.update(new_preferences)
        self.updated_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary representation"""
        return {
            "_id": self.user_id,
            "email": self.email,
            "full_name": self.full_name,
            "phone_number": self.phone_number,
            "role": self.role,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "preferences": self.preferences,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }