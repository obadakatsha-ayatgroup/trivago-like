"""
Search API endpoints.
Handles advanced hotel search operations.
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from datetime import date
from application.services.search_service import SearchService
from application.dto.search_dto import SearchQueryDTO, SearchResultDTO
from application.dto.hotel_dto import HotelResponseDTO
from dependencies import get_search_service
from typing import Optional


router = APIRouter(prefix="/search", tags=["search"])

@router.get("/hotels", response_model=SearchResultDTO)
async def search_hotels(
destination: Optional[str] = Query(None),
check_in: Optional[date] = Query(None),
check_out: Optional[date] = Query(None),
guests: int = Query(1, ge=1, le=10),
min_price: Optional[float] = Query(None, ge=0),
max_price: Optional[float] = Query(None, ge=0),
amenities: Optional[List[str]] = Query(None),
min_rating: Optional[int] = Query(None, ge=1, le=5),
sort_by: str = Query("relevance"),
page: int = Query(0, ge=0),
page_size: int = Query(20, ge=1, le=100),
service: SearchService = Depends(get_search_service)
):
    """Advanced hotel search with filters and sorting"""
    query = SearchQueryDTO(
    destination=destination,
    check_in_date=check_in,
    check_out_date=check_out,
    guests=guests,
    min_price=min_price,
    max_price=max_price,
    amenities=amenities,
    min_rating=min_rating,
    sort_by=sort_by,
    page=page,
    page_size=page_size
    )
    return await service.search(query)

@router.get("/destinations/popular", response_model=List[Dict[str, Any]])
async def get_popular_destinations(
service: SearchService = Depends(get_search_service)
):
    """Get list of popular destinations"""
    return await service.get_popular_destinations()

@router.get("/hotels/trending", response_model=List[HotelResponseDTO])
async def get_trending_hotels(
limit: int = Query(10, ge=1, le=50),
service: SearchService = Depends(get_search_service)
):
    """Get trending hotels"""
    return await service.get_trending_hotels(limit)