from fastapi import APIRouter, HTTPException
from models.personal_info import PersonalInfo
from core.db import personal_info_collection, diagnosis_requests_collection
from bson import ObjectId


router = APIRouter()

@router.get("/info")
async def get_personal_info(email: str):
    record = await personal_info_collection.find_one({"patient_email": email}, {"_id": False})

    if not record:
        raise HTTPException(status_code=404, detail="Personal info not found")

    return record


@router.put("/info")
async def update_personal_info(data: PersonalInfo, email: str):
    update_data = {k: (v if v not in ["", None] else "NA") for k, v in data.dict().items()}

    await personal_info_collection.update_one(
        {"patient_email": email},
        {"$set": update_data}
    )

    return {"message": "Personal info updated successfully"}

@router.get("/full-info")
async def get_full_patient_info(email: str, diagnosis_id: str):
    # fetch personal info
    personal = await personal_info_collection.find_one(
        {"patient_email": email},
        {"_id": 0}  # remove _id
    )

    if not personal:
        raise HTTPException(status_code=404, detail="Personal info not found")

    # fetch diagnosis info
    diagnosis = await diagnosis_requests_collection.find_one(
        {"_id": ObjectId(diagnosis_id)},
        {"assigned_doctor": 0, "doctor_report": 0}  # remove fields
    )

    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis request not found")

    diagnosis["_id"] = str(diagnosis["_id"])  # convert ObjectId to string

    return {
        "personal_info": personal,
        "diagnosis_info": diagnosis
    }
