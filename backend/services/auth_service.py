from utils.security import hash_password, verify_password, create_access_token
from core.db import patients_collection, doctors_collection

async def signup_user(email: str, password: str, confirm_password: str, role: str):
    """
    Sign up a new patient or doctor based on role.
    role: 'patient' or 'doctor'
    """
    if password != confirm_password:
        return {"error": "Passwords do not match"}

    collection = patients_collection if role == "patient" else doctors_collection

    existing = await collection.find_one({"email": email})
    if existing:
        return {"error": "Email already registered"}

    hashed = hash_password(password)
    await collection.insert_one({"email": email, "hashed_password": hashed})

    token = create_access_token({"sub": email, "role": role})
    return {"access_token": token, "token_type": "bearer","email":email, "role":role}


async def login_user(email: str, password: str):
    """
    Login a patient or doctor. Automatically detects role.
    """
    # First check patients
    user = await patients_collection.find_one({"email": email})
    role = "patient"
    
    # If not in patients, check doctors
    if not user:
        user = await doctors_collection.find_one({"email": email})
        role = "doctor"

    if not user or not verify_password(password, user["hashed_password"]):
        return {"error": "Invalid email or password"}

    token = create_access_token({"sub": email, "role": role})
    return {"access_token": token, "token_type": "bearer","email":email,"role":role}
