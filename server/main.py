from typing import Dict, List, Optional
from fastapi import Depends, FastAPI, HTTPException, Response, Cookie, Request
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine
from dotenv import load_dotenv
import os
import requests
import jwt
from starlette.middleware.base import BaseHTTPMiddleware

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

load_dotenv()

google_client_id = os.getenv('GOOGLE_CLIENT_ID')
google_secret = os.getenv('GOOGLE_SECRET')
google_certs_url = os.getenv('GOOGLE_CERTS_URL')
google_redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')

@app.post("/oauth/google/callback")
async def exchange_code_for_token(response: Response, token_request: Dict[str, str], db: Session = Depends(get_db)):
    code = token_request["code"]
    data = {
        "code": code,
        "client_id": google_client_id,
        "client_secret": google_secret,
        "redirect_uri": google_redirect_uri,
        "grant_type": "authorization_code"
    }
    token_response = requests.post("https://oauth2.googleapis.com/token", data=data)
    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google authorization code")

    access_token = token_response.json().get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Could not retrieve access token")

    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    if user_info_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Could not fetch user info")

    user_info = user_info_response.json()
    email = user_info["email"]
    name = user_info["name"]

    user = crud.get_user_by_email(db, email=email)
    if not user:
        user = crud.create_user(db, schemas.UsersBase(email=email, name=name))

    new_token = jwt.encode({"email": email}, "SECRET", algorithm="HS256")

    response.set_cookie("access_token", new_token, httponly=True, secure=True, max_age=3600)

    return {"message": "Authentication successful", "token": new_token}

@app.get("/me")
async def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, "SECRET", algorithms=["HS256"])
        request.state.user = payload
        user = crud.get_user_by_email(db, email=payload["email"])
        if user:
            return {"user": {"email": user.email, "name": user.name, "id": user.id}}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")

@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logout successful"}

@app.post("/users/", response_model=schemas.Users)
def create_user(user: schemas.UsersBase, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.Users])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/users/{user_id}", response_model=schemas.Users)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.patch("/users/{user_id}", response_model=schemas.Users)
def update_user(user_id: int, user: schemas.UsersUpdate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_id=user_id, user=user)

@app.delete("/users/{user_id}", response_model=schemas.Users)
def soft_remove_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.soft_remove_user(db=db, user_id=user_id)

