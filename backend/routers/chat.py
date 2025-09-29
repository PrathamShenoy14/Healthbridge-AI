# routers/chat.py
from fastapi import APIRouter, Form, UploadFile, File, Query
from typing import Optional
from models.chat import ChatResponse
from services.chat_service import process_chat, get_chat_history

router = APIRouter()

# -------------------------
# 1️⃣ Chat endpoint
# -------------------------
@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    user_query: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Handles a chat message.
    - user_query: text from frontend
    - user_id: optional identifier
    - image: optional image file
    """
    if not user_query and not image:
        return {"bot_response": "Please provide a query or image."}
    
    return await process_chat(user_query or "", user_id or "anonymous", image_file=image)


# -------------------------
# 2️⃣ Retrieve chat history
# -------------------------
@router.get("/history")
async def chat_history(user_id: str = Query(...), limit: int = 50):
    """
    Retrieve last 'limit' chat messages for a user
    """
    messages = await get_chat_history(user_id, limit)
    return {"messages": messages}
