from pydantic import BaseModel, field_validator
from datetime import datetime, timezone
from typing import Optional

VALID_RANKING_CRITERIA = ('time', 'score', 'position')
VALID_STATUSES = ('draft', 'published', 'finished', 'cancelled')


class EventCreate(BaseModel):
    title: str
    sport: str
    description: Optional[str] = None
    date: datetime
    location: str
    max_capacity: int
    price: float = 0.0
    ranking_criteria: str = "time"

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError('El titulo debe tener al menos 3 caracteres')
        return v.strip()

    @field_validator('max_capacity')
    @classmethod
    def validate_capacity(cls, v: int) -> int:
        if v <= 0:
            raise ValueError('La capacidad debe ser mayor a 0')
        if v > 10000:
            raise ValueError('La capacidad no puede superar 10000')
        return v

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: float) -> float:
        if v < 0:
            raise ValueError('El precio no puede ser negativo')
        return round(v, 2)

    @field_validator('ranking_criteria')
    @classmethod
    def validate_ranking(cls, v: str) -> str:
        if v not in VALID_RANKING_CRITERIA:
            raise ValueError(f'Criterio debe ser uno de: {", ".join(VALID_RANKING_CRITERIA)}')
        return v


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

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f'Status debe ser uno de: {", ".join(VALID_STATUSES)}')
        return v

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError('El precio no puede ser negativo')
        return round(v, 2) if v is not None else v

    @field_validator('max_capacity')
    @classmethod
    def validate_capacity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v <= 0:
            raise ValueError('La capacidad debe ser mayor a 0')
        return v

    @field_validator('ranking_criteria')
    @classmethod
    def validate_ranking(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_RANKING_CRITERIA:
            raise ValueError(f'Criterio debe ser uno de: {", ".join(VALID_RANKING_CRITERIA)}')
        return v


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
