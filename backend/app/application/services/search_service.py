"""
Advanced search service.
Implements complex search algorithms and scoring.
"""
from typing import List, Optional, Dict, Any
from datetime import date
import math
from domain.interfaces.repositories import IHotelRepository
from application.dto.search_dto import SearchQueryDTO, SearchResultDTO
from application.dto.hotel_dto import HotelResponseDTO


class SearchService:
    """
    Search service with advanced filtering and ranking.
    Follows OCP: Can be extended with new search strategies.
    """
    def __init__(self, hotel_repository: IHotelRepository):
        """Initialize with repository dependency"""
        self.hotel_repository = hotel_repository

    async def search(self, query: SearchQueryDTO) -> SearchResultDTO:
        """
        Perform advanced hotel search with ranking.
        Implements search algorithm with relevance scoring.
        """
        # Search hotels using repository
        hotels = await self.hotel_repository.search(
            city=query.destination,
            check_in=query.check_in_date,
            check_out=query.check_out_date,
            guests=query.guests,
            min_price=query.min_price,
            max_price=query.max_price,
            amenities=query.amenities,
            min_rating=query.min_rating
        )
        
        # Calculate relevance scores
        scored_hotels = []
        for hotel in hotels:
            score = self._calculate_relevance_score(hotel, query)
            scored_hotels.append((hotel, score))
        
        # Sort by relevance score
        scored_hotels.sort(key=lambda x: x[1], reverse=True)
        
        # Apply pagination
        start = query.page * query.page_size
        end = start + query.page_size
        paginated_hotels = scored_hotels[start:end]
        
        # Convert to DTOs
        hotel_dtos = [
            HotelResponseDTO.from_domain(hotel)
            for hotel, _ in paginated_hotels
        ]
        
        return SearchResultDTO(
            hotels=hotel_dtos,
            total_count=len(hotels),
            page=query.page,
            page_size=query.page_size,
            total_pages=math.ceil(len(hotels) / query.page_size)
        )

    def _calculate_relevance_score(self, hotel, query: SearchQueryDTO) -> float:
        """
        Calculate relevance score for hotel based on search criteria.
        Higher score means better match.
        """
        score = 0.0
        
        # Rating score (0-50 points)
        score += hotel.star_rating * 10
        
        # Price score (0-30 points)
        min_price = hotel.get_minimum_price()
        if query.max_price:
            price_ratio = min_price / query.max_price
            score += (1 - price_ratio) * 30
        
        # Amenities match score (0-20 points)
        if query.amenities:
            matched = sum(1 for a in query.amenities if hotel.has_amenity(a))
            score += (matched / len(query.amenities)) * 20
        
        # Availability score (bonus points)
        if hotel.get_available_rooms_count() > 5:
            score += 10
        
        return score

    async def get_popular_destinations(self) -> List[Dict[str, Any]]:
        """Get list of popular destinations"""
        # In production, this would aggregate from bookings data
        return [
            {"city": "Paris", "country": "France", "hotels_count": 1250},
            {"city": "London", "country": "UK", "hotels_count": 980},
            {"city": "New York", "country": "USA", "hotels_count": 1500},
            {"city": "Tokyo", "country": "Japan", "hotels_count": 750},
            {"city": "Barcelona", "country": "Spain", "hotels_count": 620}
        ]

    async def get_trending_hotels(self, limit: int = 10) -> List[HotelResponseDTO]:
        """Get trending hotels based on recent bookings"""
        # Simplified: just get top-rated hotels
        hotels = await self.hotel_repository.get_all(skip=0, limit=limit)
        hotels.sort(key=lambda h: h.star_rating, reverse=True)
        return [HotelResponseDTO.from_domain(hotel) for hotel in hotels[:limit]]