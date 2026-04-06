from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional


class ResultCreate(BaseModel):
    user_id: int
    event_id: int
    position: Optional[int] = None
    time_seconds: Optional[float] = None
    score: Optional[float] = None
    notes: Optional[str] = None

    @field_validator('position')
    @classmethod
    def validate_position(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v <= 0:
            raise ValueError('La posicion debe ser mayor a 0')
        return v

    @field_validator('time_seconds')
    @classmethod
    def validate_time(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError('El tiempo debe ser positivo')
        return v

    @field_validator('score')
    @classmethod
    def validate_score(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError('La puntuacion no puede ser negativa')
        return v


class ResultUpdate(BaseModel):
    position: Optional[int] = None
    time_seconds: Optional[float] = None
    score: Optional[float] = None
    notes: Optional[str] = None

    @field_validator('position')
    @classmethod
    def validate_position(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v <= 0:
            raise ValueError('La posicion debe ser mayor a 0')
        return v

    @field_validator('time_seconds')
    @classmethod
    def validate_time(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError('El tiempo debe ser positivo')
        return v

    @field_validator('score')
    @classmethod
    def validate_score(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError('La puntuacion no puede ser negativa')
        return v


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
