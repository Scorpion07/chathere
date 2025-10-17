from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from db.database import get_session
from models.user import User
from models.chat import ChatMessage
from jose import jwt, JWTError

from routes.auth import SECRET_KEY, ALGORITHM

router = APIRouter()

# ---------------------------
# Utils: Decode and check admin
# ---------------------------

def get_admin_user(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("is_admin"):
            raise HTTPException(status_code=403, detail="Admins only")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------
# GET /admin/users
# ---------------------------

@router.get("/users", response_model=List[User])
def get_all_users(token: str, session: Session = Depends(get_session)):
    get_admin_user(token)
    users = session.exec(select(User)).all()
    return users


# ---------------------------
# GET /admin/logs
# ---------------------------

@router.get("/logs", response_model=List[ChatMessage])
def get_all_chat_logs(token: str, session: Session = Depends(get_session)):
    get_admin_user(token)
    chats = session.exec(select(ChatMessage).order_by(ChatMessage.timestamp)).all()
    return chats
