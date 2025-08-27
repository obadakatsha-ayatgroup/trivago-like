"""
Hotel API endpoints.
Handles HTTP requests and responses for hotel operations.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.application.services.hotel_service import HotelService
from app.application.dto.hotel_dto import CreateHotelDTO, UpdateHotelDTO, HotelResponseDTO
from app.dependencies import get_hotel_service

router = APIRouter(prefix="/hotels", tags=["hotels"])

@router.post("/", response_model=HotelResponseDTO, status_code=201)
async def create_hotel(
    hotel_dto: CreateHotelDTO,
    service: HotelService = Depends(get_hotel_service)):
    """Create a new hotel"""
    try:
        return await service.create_hotel(hotel_dto)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{hotel_id}", response_model=HotelResponseDTO)
async def get_hotel(
    hotel_id: str,
    service: HotelService = Depends(get_hotel_service)
):
    """Get hotel by ID"""
    hotel = await service.get_hotel(hotel_id)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel

@router.get("/", response_model=List[HotelResponseDTO])
async def list_hotels(
skip: int = Query(0, ge=0),
limit: int = Query(100, ge=1, le=100),
service: HotelService = Depends(get_hotel_service)
):
    """List all hotels with pagination"""
    return await service.list_hotels(skip, limit)

@router.put("/{hotel_id}", response_model=HotelResponseDTO)
async def update_hotel(
hotel_id: str,
hotel_dto: UpdateHotelDTO,
service: HotelService = Depends(get_hotel_service)
):
    """Update hotel information"""
    hotel = await service.update_hotel(hotel_id, hotel_dto)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel

@router.delete("/{hotel_id}", status_code=204)
async def delete_hotel(
hotel_id: str,
service: HotelService = Depends(get_hotel_service)
):
    """Delete a hotel"""
    deleted = await service.delete_hotel(hotel_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
