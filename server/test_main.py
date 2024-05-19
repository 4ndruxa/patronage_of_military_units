import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.sql_app.database import Base
from server.sql_app import models, schemas, crud
from server.main import app, get_db
import jwt

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

os.environ["GOOGLE_CLIENT_ID"] = "test_google_client_id"
os.environ["GOOGLE_SECRET"] = "test_google_secret"
os.environ["GOOGLE_CERTS_URL"] = "https://www.googleapis.com/oauth2/v1/certs"
os.environ["GOOGLE_REDIRECT_URI"] = "http://localhost:8000/oauth/google/callback"

def generate_token(email):
    return jwt.encode({"email": email}, "SECRET", algorithm="HS256")

test_user_data_init = {"email": "testuserinit@example.com", "name": "Test User"}
test_user_data = {"email": "testuser@example.com", "name": "Test User"}
test_org_data = {"name": "Test Organization", "description": "Test Description", "creator_id": 1}
test_fundraising_data = {
    "title": "Test Fundraising",
    "description": "Test Description",
    "creator_id": 1,
    "organization_id": 1,
    "sources": [{"title": "Source 1", "type": "mono", "url": "http://example.com"}]
}
test_subscription_data = {"fundraising_id": 1, "user_id": 1}

@pytest.fixture
def auth_token():
    token = generate_token(test_user_data["email"])
    return token

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        user = crud.create_user(db, schemas.UsersBase(**test_user_data_init))
        org = crud.create_organization(db, schemas.OrganizationsCreate(**test_org_data))
        fundraising = crud.create_fundraising(db, schemas.FundraisingsCreate(**test_fundraising_data))
        db.commit()
        yield db
    finally:
        db.rollback()  # Rollback тестових даних
        db.close()
        Base.metadata.drop_all(bind=engine)  # видалення db тестової

def test_create_user(setup_database):
    response = client.post("/users/", json=test_user_data)
    assert response.status_code == 200
    assert response.json()["email"] == test_user_data["email"]

def test_get_user(setup_database):
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json()["email"] == test_user_data_init["email"]

def test_create_fundraising(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/fundraisings/", json=test_fundraising_data)
    assert response.status_code == 200
    assert response.json()["title"] == test_fundraising_data["title"]

def test_get_fundraisings(setup_database):
    response = client.get("/fundraisings/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_fundraising(setup_database):
    response = client.get("/fundraisings/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_update_fundraising(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    update_data = {
        "title": "Updated Title",
        "description": "Updated Description",
        "creator_id": 1,
        "organization_id": 1,
        "sources": [{"id": 1, "title": "Updated Source", "type": "mono", "url": "http://example.com"}]
    }
    response = client.patch("/fundraisings/1", json=update_data)
    assert response.status_code == 200
    assert response.json()["title"] == update_data["title"]

def test_delete_fundraising(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.delete("/fundraisings/1")
    assert response.status_code == 200

def test_create_subscription(auth_token, setup_database):
    response = client.post("/subscriptions/", json=test_subscription_data)
    assert response.status_code == 200
    assert response.json()["fundraising_id"] == test_subscription_data["fundraising_id"]

def test_get_subscriptions(setup_database):
    response = client.get("/subscriptions/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_subscriptions_by_user(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.get(f"/subscriptions/by-user/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
