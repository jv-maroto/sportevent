from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EventCreate(BaseModel):
    title: str
    sport: str
    description: Optional[str] = None
    date: datetime
    location: str
    max_capacity: int
    price: float = 0.0
    ranking_criteria: str = "time"  # "time" | "score" | "position"


class EventUpdate(BaseModel):
    title: Optional[str] = None
    sport: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    max_capacity: Optional[int] = None
    price: Optional[float] = None
    status: Optional[str] = None
    ranking_criteria: Optional[str] = None


class EventResponse(BaseModel):
    id: int
    title: str
    sport: str
    description: Optional[str] = None
    date: datetime
    location: str
    max_capacity: int
    price: float
    image_url: Optional[str] = None
    status: str
    ranking_criteria: str
    organizer_id: int
    organizer_name: Optional[str] = None
    available_spots: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}
