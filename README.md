# SportEvent

Plataforma de gestion y venta de eventos deportivos.

Permite a organizadores crear y publicar eventos deportivos de cualquier disciplina (carreras, torneos de padel, competiciones de natacion, etc.), y a los participantes inscribirse, comprar su entrada y consultar clasificaciones y resultados.

## Tech Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend:** React 19, Tailwind CSS v4, React Router, Axios
- **Pagos:** Stripe (modo sandbox)
- **Infraestructura:** Docker, Docker Compose

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- (Opcional) Python 3.12+ y Node.js 20+ para desarrollo local sin Docker

## Inicio rapido con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/jv-maroto/SportEvent.git
cd SportEvent

# 2. Copiar variables de entorno
cp .env.example .env

# 3. (Opcional) Editar .env con tus claves de Stripe

# 4. Levantar todos los servicios
docker compose up --build

# 5. Acceder a la aplicacion
#    Frontend: http://localhost:5173
#    Backend API: http://localhost:8000
#    Swagger docs: http://localhost:8000/docs
```

## Desarrollo local (sin Docker)

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variable de entorno para BD local
export DATABASE_URL=postgresql://sportevent:sportevent_secret@localhost:5432/sportevent_db

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

## Estructura del proyecto

```
SportEvent/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuracion, BD, seguridad JWT
│   │   ├── models/        # Modelos SQLAlchemy (User, Event, Inscription, Result)
│   │   ├── schemas/       # Schemas Pydantic (validacion)
│   │   ├── routers/       # Endpoints API (auth, events, inscriptions, results)
│   │   ├── services/      # Logica de negocio
│   │   ├── uploads/       # Imagenes subidas
│   │   └── main.py        # Punto de entrada FastAPI
│   ├── alembic/           # Migraciones de BD
│   ├── tests/             # Tests con pytest
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, EventCard, ProtectedRoute
│   │   ├── pages/         # Home, Login, Register, Events, Dashboard
│   │   ├── services/      # Llamadas API (auth, events, inscriptions, results)
│   │   ├── context/       # AuthContext (estado global de autenticacion)
│   │   ├── App.jsx        # Rutas de la aplicacion
│   │   └── main.jsx       # Punto de entrada React
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Modulos principales

| Modulo | Descripcion |
|--------|-------------|
| **Autenticacion** | Registro e inicio de sesion con JWT. Roles: organizador y participante |
| **Eventos** | CRUD de eventos deportivos con imagen, aforo y filtros |
| **Inscripciones** | Inscripcion con pago via Stripe. Control de aforo en tiempo real |
| **Clasificaciones** | Introduccion de resultados y generacion automatica de rankings |
| **Panel organizador** | Dashboard privado con estadisticas, lista de inscritos y gestion |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesion |
| GET | `/api/auth/me` | Usuario actual |
| GET | `/api/events/` | Listar eventos publicados |
| GET | `/api/events/{id}` | Detalle de un evento |
| POST | `/api/events/` | Crear evento (organizador) |
| PUT | `/api/events/{id}` | Actualizar evento (organizador) |
| DELETE | `/api/events/{id}` | Eliminar evento (organizador) |
| POST | `/api/events/{id}/image` | Subir imagen (organizador) |
| POST | `/api/inscriptions/checkout/{id}` | Crear sesion de pago |
| POST | `/api/inscriptions/webhook` | Webhook de Stripe |
| GET | `/api/inscriptions/my` | Mis inscripciones |
| GET | `/api/inscriptions/event/{id}` | Inscritos de un evento (organizador) |
| POST | `/api/results/` | Crear resultado (organizador) |
| PUT | `/api/results/{id}` | Actualizar resultado (organizador) |
| GET | `/api/results/event/{id}` | Clasificacion publica |

## Autor

**Javier Jose Maroto Dominguez**
C.F.G.S. Desarrollo de Aplicaciones Web — C.I.F.P. Cesar Manrique
