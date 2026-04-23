import os
from fastapi import FastAPI
from fastAPI.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.file_routes import router as file_router

app = FastAPI(title="Privacy Locker API")

# Read CORS origins from environment variable
CORS_ALLOWED = os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)