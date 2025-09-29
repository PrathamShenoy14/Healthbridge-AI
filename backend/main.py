from fastapi import FastAPI
from routers import auth
from routers import file
from routers import chat

app = FastAPI(title="Skin Lesion Backend")

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(file.router, prefix="/file", tags=["file"])
app.include_router(chat.router, prefix="/chat",tags=["chat"])
@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}
