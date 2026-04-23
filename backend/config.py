import os
from dotenv import load_dotenv

load_dotenv()

# SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./privacy_locker.db")

# Upload directory
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)