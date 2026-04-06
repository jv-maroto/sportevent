from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Inscription(Base):
    __tablename__ = "inscriptions"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(20), nullable=False, default="pending")  # "pending" | "confirmed" | "cancelled"
    amount_paid = Column(Float, nullable=False, default=0.0)
    stripe_session_id = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # FK
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="inscriptions")
    event = relationship("Event", back_populates="inscriptions")

    # Un usuario solo puede inscribirse una vez por evento
    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_user_event"),
    )
