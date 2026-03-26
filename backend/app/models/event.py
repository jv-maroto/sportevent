from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    sport = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    location = Column(String(255), nullable=False)
    max_capacity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    image_url = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, default="draft")  # "draft" | "published" | "finished" | "cancelled"
    ranking_criteria = Column(String(20), nullable=False, default="time")  # "time" | "score" | "position"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # FK
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    organizer = relationship("User", back_populates="events")
    inscriptions = relationship("Inscription", back_populates="event")
    results = relationship("Result", back_populates="event")

    @property
    def available_spots(self) -> int:
        confirmed = [i for i in self.inscriptions if i.status == "confirmed"]
        return self.max_capacity - len(confirmed)
