import os

# The secret must be in the environment before server.main is imported:
# main.py reads JWT_SECRET once at import time (load_dotenv does not override it).
os.environ.setdefault("JWT_SECRET", "test-secret")

import logging
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.sql_app.database import Base
from server.sql_app import models, schemas, crud
from server import main as server_main
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

JWT_SECRET = os.environ["JWT_SECRET"]
ORIGIN = "http://localhost:3000"

def generate_token(email, secret=JWT_SECRET, expires_in=timedelta(hours=1), with_exp=True):
    payload = {"email": email}
    if with_exp:
        payload["exp"] = datetime.now(timezone.utc) + expires_in
    return jwt.encode(payload, secret, algorithm="HS256")

# Owner of the seeded data (id 1).
test_user_data_init = {"email": "testuserinit@example.com", "name": "Test User"}
# Second user (id 2) who owns organization 2 and fundraising 2.
other_user_data = {"email": "otheruser@example.com", "name": "Other User"}
# Not seeded; used to test POST /users/.
test_user_data = {"email": "testuser@example.com", "name": "Test User"}

test_org_data = {"name": "Test Organization", "description": "Test Description", "creator_id": 1}
other_org_data = {"name": "Other Organization", "description": "Other Description", "creator_id": 2}
test_fundraising_data = {
    "title": "Test Fundraising",
    "description": "Test Description",
    "creator_id": 1,
    "organization_id": 1,
    "sources": [{"title": "Source 1", "type": "mono", "url": "http://example.com"}]
}
other_fundraising_data = {
    "title": "Other Fundraising",
    "description": "Other Description",
    "creator_id": 2,
    "organization_id": 2,
    "sources": [{"title": "Source 2", "type": "mono", "url": "http://example.com"}]
}
test_subscription_data = {"fundraising_id": 1, "user_id": 1}

@pytest.fixture
def auth_token():
    """Token of the owner of the seeded data (user id 1)."""
    return generate_token(test_user_data_init["email"])

@pytest.fixture
def other_token():
    """Token of user id 2."""
    return generate_token(other_user_data["email"])

@pytest.fixture(autouse=True)
def clear_cookies():
    client.cookies.clear()
    yield
    client.cookies.clear()

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        crud.create_user(db, schemas.UsersBase(**test_user_data_init))
        crud.create_user(db, schemas.UsersBase(**other_user_data))
        crud.create_organization(db, schemas.OrganizationsCreate(**test_org_data))
        crud.create_organization(db, schemas.OrganizationsCreate(**other_org_data))
        crud.create_fundraising(db, schemas.FundraisingsCreate(**test_fundraising_data))
        crud.create_fundraising(db, schemas.FundraisingsCreate(**other_fundraising_data))
        crud.create_subscription(db, schemas.SubscriptionsCreate(fundraising_id=1, user_id=2))
        db.commit()
        yield db
    finally:
        db.rollback()  # Rollback тестових даних
        db.close()
        Base.metadata.drop_all(bind=engine)  # видалення db тестової

def fundraising_is_active(fundraising_id):
    db = TestingSessionLocal()
    try:
        row = db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id).first()
        return row is not None and row.deleted_at is None
    finally:
        db.close()

# --- existing behaviour (now as the owner) ---

