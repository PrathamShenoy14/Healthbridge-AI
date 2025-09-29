from fastapi import APIRouter, HTTPException
from models.file import FileCreate
from services import file_service

router = APIRouter()

@router.post("/")
async def createFile(file: FileCreate):
    result = await file_service.create_file(file.title, file.description, file.url)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/")
async def get_files():
    return await file_service.get_all_files()