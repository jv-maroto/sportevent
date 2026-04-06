from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Base de datos (SQLite por defecto para desarrollo local, PostgreSQL en Docker)
    DATABASE_URL: str = "sqlite:///./sportevent.db"

    # JWT — SECRET_KEY es obligatoria en produccion (sin valor por defecto seguro)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # Uploads
    UPLOAD_DIR: str = "app/uploads"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
