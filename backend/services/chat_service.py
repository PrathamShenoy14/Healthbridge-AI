# services/chat_service.py
from services.retriever_service import retrieve
from services.prompt_service import build_prompt
from utils.safety import check_red_flags, add_safety
from core.db import chat_collection
import google.generativeai as genai
import cloudinary.uploader
from datetime import datetime
from core.config import GENAI_API_KEY
from utils.model import classify

genai.configure(api_key=GENAI_API_KEY)

# -------------------------
# 1️⃣ Process chat request
# -------------------------
async def process_chat(user_query: str, user_id: str, image_file=None):
    # 1️⃣ Save image to Cloudinary if exists
    image_url = None
    if image_file:
        result =  cloudinary.uploader.upload(image_file.file)
        image_url = result.get("secure_url")

    # 2️⃣ Check if any red flags are present
    is_urgent = check_red_flags(user_query)

    # 3️⃣ Optional classifier if image exists
    predicted_class = None
    confidence = None
    if image_file:
        predicted_class, confidence = await classify(image_file)


    # 4️⃣ Retrieve relevant chunks from PDFs
    chunks = retrieve(f"{user_query} {predicted_class or ''}")

    # 5️⃣ Build LLM prompt
    prompt = build_prompt(user_query, chunks, predicted_class, confidence)

    # 6️⃣ Generate LLM response
    resp = genai.GenerativeModel("gemini-2.5-flash").generate_content(prompt)
    answer = add_safety(resp.text, predicted_class)

    # 7️⃣ Prepend urgent warning if needed
    if is_urgent:
        answer = "⚠️ Your symptoms may be urgent. Please seek medical attention immediately.\n\n" + answer

    # 8️⃣ Save full chat in MongoDB
    await save_chat_document(
        user_id=user_id,
        user_query=user_query,
        bot_response=answer,
        predicted_class=predicted_class,
        confidence=confidence,
        image_url=image_url
    )

    return {"bot_response": answer}


# -------------------------
# 2️⃣ Save chat to MongoDB
# -------------------------
async def save_chat_document(user_id, user_query, bot_response, predicted_class=None, confidence=None, image_url=None):
    doc = {
        "user_id": user_id,
        "user_query": user_query,
        "bot_response": bot_response,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "image_url": image_url,
        "timestamp": datetime.utcnow()
    }
    await chat_collection.insert_one(doc)


# -------------------------
# 3️⃣ Retrieve chat history
# -------------------------
async def get_chat_history(user_id: str, limit: int = 50):
    cursor = chat_collection.find({"user_id": user_id}).sort("timestamp", 1).limit(limit)
    messages = []
    async for doc in cursor:
        messages.append({
            "user_query": doc.get("user_query"),
            "bot_response": doc.get("bot_response"),
            "predicted_class": doc.get("predicted_class"),
            "confidence": doc.get("confidence"),
            "image_url": doc.get("image_url"),
            "timestamp": doc.get("timestamp")
        })
    return messages
