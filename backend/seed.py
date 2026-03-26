"""
Script para crear usuarios de prueba y eventos de ejemplo.
Ejecutar: python seed.py
"""
from datetime import datetime, timedelta, timezone

from app.core.database import engine, SessionLocal, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.event import Event
from app.models.inscription import Inscription

# Importar todos los modelos para que se creen las tablas
from app.models.result import Result


def seed():
    # Crear tablas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Comprobar si ya hay datos
    if db.query(User).first():
        print("Ya existen datos en la BD. Seed cancelado.")
        db.close()
        return

    # --- Usuarios de prueba ---
    organizer = User(
        email="organizador@test.com",
        full_name="Carlos Organizador",
        hashed_password=hash_password("123456"),
        role="organizer",
        phone="600111222",
    )
    participant1 = User(
        email="participante@test.com",
        full_name="Ana Participante",
        hashed_password=hash_password("123456"),
        role="participant",
        phone="600333444",
    )
    participant2 = User(
        email="runner@test.com",
        full_name="Pedro Runner",
        hashed_password=hash_password("123456"),
        role="participant",
    )
    db.add_all([organizer, participant1, participant2])
    db.flush()

    # --- Eventos de ejemplo ---
    events_data = [
        {
            "title": "Carrera Popular San Silvestre 2026",
            "sport": "Running",
            "description": "Carrera popular de 10km por las calles de Santa Cruz de Tenerife. Recorrido llano apto para todos los niveles. Incluye avituallamiento y camiseta tecnica.",
            "date": datetime.now(timezone.utc) + timedelta(days=30),
            "location": "Santa Cruz de Tenerife",
            "max_capacity": 200,
            "price": 15.0,
            "status": "published",
            "ranking_criteria": "time",
        },
        {
            "title": "Torneo de Padel Primavera",
            "sport": "Padel",
            "description": "Torneo de padel por parejas en categoria amateur. Formato de eliminatorias con fase de grupos previa. Premios para los 3 primeros clasificados.",
            "date": datetime.now(timezone.utc) + timedelta(days=15),
            "location": "Club Deportivo La Laguna",
            "max_capacity": 32,
            "price": 25.0,
            "status": "published",
            "ranking_criteria": "score",
        },
        {
            "title": "Travesia a Nado Playa de Las Teresitas",
            "sport": "Natacion",
            "description": "Travesia en aguas abiertas de 1.5km en la playa de Las Teresitas. Obligatorio gorro de natacion. Salida desde la orilla norte.",
            "date": datetime.now(timezone.utc) + timedelta(days=45),
            "location": "Playa de Las Teresitas, Tenerife",
            "max_capacity": 100,
            "price": 10.0,
            "status": "published",
            "ranking_criteria": "time",
        },
        {
            "title": "Trail Anaga 2026",
            "sport": "Trail",
            "description": "Carrera de montana por el macizo de Anaga. 21km con 1200m de desnivel positivo. Solo para corredores experimentados.",
            "date": datetime.now(timezone.utc) + timedelta(days=60),
            "location": "Parque Rural de Anaga, Tenerife",
            "max_capacity": 150,
            "price": 30.0,
            "status": "published",
            "ranking_criteria": "time",
        },
        {
            "title": "Campeonato de Futbol 7 Verano",
            "sport": "Futbol",
            "description": "Liga de verano de futbol 7. Equipos de maximo 10 jugadores. Partidos los sabados por la mañana durante 8 semanas.",
            "date": datetime.now(timezone.utc) + timedelta(days=90),
            "location": "Polideportivo Municipal, La Orotava",
            "max_capacity": 80,
            "price": 0.0,
            "status": "published",
            "ranking_criteria": "score",
        },
        {
            "title": "Vuelta Ciclista al Teide (borrador)",
            "sport": "Ciclismo",
            "description": "Ruta ciclista de 120km con subida al Teide. Evento en preparacion.",
            "date": datetime.now(timezone.utc) + timedelta(days=120),
            "location": "Tenerife",
            "max_capacity": 300,
            "price": 40.0,
            "status": "draft",
            "ranking_criteria": "time",
        },
    ]

    for edata in events_data:
        event = Event(organizer_id=organizer.id, **edata)
        db.add(event)

    db.flush()

    # --- Inscripciones de ejemplo ---
    # Ana se inscribe en la carrera y en el padel
    insc1 = Inscription(user_id=participant1.id, event_id=1, status="confirmed", amount_paid=15.0)
    insc2 = Inscription(user_id=participant1.id, event_id=2, status="confirmed", amount_paid=25.0)
    # Pedro se inscribe en la carrera
    insc3 = Inscription(user_id=participant2.id, event_id=1, status="confirmed", amount_paid=15.0)

    db.add_all([insc1, insc2, insc3])

    db.commit()
    db.close()

    print("=" * 50)
    print("  SEED COMPLETADO")
    print("=" * 50)
    print()
    print("  Usuarios creados:")
    print("  organizador@test.com   / 123456  (organizer)")
    print("  participante@test.com  / 123456  (participant)")
    print("  runner@test.com        / 123456  (participant)")
    print()
    print("  6 eventos creados (5 publicados + 1 borrador)")
    print("  3 inscripciones de ejemplo")
    print()


if __name__ == "__main__":
    seed()
