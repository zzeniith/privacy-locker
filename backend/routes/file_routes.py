from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime
import os

from db import get_db, User  # Add if you need user lookup
from auth import get_current_user
from utils.encryption import encrypt_file, decrypt_file
from config import UPLOAD_DIR

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contents = file.file.read()
    encrypted = encrypt_file(contents)
    
    # Generate unique ID
    import uuid
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file_id)
    
    with open(file_path, "wb") as f:
        f.write(encrypted)
    
    # Store metadata in SQLite if needed
    # Or keep in memory/dict for now
    
    return {"message": "File uploaded successfully", "file_id": file_id}

@router.get("/list")
def list_files(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # List files from upload directory
    files = []
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            stat = os.stat(file_path)
            files.append({
                "file_id": filename,
                "size": stat.st_size,
                "uploaded_at": datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
    return files

@router.get("/download/{file_id}")
def download_file(
    file_id: str,
    current_user: str = Depends(get_current_user)
):
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    with open(file_path, "rb") as f:
        encrypted = f.read()
    
    decrypted = decrypt_file(encrypted)
    
    return Response(
        content=decrypted,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file_id}"}
    )