@app.post("/fundraisings/", response_model=schemas.Fundraisings)
def create_fundraising(item: schemas.FundraisingsCreate, db: Session = Depends(get_db)):
    if not db.query(models.Users).filter(models.Users.id == item.creator_id).first():
        raise HTTPException(status_code=404, detail="Creator not found")

    if not db.query(models.Organizations).filter(models.Organizations.id == item.organization_id).first():
        raise HTTPException(status_code=404, detail="Organization not found")

    try:
        return crud.create_fundraising(db=db, item=item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/fundraisings/", response_model=List[schemas.Fundraisings])
def read_fundraisings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_fundraisings(db, skip=skip, limit=limit)

@app.get("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def read_fundraising(fundraising_id: int, db: Session = Depends(get_db)):
    db_fundraising = crud.get_fundraising(db, fundraising_id=fundraising_id)
    if db_fundraising is None:
        raise HTTPException(status_code=404, detail="Fundraising not found")
    return db_fundraising

@app.get("/fundraisings/by-creator/{creator_id}", response_model=List[schemas.Fundraisings])
def read_fundraisings_by_creator(creator_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_fundraisings_by_creator(db, creator_id=creator_id, skip=skip, limit=limit)

@app.get("/fundraisings/by-organization/{organization_id}", response_model=List[schemas.Fundraisings])
def read_fundraisings_by_organization(organization_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fundraisings = crud.get_fundraisings_by_organization(db, organization_id=organization_id, skip=skip, limit=limit)
    if not fundraisings:
        raise HTTPException(status_code=404, detail="No fundraisings found for this organization")
    return fundraisings

@app.patch("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def update_fundraising(fundraising_id: int, item: schemas.FundraisingsUpdate, db: Session = Depends(get_db)):
    return crud.update_fundraising(db=db, fundraising_id=fundraising_id, item=item)

@app.delete("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def soft_remove_fundraising(fundraising_id: int, db: Session = Depends(get_db)):
    fundraising = crud.soft_remove_fundraising(db=db, fundraising_id=fundraising_id)
    if not fundraising:
        raise HTTPException(status_code=404, detail="Fundraising not found")
    return fundraising

@app.post("/organizations/", response_model=schemas.Organizations)
def create_organization(item: schemas.OrganizationsCreate, db: Session = Depends(get_db)):
    return crud.create_organization(db=db, item=item)

@app.get("/organizations/", response_model=List[schemas.Organizations])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_organizations(db, skip=skip, limit=limit)

@app.get("/organizations/{organization_id}", response_model=schemas.Organizations)
def read_organization(organization_id: int, db: Session = Depends(get_db)):
    db_organization = crud.get_organization(db, organization_id=organization_id)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization

@app.patch("/organizations/{organization_id}", response_model=schemas.Organizations)
def update_organization(organization_id: int, item: schemas.OrganizationsUpdate, db: Session = Depends(get_db)):
    db_organization = crud.get_organization(db, organization_id=organization_id)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return crud.update_organization(db=db, organization_id=organization_id, item=item)

@app.delete("/organizations/{organization_id}", response_model=schemas.Organizations)
def soft_remove_organization(organization_id: int, db: Session = Depends(get_db)):
    db_organization = crud.get_organization(db, organization_id=organization_id)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return crud.soft_remove_organization(db=db, organization_id=organization_id)

@app.get("/organizations/by-creator/{creator_id}", response_model=List[schemas.Organizations])
def read_organizations_by_creator(creator_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    organizations = crud.get_organizations_by_creator(db, creator_id=creator_id, skip=skip, limit=limit)
    if not organizations:
        raise HTTPException(status_code=404, detail="No organizations found for this creator")
    return organizations

@app.post("/posts/", response_model=schemas.Posts)
def create_post(item: schemas.PostsCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_post(db=db, item=item, user_id=user_id)

@app.get("/posts/", response_model=List[schemas.Posts])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_posts(db, skip=skip, limit=limit)

@app.get("/posts/{post_id}", response_model=schemas.Posts)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@app.put("/posts/{post_id}", response_model=schemas.Posts)
def update_post(post_id: int, item: schemas.PostsCreate, db: Session = Depends(get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.update_post(db=db, post_id=post_id, item=item)

@app.delete("/posts/{post_id}", response_model=schemas.Posts)
def soft_remove_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.soft_remove_post(db=db, post_id=post_id)

@app.post("/media/", response_model=schemas.Media)
def create_media(item: schemas.MediaCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_media(db=db, item=item, user_id=user_id)

@app.get("/media/", response_model=List[schemas.Media])
def read_media(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_media(db, skip=skip, limit=limit)

@app.get("/media/{media_id}", response_model=schemas.Media)
def read_media(media_id: int, db: Session = Depends(get_db)):
    db_media = crud.get_media(db, media_id=media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return db_media

@app.put("/media/{media_id}", response_model=schemas.Media)
def update_media(media_id: int, item: schemas.MediaCreate, db: Session = Depends(get_db)):
    db_media = crud.get_media(db, media_id=media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return crud.update_media(db=db, media_id=media_id, item=item)

@app.delete("/media/{media_id}", response_model=schemas.Media)
def soft_remove_media(media_id: int, db: Session = Depends(get_db)):
    db_media = crud.get_media(db, media_id=media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return crud.soft_remove_media(db=db, media_id=media_id)

@app.post("/subscriptions/", response_model=schemas.Subscriptions)
def create_subscription(item: schemas.SubscriptionsCreate, db: Session = Depends(get_db)):
    return crud.create_subscription(db=db, item=item)

@app.get("/subscriptions/", response_model=List[schemas.Subscriptions])
def read_subscriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_subscriptions(db, skip=skip, limit=limit)

@app.get("/subscriptions/{subscription_id}", response_model=schemas.Subscriptions)
def read_subscription(subscription_id: int, db: Session = Depends(get_db)):
    db_subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if db_subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return db_subscription

@app.put("/subscriptions/{subscription_id}", response_model=schemas.Subscriptions)
def update_subscription(subscription_id: int, item: schemas.SubscriptionsCreate, db: Session = Depends(get_db)):
    db_subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if db_subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return crud.update_subscription(db=db, subscription_id=subscription_id, item=item)

@app.delete("/subscriptions/{user_id}/{fundraising_id}", response_model=schemas.Subscriptions)
def soft_remove_subscription(user_id: int, fundraising_id: int, db: Session = Depends(get_db)):

    subscription = crud.soft_remove_subscription(db=db, user_id=user_id, fundraising_id=fundraising_id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription

@app.get("/subscriptions/by-user/{user_id}", response_model=List[schemas.Fundraisings])
def get_subscriptions_by_user(user_id: int, db: Session = Depends(get_db)):
    return crud.get_subscriptions_by_user(db, user_id)

class InitStateMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.user = None
        response = await call_next(request)
        return response

app.add_middleware(InitStateMiddleware)

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        open_paths = [
            "/oauth/google/callback",
            "/me",
            "/users/",
            "/fundraisings",
            "/fundraisings/",
            "/fundraisings/by-creator/",
            "/fundraisings/by-organization/",
            "/organizations/",
            "/organizations/",
            "/organizations/by-creator/",
            "/posts",
            "/media",
            "/subscriptions",
            "/docs",
            "/favicon.ico",
            "/openapi.json"
        ]
        if any(request.url.path.startswith(path) for path in open_paths):
            if request.url.path == "/me":
                token = request.cookies.get("access_token")
                if not token:
                    return Response(status_code=403)
                
                try:
                    payload = jwt.decode(token, "SECRET", algorithms=["HS256"])
                    request.state.user = payload
                except jwt.ExpiredSignatureError:
                    return Response(status_code=403)
                except jwt.InvalidTokenError:
                    return Response(status_code=403)
            return await call_next(request)

        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(status_code=403, detail="Not authenticated")
        
        try:
            payload = jwt.decode(token, "SECRET", algorithms=["HS256"])
            request.state.user = payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=403, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=403, detail="Invalid token")
        
        response = await call_next(request)
        return response

app.add_middleware(AuthMiddleware)