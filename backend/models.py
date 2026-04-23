from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class FileMetadata(BaseModel):
    id: str
    filename: str
    original_name: str
    size: int
    uploaded_at: str
    owner: str