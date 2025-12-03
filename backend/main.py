from fastapi import FastAPI
from routers import auth
from routers import file
from routers import chat
from routers import personal_info
from routers import diagnosis

app = FastAPI(title="Skin Lesion Backend")

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(file.router, prefix="/file", tags=["file"])
app.include_router(chat.router, prefix="/chat",tags=["chat"])
app.include_router(personal_info.router, prefix="/personal", tags=["personal"])
app.include_router(diagnosis.router, prefix="/diagnosis",tags=["diagnosis"])
@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}
