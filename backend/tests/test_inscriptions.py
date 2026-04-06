def create_published_event(client, organizer_token, **overrides):
    data = {
        "title": "Published Event",
        "sport": "running",
        "description": "Test",
        "date": "2027-06-01T10:00:00",
        "location": "Test City",
        "max_capacity": 10,
        "price": 0.0,
        "ranking_criteria": "time",
        **overrides,
    }
    event = client.post("/api/events/", json=data, headers={
        "Authorization": f"Bearer {organizer_token}",
    }).json()
    client.put(f"/api/events/{event['id']}", json={"status": "published"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    return event


def test_checkout_free_event(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, price=0.0)
    response = client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["checkout_url"] == "free"
    assert data["session_id"] == "free"


def test_checkout_duplicate(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, price=0.0)
    client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    response = client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 400
    assert "inscrito" in response.json()["detail"].lower()


def test_checkout_event_not_found(client, participant_token):
    response = client.post("/api/inscriptions/checkout/999", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 404


def test_checkout_full_event(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, max_capacity=1, price=0.0)
    # Inscribir primer usuario
    client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    # Segundo usuario
    resp = client.post("/api/auth/register", json={
        "email": "second@test.com",
        "full_name": "Second User",
        "password": "Test1234",
        "role": "participant",
    })
    second_token = resp.json()["access_token"]
    response = client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {second_token}",
    })
    assert response.status_code == 400
    assert "plazas" in response.json()["detail"].lower()


def test_my_inscriptions(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, price=0.0)
    client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    response = client.get("/api/inscriptions/my", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["event_id"] == event["id"]


def test_event_inscriptions_organizer(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, price=0.0)
    client.post(f"/api/inscriptions/checkout/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    response = client.get(f"/api/inscriptions/event/{event['id']}", headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_event_inscriptions_not_owner(client, organizer_token, participant_token):
    event = create_published_event(client, organizer_token, price=0.0)
    response = client.get(f"/api/inscriptions/event/{event['id']}", headers={
        "Authorization": f"Bearer {participant_token}",
    })
    assert response.status_code == 403
