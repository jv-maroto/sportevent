from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, events, inscriptions, results

# Crear tablas en la base de datos (en desarrollo; en produccion usar Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SportEvent API",
    description="Plataforma de gestion y venta de eventos deportivos",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir imagenes subidas
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Registrar routers
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(inscriptions.router)
app.include_router(results.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "SportEvent API", "version": "1.0.0"}
