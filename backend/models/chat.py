# models/chat_history.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# 1️⃣ Request model (frontend sends text + optional image)
class ChatRequest(BaseModel):
    user_query: Optional[str] = None
    user_id: Optional[str] = None
    image: Optional[str] = None  # base64 or URL, not stored

# 2️⃣ Response model (backend returns)
class ChatResponse(BaseModel):
    bot_response: str

# 3️⃣ MongoDB model (chat storage)
class ChatDocument(BaseModel):
    user_id: Optional[str] = None
    user_query: Optional[str] = None
    bot_response: str
    predicted_class: Optional[str] = None
    confidence: Optional[float] = None
    image_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
