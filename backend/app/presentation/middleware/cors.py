"""
CORS middleware configuration.
Handles cross-origin resource sharing.
"""
from fastapi.middleware.cors import CORSMiddleware
def setup_cors(app):
    """Configure CORS middleware"""
    app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
    )