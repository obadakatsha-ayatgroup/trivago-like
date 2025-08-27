"""
Search-related Data Transfer Objects.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date
from app.application.dto.hotel_dto import HotelResponseDTO

class SearchQueryDTO(BaseModel):
    """DTO for search queries"""
    destination: Optional[str] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    guests: int = Field(default=1, ge=1, le=10)
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    amenities: Optional[List[str]] = None
    min_rating: Optional[int] = Field(None, ge=1, le=5)
    sort_by: str = "relevance"  # relevance, price, rating
    page: int = Field(default=0, ge=0)
    page_size: int = Field(default=20, ge=1, le=100)

class SearchResultDTO(BaseModel):
    """DTO for search results"""
    hotels: List[HotelResponseDTO]
    total_count: int
    page: int
    page_size: int
    total_pages: int