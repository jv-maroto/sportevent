import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Configurar variables de entorno antes de importar la app
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

from app.core.database import Base, get_db
from app.main import app

# Usar la DATABASE_URL del entorno (PostgreSQL en CI, SQLite local)
TEST_DB_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")
connect_args = {"check_same_thread": False} if TEST_DB_URL.startswith("sqlite") else {}
engine = create_engine(TEST_DB_URL, connect_args=connect_args)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if TEST_DB_URL.startswith("sqlite") and os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def organizer_token(client):
    response = client.post("/api/auth/register", json={
        "email": "org@test.com",
        "full_name": "Test Organizer",
        "password": "Test1234",
        "role": "organizer",
    })
    return response.json()["access_token"]


@pytest.fixture
def participant_token(client):
    response = client.post("/api/auth/register", json={
        "email": "user@test.com",
        "full_name": "Test User",
        "password": "Test1234",
        "role": "participant",
    })
    return response.json()["access_token"]
