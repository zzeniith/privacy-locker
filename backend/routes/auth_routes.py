from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, DB_NAME
from models import UserRegister, UserLogin, Token
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@router.post("/register")
async def register(user: UserRegister):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    await db.users.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password)
    })
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(db_user["_id"]), "email": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}