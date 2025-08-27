"""
Booking API endpoints.
Manages booking-related HTTP operations.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.application.services.booking_service import BookingService
from app.application.dto.booking_dto import CreateBookingDTO, BookingResponseDTO
from ....dependencies import get_booking_service

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingResponseDTO, status_code=201)
async def create_booking(booking_dto: CreateBookingDTO,
service: BookingService = Depends(get_booking_service)):
    """Create a new booking"""
    try:
        booking = await service.create_booking(booking_dto)
        if not booking:
            raise HTTPException(status_code=400, detail="Unable to create booking")
        return booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/{booking_id}", response_model=BookingResponseDTO)
async def get_booking(
booking_id: str,
service: BookingService = Depends(get_booking_service)
):
    """Get booking by ID"""
    booking = await service.get_booking(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.get("/user/{user_id}", response_model=List[BookingResponseDTO])
async def get_user_bookings(
user_id: str,
service: BookingService = Depends(get_booking_service)
):
    """Get all bookings for a user"""
    return await service.get_user_bookings(user_id)

@router.post("/{booking_id}/cancel", response_model=BookingResponseDTO)
async def cancel_booking(
booking_id: str,
service: BookingService = Depends(get_booking_service)
):
    """Cancel a booking"""
    try:
        booking = await service.cancel_booking(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/{booking_id}/confirm", response_model=BookingResponseDTO)
async def confirm_booking(
booking_id: str,
service: BookingService = Depends(get_booking_service)
):
    """Confirm a booking"""
    try:
        booking = await service.confirm_booking(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

