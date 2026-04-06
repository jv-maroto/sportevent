---
description: Reglas para codigo Python/FastAPI en el backend
globs: backend/**/*.py
---

# Python / FastAPI

## Endpoints
- Siempre usar async/await en endpoints
- Type hints en parametros y retorno de todas las funciones
- Usar Depends() para inyeccion de dependencias (DB session, auth)
- HTTPException con codigos HTTP correctos (400, 401, 403, 404, 422)

## SQLAlchemy
- Estilo 2.0: usar select(), no query()
- Sesiones async con AsyncSession
- Relaciones lazy="selectin" para evitar N+1

## Pydantic
- Schemas en app/schemas/ separados de models
- Usar model_config = ConfigDict(from_attributes=True)
- Validacion con Field() y tipos estrictos

## Seguridad
- JWT verificado via Depends(get_current_user)
- Passwords hasheados con bcrypt (passlib)
- Variables sensibles via app/core/config.py (Settings con pydantic-settings)
- Nunca loggear passwords ni tokens
