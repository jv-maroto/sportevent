def test_register_participant(client):
    response = client.post("/api/auth/register", json={
        "email": "new@test.com",
        "full_name": "New User",
        "password": "Test1234",
        "role": "participant",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["access_token"]
    assert data["user"]["email"] == "new@test.com"
    assert data["user"]["role"] == "participant"


def test_register_organizer(client):
    response = client.post("/api/auth/register", json={
        "email": "org2@test.com",
        "full_name": "New Org",
        "password": "Test1234",
        "role": "organizer",
    })
    assert response.status_code == 201
    assert response.json()["user"]["role"] == "organizer"


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "email": "dup@test.com",
        "full_name": "User 1",
        "password": "Test1234",
        "role": "participant",
    })
    response = client.post("/api/auth/register", json={
        "email": "dup@test.com",
        "full_name": "User 2",
        "password": "Test1234",
        "role": "participant",
    })
    assert response.status_code == 400
    assert "email" in response.json()["detail"].lower()


def test_register_invalid_password(client):
    response = client.post("/api/auth/register", json={
        "email": "weak@test.com",
        "full_name": "Weak Pass",
        "password": "short",
        "role": "participant",
    })
    assert response.status_code == 422


def test_login_success(client):
    client.post("/api/auth/register", json={
        "email": "login@test.com",
        "full_name": "Login User",
        "password": "Test1234",
        "role": "participant",
    })
    response = client.post("/api/auth/login", json={
        "email": "login@test.com",
        "password": "Test1234",
    })
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrong@test.com",
        "full_name": "Wrong Pass",
        "password": "Test1234",
        "role": "participant",
    })
    response = client.post("/api/auth/login", json={
        "email": "wrong@test.com",
        "password": "WrongPass1",
    })
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post("/api/auth/login", json={
        "email": "ghost@test.com",
        "password": "Test1234",
    })
    assert response.status_code == 401


def test_get_me(client, participant_token):
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 200
    assert response.json()["email"] == "user@test.com"


def test_get_me_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
