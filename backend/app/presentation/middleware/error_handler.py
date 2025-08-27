"""
Global error handling middleware.
Centralizes error responses.
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
    status_code=exc.status_code,
    content={
    "error": exc.detail,
    "status_code": exc.status_code
    }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    content={
    "error": "Validation error",
    "details": exc.errors()
    }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    content={
    "error": "Internal server error",
    "message": str(exc)
    }
    )

