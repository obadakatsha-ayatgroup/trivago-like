"""
Configuration management using Pydantic Settings.
Follows SRP: Only responsible for application configuration.
"""
from typing import Optional
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    MONGODB_URL: str = "mongodb://admin:password@localhost:27007"
    DATABASE_NAME: str = "trivago_clone"
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    class Config:
        env_file = ".env"
settings = Settings()