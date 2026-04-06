"""
Script para crear usuarios de prueba, eventos, inscripciones y resultados.
Ejecutar: python seed.py
"""
from datetime import datetime, timedelta, timezone

from app.core.database import engine, SessionLocal, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.event import Event
from app.models.inscription import Inscription
from app.models.result import Result


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).first():
        print("Ya existen datos en la BD. Seed cancelado.")
        db.close()
        return

    # ==================== USUARIOS ====================
    users = [
        User(email="organizador@test.com", full_name="Carlos Organizador", hashed_password=hash_password("Test1234"), role="organizer", phone="600111222"),
        User(email="ana@test.com", full_name="Ana Garcia", hashed_password=hash_password("Test1234"), role="participant", phone="600333444"),
        User(email="pedro@test.com", full_name="Pedro Lopez", hashed_password=hash_password("Test1234"), role="participant", phone="600555666"),
        User(email="maria@test.com", full_name="Maria Rodriguez", hashed_password=hash_password("Test1234"), role="participant"),
        User(email="luis@test.com", full_name="Luis Martinez", hashed_password=hash_password("Test1234"), role="participant"),
        User(email="elena@test.com", full_name="Elena Fernandez", hashed_password=hash_password("Test1234"), role="participant"),
        User(email="jorge@test.com", full_name="Jorge Sanchez", hashed_password=hash_password("Test1234"), role="participant"),
        User(email="laura@test.com", full_name="Laura Diaz", hashed_password=hash_password("Test1234"), role="organizer", phone="600777888"),
        User(email="test@test.com", full_name="Test Usuario", hashed_password=hash_password("Test1234"), role="participant", phone="600999000"),
    ]
    db.add_all(users)
    db.flush()
    # IDs: 1=Carlos(org), 2=Ana, 3=Pedro, 4=Maria, 5=Luis, 6=Elena, 7=Jorge, 8=Laura(org), 9=Test

    # ==================== EVENTOS ====================
    now = datetime.now(timezone.utc)
    events = [
        Event(  # ID 1
            organizer_id=1, title="Carrera Popular San Silvestre 2026", sport="Running",
            description="Carrera popular de 10km por las calles de Santa Cruz de Tenerife. Recorrido llano apto para todos los niveles. Incluye avituallamiento y camiseta tecnica. Salida desde la Plaza de Espana.",
            date=now + timedelta(days=30), location="Santa Cruz de Tenerife", max_capacity=200, price=15.0, status="published", ranking_criteria="time",
        ),
        Event(  # ID 2
            organizer_id=1, title="Torneo de Padel Primavera", sport="Padel",
            description="Torneo de padel por parejas en categoria amateur. Formato de eliminatorias con fase de grupos previa. Premios para los 3 primeros clasificados. Pistas cubiertas.",
            date=now + timedelta(days=15), location="Club Deportivo La Laguna", max_capacity=32, price=25.0, status="published", ranking_criteria="score",
        ),
        Event(  # ID 3
            organizer_id=1, title="Travesia a Nado Playa de Las Teresitas", sport="Natacion",
            description="Travesia en aguas abiertas de 1.5km en la playa de Las Teresitas. Obligatorio gorro de natacion. Salida desde la orilla norte. Servicio de socorrismo incluido.",
            date=now + timedelta(days=45), location="Playa de Las Teresitas, Tenerife", max_capacity=100, price=10.0, status="published", ranking_criteria="time",
        ),
        Event(  # ID 4
            organizer_id=1, title="Trail Anaga 2026", sport="Trail",
            description="Carrera de montana por el macizo de Anaga. 21km con 1200m de desnivel positivo. Solo para corredores experimentados. Puntos de avituallamiento cada 5km.",
            date=now + timedelta(days=60), location="Parque Rural de Anaga, Tenerife", max_capacity=150, price=30.0, status="published", ranking_criteria="time",
        ),
        Event(  # ID 5
            organizer_id=1, title="Campeonato de Futbol 7 Verano", sport="Futbol",
            description="Liga de verano de futbol 7. Equipos de maximo 10 jugadores. Partidos los sabados por la manana durante 8 semanas. Trofeo para el campeon.",
            date=now + timedelta(days=90), location="Polideportivo Municipal, La Orotava", max_capacity=80, price=0.0, status="published", ranking_criteria="score",
        ),
        Event(  # ID 6
            organizer_id=1, title="Vuelta Ciclista al Teide", sport="Ciclismo",
            description="Ruta ciclista de 120km con subida al Teide. Evento en preparacion. Desnivel acumulado de 2500m.",
            date=now + timedelta(days=120), location="Tenerife", max_capacity=300, price=40.0, status="draft", ranking_criteria="time",
        ),
        Event(  # ID 7 - evento de Laura (otro organizador)
            organizer_id=8, title="Maraton de La Laguna", sport="Running",
            description="Maraton completo de 42km por las calles de San Cristobal de La Laguna. Ciudad Patrimonio de la Humanidad. Recorrido con historia.",
            date=now + timedelta(days=75), location="San Cristobal de La Laguna", max_capacity=500, price=35.0, status="published", ranking_criteria="time",
        ),
        Event(  # ID 8 - evento finalizado con resultados
            organizer_id=1, title="Carrera Nocturna Santa Cruz", sport="Running",
            description="Carrera nocturna de 5km por el centro de Santa Cruz. Edicion 2025 ya finalizada. Consulta las clasificaciones.",
            date=now - timedelta(days=10), location="Santa Cruz de Tenerife", max_capacity=150, price=10.0, status="finished", ranking_criteria="time",
        ),
        Event(  # ID 9 - EN CURSO: torneo de padel con puntuacion
            organizer_id=1, title="Open de Padel Ciudad de Tenerife", sport="Padel",
            description="Torneo en curso. Fase de cuartos de final. Seguimiento en directo de las puntuaciones de cada pareja. Actualizacion tras cada partido.",
            date=now - timedelta(hours=3), location="Padel Indoor Tenerife", max_capacity=16, price=20.0, status="published", ranking_criteria="score",
        ),
        Event(  # ID 10 - EN CURSO: carrera con tiempos parciales
            organizer_id=1, title="10K Santa Cruz - EN DIRECTO", sport="Running",
            description="Carrera de 10km en curso. Los corredores ya han pasado el km 7. Tiempos parciales actualizados en cada punto de control.",
            date=now - timedelta(hours=1), location="Av. de Anaga, Santa Cruz", max_capacity=300, price=12.0, status="published", ranking_criteria="time",
        ),
    ]
    db.add_all(events)
    db.flush()

    # ==================== INSCRIPCIONES ====================
    inscriptions = [
        # Carrera San Silvestre (ID 1) - 5 inscritos
        Inscription(user_id=2, event_id=1, status="confirmed", amount_paid=15.0),
        Inscription(user_id=3, event_id=1, status="confirmed", amount_paid=15.0),
        Inscription(user_id=4, event_id=1, status="confirmed", amount_paid=15.0),
        Inscription(user_id=5, event_id=1, status="confirmed", amount_paid=15.0),
        Inscription(user_id=6, event_id=1, status="pending", amount_paid=15.0),

        # Torneo Padel (ID 2) - 4 inscritos
        Inscription(user_id=2, event_id=2, status="confirmed", amount_paid=25.0),
        Inscription(user_id=3, event_id=2, status="confirmed", amount_paid=25.0),
        Inscription(user_id=7, event_id=2, status="confirmed", amount_paid=25.0),
        Inscription(user_id=5, event_id=2, status="confirmed", amount_paid=25.0),

        # Travesia natacion (ID 3) - 3 inscritos
        Inscription(user_id=2, event_id=3, status="confirmed", amount_paid=10.0),
        Inscription(user_id=6, event_id=3, status="confirmed", amount_paid=10.0),
        Inscription(user_id=4, event_id=3, status="confirmed", amount_paid=10.0),

        # Trail Anaga (ID 4) - 2 inscritos
        Inscription(user_id=3, event_id=4, status="confirmed", amount_paid=30.0),
        Inscription(user_id=7, event_id=4, status="confirmed", amount_paid=30.0),

        # Futbol 7 (ID 5) - 3 inscritos (gratis)
        Inscription(user_id=2, event_id=5, status="confirmed", amount_paid=0.0),
        Inscription(user_id=5, event_id=5, status="confirmed", amount_paid=0.0),
        Inscription(user_id=7, event_id=5, status="confirmed", amount_paid=0.0),

        # Maraton La Laguna (ID 7 - Laura) - 4 inscritos
        Inscription(user_id=2, event_id=7, status="confirmed", amount_paid=35.0),
        Inscription(user_id=3, event_id=7, status="confirmed", amount_paid=35.0),
        Inscription(user_id=4, event_id=7, status="confirmed", amount_paid=35.0),
        Inscription(user_id=6, event_id=7, status="confirmed", amount_paid=35.0),

        # Carrera Nocturna FINALIZADA (ID 8) - 6 inscritos
        Inscription(user_id=2, event_id=8, status="confirmed", amount_paid=10.0),
        Inscription(user_id=3, event_id=8, status="confirmed", amount_paid=10.0),
        Inscription(user_id=4, event_id=8, status="confirmed", amount_paid=10.0),
        Inscription(user_id=5, event_id=8, status="confirmed", amount_paid=10.0),
        Inscription(user_id=6, event_id=8, status="confirmed", amount_paid=10.0),
        Inscription(user_id=7, event_id=8, status="confirmed", amount_paid=10.0),

        # Open Padel EN CURSO (ID 9) - 8 inscritos
        Inscription(user_id=2, event_id=9, status="confirmed", amount_paid=20.0),
        Inscription(user_id=3, event_id=9, status="confirmed", amount_paid=20.0),
        Inscription(user_id=4, event_id=9, status="confirmed", amount_paid=20.0),
        Inscription(user_id=5, event_id=9, status="confirmed", amount_paid=20.0),
        Inscription(user_id=6, event_id=9, status="confirmed", amount_paid=20.0),
        Inscription(user_id=7, event_id=9, status="confirmed", amount_paid=20.0),

        # 10K EN DIRECTO (ID 10) - 7 inscritos
        Inscription(user_id=2, event_id=10, status="confirmed", amount_paid=12.0),
        Inscription(user_id=3, event_id=10, status="confirmed", amount_paid=12.0),
        Inscription(user_id=4, event_id=10, status="confirmed", amount_paid=12.0),
        Inscription(user_id=5, event_id=10, status="confirmed", amount_paid=12.0),
        Inscription(user_id=6, event_id=10, status="confirmed", amount_paid=12.0),
        Inscription(user_id=7, event_id=10, status="confirmed", amount_paid=12.0),
    ]
    db.add_all(inscriptions)
    db.flush()

    # ==================== RESULTADOS ====================
    results = [
        # Carrera Nocturna FINALIZADA (ID 8) - resultados completos
        Result(user_id=3, event_id=8, time_seconds=1245.5, position=1, notes="Nuevo record del evento"),
        Result(user_id=5, event_id=8, time_seconds=1312.0, position=2),
        Result(user_id=2, event_id=8, time_seconds=1389.7, position=3),
        Result(user_id=7, event_id=8, time_seconds=1456.2, position=4),
        Result(user_id=4, event_id=8, time_seconds=1523.8, position=5),
        Result(user_id=6, event_id=8, time_seconds=1601.4, position=6),

        # Open Padel EN CURSO (ID 9) - puntuaciones parciales (score)
        Result(user_id=3, event_id=9, score=185, position=1, notes="3 partidos ganados, 0 perdidos"),
        Result(user_id=7, event_id=9, score=160, position=2, notes="2 ganados, 1 perdido"),
        Result(user_id=2, event_id=9, score=145, position=3, notes="2 ganados, 1 perdido"),
        Result(user_id=5, event_id=9, score=130, position=4, notes="1 ganado, 2 perdidos"),
        Result(user_id=6, event_id=9, score=110, position=5, notes="1 ganado, 2 perdidos"),
        Result(user_id=4, event_id=9, score=85, position=6, notes="0 ganados, 3 perdidos"),

        # 10K EN DIRECTO (ID 10) - tiempos parciales al km 7
        Result(user_id=5, event_id=10, time_seconds=1680.0, position=1, notes="Paso km 7 - ritmo 4:00/km"),
        Result(user_id=3, event_id=10, time_seconds=1722.0, position=2, notes="Paso km 7 - ritmo 4:06/km"),
        Result(user_id=7, event_id=10, time_seconds=1806.0, position=3, notes="Paso km 7 - ritmo 4:18/km"),
        Result(user_id=2, event_id=10, time_seconds=1890.0, position=4, notes="Paso km 7 - ritmo 4:30/km"),
        Result(user_id=4, event_id=10, time_seconds=2058.0, position=5, notes="Paso km 7 - ritmo 4:54/km"),
    ]
    db.add_all(results)

    db.commit()
    db.close()

    print("=" * 50)
    print("  SEED COMPLETADO")
    print("=" * 50)
    print()
    print("  USUARIOS:")
    print("  organizador@test.com  / Test1234  (organizer)")
    print("  ana@test.com          / Test1234  (participant)")
    print("  pedro@test.com        / Test1234  (participant)")
    print("  maria@test.com        / Test1234  (participant)")
    print("  luis@test.com         / Test1234  (participant)")
    print("  elena@test.com        / Test1234  (participant)")
    print("  jorge@test.com        / Test1234  (participant)")
    print("  laura@test.com        / Test1234  (organizer)")
    print("  test@test.com         / Test1234  (participant) [SIN INSCRIPCIONES]")
    print()
    print("  10 eventos (7 published + 1 draft + 1 finished + 1 en curso)")
    print("  39 inscripciones")
    print("  17 resultados (3 eventos con clasificacion)")
    print()


if __name__ == "__main__":
    seed()
