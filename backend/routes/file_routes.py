from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime
import os
import uuid

from db import get_db
from auth import get_current_user
from config import UPLOAD_DIR

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contents = file.file.read()
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file_id)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {"message": "File uploaded successfully", "file_id": file_id}

@router.get("/list")
def list_files(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    files = []
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            stat = os.stat(file_path)
            files.append({
                "file_id": filename,
                "name": filename,
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
        contents = f.read()
    
    return Response(
        content=contents,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file_id}"}
    )