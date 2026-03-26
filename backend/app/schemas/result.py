from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResultCreate(BaseModel):
    user_id: int
    event_id: int
    position: Optional[int] = None
    time_seconds: Optional[float] = None
    score: Optional[float] = None
    notes: Optional[str] = None


class ResultUpdate(BaseModel):
    position: Optional[int] = None
    time_seconds: Optional[float] = None
    score: Optional[float] = None
    notes: Optional[str] = None


class ResultResponse(BaseModel):
    id: int
    position: Optional[int] = None
    time_seconds: Optional[float] = None
    score: Optional[float] = None
    notes: Optional[str] = None
    user_id: int
    event_id: int
    user_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
