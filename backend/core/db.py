from motor.motor_asyncio import AsyncIOMotorClient
from core.config import MONGO_URI, DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

patients_collection = db["patients"]
doctors_collection = db["doctors"]
files_collection = db["files"]
chat_collection = db["chat_history"]