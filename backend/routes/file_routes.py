from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os

from config import MONGO_URL, DB_NAME, UPLOAD_DIR
from auth import get_current_user
from utils.encryption import encrypt_file, decrypt_file

router = APIRouter(prefix="/files", tags=["files"])
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    contents = await file.read()
    encrypted = encrypt_file(contents)

    file_id = str(ObjectId())
    file_path = os.path.join(UPLOAD_DIR, file_id)

    with open(file_path, "wb") as f:
        f.write(encrypted)

    await db.files.insert_one({
        "_id": ObjectId(file_id),
        "original_name": file.filename,
        "size": len(contents),
        "uploaded_at": datetime.utcnow().isoformat(),
        "owner": current_user,
        "file_path": file_path
    })

    return {"message": "File uploaded successfully", "file_id": file_id}

@router.get("/list")
async def list_files(current_user: str = Depends(get_current_user)):
    cursor = db.files.find({"owner": current_user})
    files = []
    async for doc in cursor:
        files.append({
            "id": str(doc["_id"]),
            "filename": doc["original_name"],
            "size": doc["size"],
            "uploaded_at": doc["uploaded_at"]
        })
    return files

@router.get("/download/{file_id}")
async def download_file(file_id: str, current_user: str = Depends(get_current_user)):
    doc = await db.files.find_one({"_id": ObjectId(file_id), "owner": current_user})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")

    with open(doc["file_path"], "rb") as f:
        encrypted_data = f.read()

    decrypted = decrypt_file(encrypted_data)

    return Response(
        content=decrypted,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{doc["original_name"]}"'}
    )

@router.delete("/{file_id}")
async def delete_file(file_id: str, current_user: str = Depends(get_current_user)):
    doc = await db.files.find_one({"_id": ObjectId(file_id), "owner": current_user})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(doc["file_path"])
    await db.files.delete_one({"_id": ObjectId(file_id)})
    return {"message": "File deleted successfully"}