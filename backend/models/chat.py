# backend/models/chat.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
