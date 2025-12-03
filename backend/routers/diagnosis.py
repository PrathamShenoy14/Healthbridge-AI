# routes/diagnosis_route.py

from fastapi import APIRouter, UploadFile, File, Form, Body, Query
from services.diagnosis_service import process_diagnosis
from services.diagnosis_service import get_diagnosis_request
from services.diagnosis_service import get_all_pending_requests
from core.db import diagnosis_requests_collection
from bson import ObjectId

router = APIRouter()

@router.post("/upload")
async def upload_diagnosis(
    file: UploadFile = File(...),
    patient_email: str = Form(...)
):
    return await process_diagnosis(patient_email, file)

@router.get("/status/{email}")
async def get_status(email: str):
    return await get_diagnosis_request(email)

@router.get("/pending")
async def get_pending():
    return await get_all_pending_requests()

@router.put("/{diagnosis_id}/report")
async def submit_report(
    diagnosis_id: str,
    doctor_email: str = Query(...),
    report: dict = Body(...)
):
    object_id = ObjectId(diagnosis_id)

    await diagnosis_requests_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "assigned_doctor": doctor_email,
                "doctor_report": report,
                "status": "diagnosed"
            }
        }
    )

    return {"success": True, "message": "Report submitted successfully"}