def test_create_user(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/users/", json=test_user_data)
    assert response.status_code == 200
    assert response.json()["email"] == test_user_data["email"]

def test_get_user(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
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
    assert not fundraising_is_active(1)

def test_create_subscription(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/subscriptions/", json=test_subscription_data)
    assert response.status_code == 200
    assert response.json()["fundraising_id"] == test_subscription_data["fundraising_id"]

def test_get_subscriptions(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.get("/subscriptions/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert all(s["user_id"] == 1 for s in response.json())

def test_get_subscriptions_by_user(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.get("/subscriptions/by-user/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# --- B1: guest /me ---

def test_me_guest_is_403_with_cors_header(setup_database):
    response = client.get("/me", headers={"Origin": ORIGIN})
    assert response.status_code == 403
    assert response.headers.get("access-control-allow-origin") == ORIGIN

def test_me_returns_current_user(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.get("/me", headers={"Origin": ORIGIN})
    assert response.status_code == 200
    assert response.json()["user"]["id"] == 1
    assert response.headers.get("access-control-allow-origin") == ORIGIN

# --- guest mutations: 401, nothing changed ---

@pytest.mark.parametrize("method,path,body", [
    ("delete", "/fundraisings/1", None),
    ("patch", "/fundraisings/1", {**test_fundraising_data, "sources": []}),
    ("post", "/fundraisings/", test_fundraising_data),
    ("post", "/organizations/", test_org_data),
    ("patch", "/organizations/1", {"name": "x"}),
    ("delete", "/organizations/1", None),
    ("post", "/subscriptions/", test_subscription_data),
    ("put", "/subscriptions/1", test_subscription_data),
    ("delete", "/subscriptions/2/1", None),
    ("post", "/users/", test_user_data),
    ("patch", "/users/1", {"name": "x"}),
    ("delete", "/users/1", None),
    ("post", "/posts/?user_id=1", {"title": "t", "text": "t"}),
    ("put", "/posts/1", {"title": "t", "text": "t"}),
    ("delete", "/posts/1", None),
    ("post", "/media/?user_id=1", {"title": "t", "text": "t", "type": "img"}),
    ("put", "/media/1", {"title": "t", "text": "t", "type": "img"}),
    ("delete", "/media/1", None),
])
def test_guest_mutation_is_401(setup_database, method, path, body):
    kwargs = {"json": body} if body is not None else {}
    response = client.request(method.upper(), path, headers={"Origin": ORIGIN}, **kwargs)
    assert response.status_code == 401
    assert "detail" in response.json()
    assert response.headers.get("access-control-allow-origin") == ORIGIN

def test_guest_delete_leaves_row_untouched(setup_database):
    response = client.delete("/fundraisings/1")
    assert response.status_code == 401
    assert fundraising_is_active(1)

# --- bad tokens: 401 ---

@pytest.mark.parametrize("token_kwargs", [
    {"secret": "wrong-secret"},
    {"with_exp": False},
    {"expires_in": timedelta(seconds=-10)},
])
def test_bad_token_mutation_is_401(setup_database, token_kwargs):
    client.cookies.set("access_token", generate_token(test_user_data_init["email"], **token_kwargs))
    response = client.delete("/fundraisings/1")
    assert response.status_code == 401
    assert fundraising_is_active(1)

def test_garbage_token_is_401(setup_database):
    client.cookies.set("access_token", "not-a-jwt")
    response = client.delete("/fundraisings/1")
    assert response.status_code == 401

def test_issued_token_has_exp():
    payload = server_main.decode_token(server_main.encode_token("a@example.com"))
    assert payload["email"] == "a@example.com"
    lifetime = payload["exp"] - datetime.now(timezone.utc).timestamp()
    assert timedelta(hours=23).total_seconds() < lifetime <= timedelta(hours=24).total_seconds()

# --- someone else's resource: 403 ---

def test_patch_foreign_fundraising_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.patch("/fundraisings/2", json={**other_fundraising_data, "sources": []})
    assert response.status_code == 403

def test_delete_foreign_fundraising_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.delete("/fundraisings/2")
    assert response.status_code == 403
    assert fundraising_is_active(2)

def test_patch_foreign_organization_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.patch("/organizations/2", json={"name": "Hijacked"})
    assert response.status_code == 403

def test_delete_foreign_organization_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.delete("/organizations/2")
    assert response.status_code == 403

def test_owner_patches_and_deletes_own_organization(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.patch("/organizations/1", json={"name": "Renamed"})
    assert response.status_code == 200
    assert response.json()["name"] == "Renamed"
    # Owner DELETE of an organization is not asserted here: crud.soft_remove_organization
    # returns None, so the route 500s for the owner (pre-existing, out of scope).

def test_patch_foreign_user_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    assert client.patch("/users/2", json={"name": "x"}).status_code == 403
    assert client.delete("/users/2").status_code == 403

def test_owner_patches_self(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.patch("/users/1", json={"name": "New Name"})
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"

def test_unsubscribe_foreign_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.delete("/subscriptions/2/1")
    assert response.status_code == 403

def test_unsubscribe_own(other_token, setup_database):
    client.cookies.set("access_token", other_token)
    response = client.delete("/subscriptions/2/1")
    # Status is B5's concern (the route currently answers 404 even on success);
    # here we only check the owner is allowed through and the row is soft-deleted.
    assert response.status_code not in (401, 403)
    db = TestingSessionLocal()
    try:
        row = db.query(models.Subscriptions).filter(models.Subscriptions.id == 1).first()
        assert row.deleted_at is not None
    finally:
        db.close()

def test_put_foreign_subscription_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.put("/subscriptions/1", json=test_subscription_data)
    assert response.status_code == 403

def test_posts_and_media_ownership(auth_token, other_token, setup_database):
    client.cookies.set("access_token", auth_token)
    assert client.post("/posts/?user_id=2", json={"title": "t", "text": "t"}).status_code == 403
    response = client.post("/posts/?user_id=1", json={"title": "t", "text": "t"})
    assert response.status_code == 200
    post_id = response.json()["id"]
    assert client.post("/media/?user_id=2", json={"title": "t", "text": "t", "type": "img"}).status_code == 403
    # POST /media/ by the owner cannot be asserted (pre-existing: response model needs
    # a post_id the endpoint never sets), so seed a media row of user 1 directly.
    db = TestingSessionLocal()
    try:
        media = models.Media(title="t", text="t", type="img", post_id=post_id, creator_id=1)
        db.add(media)
        db.commit()
        media_id = media.id
    finally:
        db.close()

    client.cookies.set("access_token", other_token)
    assert client.put(f"/posts/{post_id}", json={"title": "x", "text": "x"}).status_code == 403
    assert client.delete(f"/posts/{post_id}").status_code == 403
    assert client.put(f"/media/{media_id}", json={"title": "x", "text": "x", "type": "img"}).status_code == 403
    assert client.delete(f"/media/{media_id}").status_code == 403

# --- identity spoofing in the body: 403 ---

def test_create_fundraising_as_someone_else_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/fundraisings/", json={**test_fundraising_data, "creator_id": 2})
    assert response.status_code == 403

def test_patch_own_fundraising_to_other_creator_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.patch("/fundraisings/1", json={**test_fundraising_data, "creator_id": 2, "sources": []})
    assert response.status_code == 403

def test_create_organization_as_someone_else_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/organizations/", json={**test_org_data, "creator_id": 2})
    assert response.status_code == 403

def test_subscribe_someone_else_is_403(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.post("/subscriptions/", json={"fundraising_id": 2, "user_id": 2})
    assert response.status_code == 403

# --- private reads ---

@pytest.mark.parametrize("path", ["/users/", "/users/2", "/subscriptions/", "/subscriptions/1", "/subscriptions/by-user/2"])
def test_private_reads_guest_is_401(setup_database, path):
    response = client.get(path)
    assert response.status_code == 401

@pytest.mark.parametrize("path", ["/users/2", "/subscriptions/1", "/subscriptions/by-user/2"])
def test_private_reads_not_owner_is_403(auth_token, setup_database, path):
    client.cookies.set("access_token", auth_token)
    response = client.get(path)
    assert response.status_code == 403

def test_users_list_shows_only_self(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    response = client.get("/users/")
    assert response.status_code == 200
    assert [u["email"] for u in response.json()] == [test_user_data_init["email"]]

def test_own_subscription_read(other_token, setup_database):
    client.cookies.set("access_token", other_token)
    assert client.get("/subscriptions/1").status_code == 200
    response = client.get("/subscriptions/by-user/2")
    assert response.status_code == 200
    assert [f["id"] for f in response.json()] == [1]

# --- open unsafe paths ---

def test_logout_without_cookie_is_200(setup_database):
    response = client.post("/logout")
    assert response.status_code == 200

class _FakeResponse:
    def __init__(self, status_code, data):
        self.status_code = status_code
        self._data = data

    def json(self):
        return self._data

def test_oauth_callback_without_cookie_reaches_handler(monkeypatch, setup_database):
    monkeypatch.setattr(server_main.requests, "post",
                        lambda *a, **kw: _FakeResponse(200, {"access_token": "google-token"}))
    monkeypatch.setattr(server_main.requests, "get",
                        lambda *a, **kw: _FakeResponse(200, {"email": test_user_data_init["email"], "name": "Test User"}))
    response = client.post("/oauth/google/callback", json={"code": "abc"})
    assert response.status_code == 200
    assert "access_token" in response.cookies
    payload = server_main.decode_token(response.json()["token"])
    assert payload["email"] == test_user_data_init["email"]

def test_valid_token_for_unknown_user_is_401(setup_database):
    client.cookies.set("access_token", generate_token("ghost@example.com"))
    response = client.get("/subscriptions/by-user/1")
    assert response.status_code == 401

def test_delete_already_deleted_fundraising_is_404(auth_token, setup_database):
    client.cookies.set("access_token", auth_token)
    assert client.delete("/fundraisings/1").status_code == 200
    assert client.delete("/fundraisings/1").status_code == 404

# --- secret configuration ---

def test_missing_jwt_secret_falls_back_with_warning(monkeypatch, caplog):
    monkeypatch.delenv("JWT_SECRET", raising=False)
    with caplog.at_level(logging.WARNING):
        secret = server_main.load_jwt_secret()
    assert secret
    assert any(r.levelno == logging.WARNING and "JWT_SECRET" in r.getMessage() for r in caplog.records)

def test_jwt_secret_from_env(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "from-env")
    assert server_main.load_jwt_secret() == "from-env"
