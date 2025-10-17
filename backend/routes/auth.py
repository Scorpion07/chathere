from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from jose import jwt
from passlib.hash import bcrypt

from db.database import get_session
from models.user import User

SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"

router = APIRouter()

# Utility: Create JWT token
def create_token(user: User):
    payload = {
        "sub": user.email,
        "username": user.username,
        "user_id": user.id,
        "is_admin": user.is_admin
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/register")
def register(user: User, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user.hashed_password = bcrypt.hash(user.hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered", "user_id": user.id}

@router.post("/login")
def login(data: dict, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data["email"])).first()
    if not user or not bcrypt.verify(data["password"], user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "username": user.username, "is_admin": user.is_admin}}
