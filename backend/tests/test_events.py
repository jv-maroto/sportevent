import pytest


def create_event(client, token, **overrides):
    data = {
        "title": "Test Event",
        "sport": "running",
        "description": "Test description",
        "date": "2027-01-01T10:00:00",
        "location": "Test City",
        "max_capacity": 100,
        "price": 10.0,
        "ranking_criteria": "time",
        **overrides,
    }
    return client.post("/api/events/", json=data, headers={
        "Authorization": f"Bearer {token}",
    })


def test_create_event(client, organizer_token):
    response = create_event(client, organizer_token)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Event"
    assert data["status"] == "draft"


def test_create_event_as_participant(client, participant_token):
    response = create_event(client, participant_token)
    assert response.status_code == 403


def test_list_events_empty(client):
    response = client.get("/api/events/")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_list_events_with_published(client, organizer_token):
    # Crear y publicar evento
    event = create_event(client, organizer_token).json()
    client.put(f"/api/events/{event['id']}", json={"status": "published"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })

    response = client.get("/api/events/")
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Test Event"


def test_list_events_pagination(client, organizer_token):
    for i in range(5):
        event = create_event(client, organizer_token, title=f"Event {i}").json()
        client.put(f"/api/events/{event['id']}", json={"status": "published"}, headers={
            "Authorization": f"Bearer {organizer_token}",
        })

    response = client.get("/api/events/?page=1&page_size=2")
    data = response.json()
    assert data["total"] == 5
    assert data["pages"] == 3
    assert len(data["items"]) == 2


def test_list_events_filter_sport(client, organizer_token):
    event = create_event(client, organizer_token, sport="ciclismo").json()
    client.put(f"/api/events/{event['id']}", json={"status": "published"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })

    response = client.get("/api/events/?sport=ciclismo")
    assert response.json()["total"] == 1

    response = client.get("/api/events/?sport=natacion")
    assert response.json()["total"] == 0


def test_get_event_detail(client, organizer_token):
    event = create_event(client, organizer_token).json()
    response = client.get(f"/api/events/{event['id']}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Event"


def test_get_event_not_found(client):
    response = client.get("/api/events/999")
    assert response.status_code == 404


def test_update_event(client, organizer_token):
    event = create_event(client, organizer_token).json()
    response = client.put(f"/api/events/{event['id']}", json={"title": "Updated"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    assert response.status_code == 200
    assert response.json()["title"] == "Updated"


def test_status_transition_valid(client, organizer_token):
    event = create_event(client, organizer_token).json()
    # draft -> published
    response = client.put(f"/api/events/{event['id']}", json={"status": "published"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    assert response.status_code == 200
    assert response.json()["status"] == "published"


def test_status_transition_invalid(client, organizer_token):
    event = create_event(client, organizer_token).json()
    # draft -> finished (no valido)
    response = client.put(f"/api/events/{event['id']}", json={"status": "finished"}, headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    assert response.status_code == 400


def test_delete_event(client, organizer_token):
    event = create_event(client, organizer_token).json()
    response = client.delete(f"/api/events/{event['id']}", headers={
        "Authorization": f"Bearer {organizer_token}",
    })
    assert response.status_code == 204


def test_delete_event_not_owner(client, organizer_token, participant_token):
    event = create_event(client, organizer_token).json()
    # Registrar otro organizador
    resp = client.post("/api/auth/register", json={
        "email": "other@test.com",
        "full_name": "Other Org",
        "password": "Test1234",
        "role": "organizer",
    })
    other_token = resp.json()["access_token"]
    response = client.delete(f"/api/events/{event['id']}", headers={
        "Authorization": f"Bearer {other_token}",
    })
    assert response.status_code == 404
