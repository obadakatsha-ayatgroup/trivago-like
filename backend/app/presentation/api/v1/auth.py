from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from infrastructure.security.auth import AuthService
from dependencies import get_user_repository

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone_number: Optional[str]
    role: str
    is_active: bool
    is_verified: bool

def get_auth_service() -> AuthService:
    """Get authentication service"""
    return AuthService(get_user_repository())

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login user and return access token"""
    user = await auth_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = auth_service.create_access_token(
        data={"sub": user.email, "user_id": user.user_id}, 
        expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name
    )

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    register_data: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register new user"""
    try:
        user = await auth_service.register_user(
            email=register_data.email,
            password=register_data.password,
            full_name=register_data.full_name,
            phone_number=register_data.phone_number
        )
        
        return UserResponse(
            id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            phone_number=user.phone_number,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current authenticated user"""
    token_data = auth_service.verify_token(credentials.credentials)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_repository = get_user_repository()
    user = await user_repository.get_by_email(token_data.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified
    )