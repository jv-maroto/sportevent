from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "participant"  # "organizer" | "participant"
    phone: Optional[str] = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('La contrasena debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('La contrasena debe contener al menos una mayuscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La contrasena debe contener al menos un numero')
        return v

    @field_validator('full_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v.strip()

    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ('participant', 'organizer'):
            raise ValueError('Rol debe ser participant u organizer')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    @field_validator('full_name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v.strip() if v else v


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('La contrasena debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('La contrasena debe contener al menos una mayuscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La contrasena debe contener al menos un numero')
        return v


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
