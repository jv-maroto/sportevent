from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import case
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user, require_organizer
from app.models.user import User
from app.models.event import Event
from app.models.inscription import Inscription
from app.models.result import Result
from app.schemas.result import ResultCreate, ResultUpdate, ResultResponse

router = APIRouter(prefix="/api/results", tags=["Resultados y Clasificaciones"])


def _result_to_response(result: Result) -> ResultResponse:
    return ResultResponse(
        id=result.id,
        position=result.position,
        time_seconds=result.time_seconds,
        score=result.score,
        notes=result.notes,
        user_id=result.user_id,
        event_id=result.event_id,
        user_name=result.user.full_name if result.user else None,
        created_at=result.created_at,
    )


@router.post("/", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    data: ResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Introducir resultado de un participante (solo organizador del evento)."""
    event = db.query(Event).filter(Event.id == data.event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no tienes permiso")

    # Verificar que el usuario esta inscrito y confirmado
    inscription = db.query(Inscription).filter(
        Inscription.user_id == data.user_id,
        Inscription.event_id == data.event_id,
        Inscription.status == "confirmed",
    ).first()
    if not inscription:
        raise HTTPException(status_code=400, detail="El usuario no esta inscrito/confirmado en este evento")

    existing = db.query(Result).filter(
        Result.user_id == data.user_id, Result.event_id == data.event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un resultado para este usuario en este evento")

    result = Result(
        user_id=data.user_id,
        event_id=data.event_id,
        position=data.position,
        time_seconds=data.time_seconds,
        score=data.score,
        notes=data.notes,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return _result_to_response(result)


@router.put("/{result_id}", response_model=ResultResponse)
def update_result(
    result_id: int,
    data: ResultUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Actualizar resultado de un participante."""
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")

    event = db.query(Event).filter(Event.id == result.event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar este resultado")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(result, field, value)

    db.commit()
    db.refresh(result)
    return _result_to_response(result)


@router.get("/event/{event_id}", response_model=List[ResultResponse])
def get_event_ranking(event_id: int, db: Session = Depends(get_db)):
    """Obtener clasificacion publica de un evento, ordenada segun el criterio del evento."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    query = db.query(Result).filter(Result.event_id == event_id)

    # Ordenar segun el criterio del evento (compatible con SQLite y PostgreSQL)
    if event.ranking_criteria == "time":
        query = query.order_by(case((Result.time_seconds.is_(None), 1), else_=0), Result.time_seconds.asc())
    elif event.ranking_criteria == "score":
        query = query.order_by(case((Result.score.is_(None), 1), else_=0), Result.score.desc())
    else:  # position
        query = query.order_by(case((Result.position.is_(None), 1), else_=0), Result.position.asc())

    query = query.options(joinedload(Result.user))
    results = query.all()
    return [_result_to_response(r) for r in results]
