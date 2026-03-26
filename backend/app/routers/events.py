import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user, require_organizer
from app.models.user import User
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate, EventResponse

router = APIRouter(prefix="/api/events", tags=["Eventos"])


def _event_to_response(event: Event) -> EventResponse:
    return EventResponse(
        id=event.id,
        title=event.title,
        sport=event.sport,
        description=event.description,
        date=event.date,
        location=event.location,
        max_capacity=event.max_capacity,
        price=event.price,
        image_url=event.image_url,
        status=event.status,
        ranking_criteria=event.ranking_criteria,
        organizer_id=event.organizer_id,
        organizer_name=event.organizer.full_name if event.organizer else None,
        available_spots=event.available_spots,
        created_at=event.created_at,
    )


@router.get("/", response_model=List[EventResponse])
def list_events(
    sport: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Listar eventos publicos con filtros opcionales."""
    query = db.query(Event).filter(Event.status == "published")

    if sport:
        query = query.filter(Event.sport.ilike(f"%{sport}%"))
    if status_filter:
        query = query.filter(Event.status == status_filter)
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))

    events = query.order_by(Event.date.asc()).all()
    return [_event_to_response(e) for e in events]


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Obtener detalle de un evento por ID."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return _event_to_response(event)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Crear un nuevo evento (solo organizadores)."""
    event = Event(
        title=data.title,
        sport=data.sport,
        description=data.description,
        date=data.date,
        location=data.location,
        max_capacity=data.max_capacity,
        price=data.price,
        ranking_criteria=data.ranking_criteria,
        organizer_id=current_user.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return _event_to_response(event)


@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Actualizar un evento (solo el organizador propietario)."""
    event = db.query(Event).filter(Event.id == event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no tienes permiso")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return _event_to_response(event)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Eliminar un evento (solo el organizador propietario)."""
    event = db.query(Event).filter(Event.id == event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no tienes permiso")

    db.delete(event)
    db.commit()


@router.post("/{event_id}/image", response_model=EventResponse)
async def upload_event_image(
    event_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Subir imagen para un evento."""
    event = db.query(Event).filter(Event.id == event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no tienes permiso")

    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Solo se permiten imagenes JPEG, PNG o WebP")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    event.image_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(event)
    return _event_to_response(event)
