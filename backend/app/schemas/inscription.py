from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InscriptionCreate(BaseModel):
    event_id: int


class InscriptionResponse(BaseModel):
    id: int
    status: str
    amount_paid: float
    stripe_session_id: Optional[str] = None
    created_at: datetime
    user_id: int
    event_id: int
    user_name: Optional[str] = None
    event_title: Optional[str] = None

    model_config = {"from_attributes": True}


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
