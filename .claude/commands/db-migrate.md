Gestiona las migraciones de base de datos con Alembic:

1. Si el usuario quiere crear una migracion: `cd backend && alembic revision --autogenerate -m "descripcion"`
2. Si el usuario quiere aplicar migraciones: `cd backend && alembic upgrade head`
3. Si el usuario quiere ver el estado: `cd backend && alembic current`
4. Si el usuario quiere revertir: `cd backend && alembic downgrade -1`

Pregunta al usuario que operacion quiere realizar si no lo especifica.
