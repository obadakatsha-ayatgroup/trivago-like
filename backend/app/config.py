"""
Configuration management using Pydantic Settings.
Follows SRP: Only responsible for application configuration.
"""
from typing import Optional
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "trivago_clone"
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    class Config:
        env_file = ".env"
settings = Settings()