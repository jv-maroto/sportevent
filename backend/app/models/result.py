from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint, DateTime, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    position = Column(Integer, nullable=True)
    time_seconds = Column(Float, nullable=True)  # Tiempo en segundos (para carreras, natacion, etc.)
    score = Column(Float, nullable=True)  # Puntuacion (para torneos)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # FK
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="results")
    event = relationship("Event", back_populates="results")

    # Un resultado por usuario por evento
    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_result_user_event"),
    )
