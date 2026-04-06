# SportEvent — Plataforma de Eventos Deportivos

## Overview
Proyecto final de DAW: plataforma de gestion de eventos deportivos con inscripciones, pagos con Stripe y rankings.

## Tech Stack
- **Backend:** FastAPI (Python 3.12) + SQLAlchemy + Alembic + PostgreSQL 16
- **Frontend:** React 18 + Vite + Tailwind CSS (dark theme custom) + Stripe.js
- **Auth:** JWT (HS256, 60min expiry) con roles (user/organizer/admin)
- **Infra:** Docker Compose (db + backend + frontend)

## Estructura del proyecto
```
backend/
  app/
    main.py          # FastAPI entry point
    core/             # config, database, security
    models/           # SQLAlchemy models (User, Event, Inscription, Result)
    routers/          # API endpoints (auth, events, inscriptions, results)
    schemas/          # Pydantic schemas
  alembic/            # Migraciones de BD
  tests/              # Tests backend
frontend/
  src/
    pages/            # Home, Login, Register, Dashboard, Events, Inscriptions
    components/       # Navbar, EventCard, ProtectedRoute
    context/          # AuthContext
    services/         # API calls (auth, events, inscriptions, results)
docker-compose.yml    # PostgreSQL + Backend + Frontend
```

## Comandos disponibles
```bash
# Frontend
cd frontend && npm run dev      # Dev server (puerto 5173)
cd frontend && npm run build    # Build produccion

# Backend
cd backend && python -m uvicorn app.main:app --reload --port 8000
cd backend && alembic upgrade head    # Ejecutar migraciones
cd backend && python seed.py          # Seed de datos

# Docker
docker-compose up -d            # Levantar todo
docker-compose down             # Parar todo
```

## Variables de entorno
Copiar `.env.example` a `.env`. Variables criticas:
- `DATABASE_URL` — Conexion PostgreSQL
- `SECRET_KEY` — Clave JWT (cambiar en produccion)
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — Claves de Stripe
- `VITE_API_URL` — URL del backend para el frontend

## Reglas criticas

### General
- Responder siempre en espanol
- No usar emojis en codigo ni comentarios
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Archivos max 400 lineas, funciones max 50 lineas
- No agregar features o refactors no solicitados
- No crear archivos innecesarios

### Backend (Python/FastAPI)
- Usar async/await en endpoints
- Type hints en todas las funciones
- Pydantic v2 para validacion (schemas/)
- SQLAlchemy 2.0 style (select() en vez de query())
- Manejar errores con HTTPException y codigos HTTP correctos
- Nunca hardcodear secrets — usar variables de entorno via `app/core/config.py`

### Frontend (React/Tailwind)
- Consultar `.claude/skills/frontend-design.md` antes de crear/modificar UI
- Componentes funcionales con hooks
- Design system: dark theme (dark-900), acento lime (lime-400), fuentes Syne + DM Sans
- Tailwind CSS para estilos — no CSS custom salvo excepciones justificadas
- Servicios API centralizados en `src/services/`

### Seguridad
- JWT validado en cada endpoint protegido
- CORS configurado solo para origenes permitidos
- Inputs validados con Pydantic (backend) y controlados (frontend)
- Nunca exponer stack traces en produccion
- Stripe webhooks verificados con firma

### Git
- Commits atomicos y descriptivos con conventional commits
- No hacer `--no-verify` ni `--force push`
- PRs con descripcion y test plan
