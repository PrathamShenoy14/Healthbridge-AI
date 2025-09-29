from fastapi import APIRouter, HTTPException
from models.user import UserCreate, UserLogin, TokenResponse
from services import auth_service

router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate):
    result = await auth_service.signup_user(user.email, user.password, user.confirm_password,user.role)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    result = await auth_service.login_user(user.email, user.password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result
