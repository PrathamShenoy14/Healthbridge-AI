# services/diagnosis_service.py

from datetime import datetime
import cloudinary.uploader
from utils.model import classify
from core.db import diagnosis_requests_collection

# ------------------------------------
# 1️⃣ Upload & classify diagnosis image
# ------------------------------------

async def get_all_pending_requests():
    cursor = diagnosis_requests_collection.find(
        {"status": "pending"}
    ).sort("created_at", -1)

    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return results

async def get_diagnosis_request(email: str):
    record = await diagnosis_requests_collection.find_one(
        {"patient_email": email},
        sort=[("created_at", -1)]
    )

    if not record:
        return {"status": "no_record"}

    record["_id"] = str(record["_id"])  # convert ObjectId to string
    return record

async def process_diagnosis(patient_email: str, image_file):
    # 1️⃣ Upload image to Cloudinary
    result = cloudinary.uploader.upload(image_file.file)
    image_url = result.get("secure_url")

    # 2️⃣ Run classifier model
    predicted_class, confidence = await classify(image_file)

    # 3️⃣ Determine cancer type
    cancerous_labels = ["melanoma", "basal cell carcinoma", "squamous cell carcinoma"]
    is_cancerous = predicted_class.lower() in cancerous_labels

    # 4️⃣ Insert diagnosis request document
    doc = {
        "patient_email": patient_email,
        "image_url": image_url,
        "prediction": predicted_class,
        "confidence": confidence,
        "is_cancerous": is_cancerous,
        "status": "pending",
        "assigned_doctor": None,
        "doctor_report": None,
        "created_at": datetime.utcnow()
    }

    result_insert = await diagnosis_requests_collection.insert_one(doc)

    # 5️⃣ Return backend response for frontend UI
    return {
        "request_id": str(result_insert.inserted_id),
        "patient_email": patient_email,
        "image_url": image_url,
        "prediction": predicted_class,
        "confidence": confidence,
        "status": "pending"
    }
