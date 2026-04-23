from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.file_routes import router as file_router

app = FastAPI(title="Privacy Locker API")

# CORS for localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(file_router)

@app.get("/")
def root():
    return {"message": "Privacy Locker API is running"}