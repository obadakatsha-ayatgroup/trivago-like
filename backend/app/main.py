"""
FastAPI application entry point.
Configures and starts the application.
"""
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
from config import settings
from infrastructure.database.mongodb import MongoDB #connect_to_mongo, close_mongo_connection
from presentation.api.v1 import hotels, bookings, search
from presentation.middleware.cors import setup_cors
from presentation.middleware.error_handler import (
http_exception_handler,
validation_exception_handler,
general_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    mongo = MongoDB()
    await mongo.connect_to_mongo()
    yield
    # Shutdown
    await mongo.close_mongo_connection()

app = FastAPI(
title="Trivago Clone API",
description="Hotel booking platform with clean architecture",
version="1.0.0",
lifespan=lifespan
)

setup_cors(app)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(hotels.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
    "message": "Trivago Clone API",
    "version": "1.0.0",
    "docs": "/docs"
    }
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}