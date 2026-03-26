from typing import List

import stripe
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user, require_organizer
from app.models.user import User
from app.models.event import Event
from app.models.inscription import Inscription
from app.schemas.inscription import InscriptionResponse, CheckoutResponse

router = APIRouter(prefix="/api/inscriptions", tags=["Inscripciones"])

stripe.api_key = settings.STRIPE_SECRET_KEY


def _inscription_to_response(insc: Inscription) -> InscriptionResponse:
    return InscriptionResponse(
        id=insc.id,
        status=insc.status,
        amount_paid=insc.amount_paid,
        stripe_session_id=insc.stripe_session_id,
        created_at=insc.created_at,
        user_id=insc.user_id,
        event_id=insc.event_id,
        user_name=insc.user.full_name if insc.user else None,
        event_title=insc.event.title if insc.event else None,
    )


@router.post("/checkout/{event_id}", response_model=CheckoutResponse)
def create_checkout(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crear sesion de pago en Stripe para inscribirse a un evento."""
    event = db.query(Event).filter(Event.id == event_id, Event.status == "published").first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no esta publicado")

    if event.available_spots <= 0:
        raise HTTPException(status_code=400, detail="No quedan plazas disponibles")

    existing = db.query(Inscription).filter(
        Inscription.user_id == current_user.id,
        Inscription.event_id == event_id,
        Inscription.status.in_(["pending", "confirmed"]),
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya estas inscrito en este evento")

    # Crear inscripcion pendiente
    inscription = Inscription(
        user_id=current_user.id,
        event_id=event_id,
        amount_paid=event.price,
        status="pending",
    )
    db.add(inscription)
    db.commit()
    db.refresh(inscription)

    # Si el evento es gratuito, confirmar directamente
    if event.price == 0:
        inscription.status = "confirmed"
        db.commit()
        return CheckoutResponse(checkout_url="free", session_id="free")

    # Crear sesion de Stripe Checkout
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Inscripcion: {event.title}"},
                    "unit_amount": int(event.price * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{settings.CORS_ORIGINS.split(',')[0]}/inscription/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.CORS_ORIGINS.split(',')[0]}/events/{event_id}",
            metadata={"inscription_id": str(inscription.id)},
        )
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Error con Stripe: {str(e)}")

    inscription.stripe_session_id = session.id
    db.commit()

    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Webhook de Stripe para confirmar pagos."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Firma de webhook invalida")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        inscription_id = session.get("metadata", {}).get("inscription_id")
        if inscription_id:
            inscription = db.query(Inscription).filter(Inscription.id == int(inscription_id)).first()
            if inscription:
                inscription.status = "confirmed"
                db.commit()

    return {"status": "ok"}


@router.get("/my", response_model=List[InscriptionResponse])
def my_inscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Listar mis inscripciones."""
    inscriptions = db.query(Inscription).filter(Inscription.user_id == current_user.id).all()
    return [_inscription_to_response(i) for i in inscriptions]


@router.get("/event/{event_id}", response_model=List[InscriptionResponse])
def event_inscriptions(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    """Listar inscritos de un evento (solo organizador propietario)."""
    event = db.query(Event).filter(Event.id == event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado o no tienes permiso")

    inscriptions = db.query(Inscription).filter(Inscription.event_id == event_id).all()
    return [_inscription_to_response(i) for i in inscriptions]
