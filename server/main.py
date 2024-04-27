from http.client import HTTPException
from typing import List
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World kiss123)"}

@app.post("/users/", response_model=schemas.Users)
def create_user(user: schemas.UsersCreate, db: Session = Depends(get_db)):
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


@app.put("/users/{user_id}", response_model=schemas.Users)
def update_user(user_id: int, user: schemas.UsersCreate, db: Session = Depends(get_db)):
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


@app.get("/fundraisings/", response_model=list[schemas.Fundraisings])
def read_fundraisings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_fundraisings(db, skip=skip, limit=limit)
    return items

@app.post("/fundraisings/", response_model=schemas.Fundraisings)
def create_fundraising(item: schemas.FundraisingsCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_fundraising(db=db, item=item, user_id=user_id)


@app.get("/fundraisings/", response_model=List[schemas.Fundraisings])
def read_fundraisings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_fundraisings(db, skip=skip, limit=limit)


@app.get("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def read_fundraising(fundraising_id: int, db: Session = Depends(get_db)):
    db_fundraising = crud.get_fundraising(db, fundraising_id=fundraising_id)
    if db_fundraising is None:
        raise HTTPException(status_code=404, detail="Fundraising not found")
    return db_fundraising


@app.put("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def update_fundraising(fundraising_id: int, item: schemas.FundraisingsCreate, db: Session = Depends(get_db)):
    db_fundraising = crud.get_fundraising(db, fundraising_id=fundraising_id)
    if db_fundraising is None:
        raise HTTPException(status_code=404, detail="Fundraising not found")
    return crud.update_fundraising(db=db, fundraising_id=fundraising_id, item=item)


@app.delete("/fundraisings/{fundraising_id}", response_model=schemas.Fundraisings)
def soft_remove_fundraising(fundraising_id: int, db: Session = Depends(get_db)):
    db_fundraising = crud.get_fundraising(db, fundraising_id=fundraising_id)
    if db_fundraising is None:
        raise HTTPException(status_code=404, detail="Fundraising not found")
    return crud.soft_remove_fundraising(db=db, fundraising_id=fundraising_id)

@app.post("/organizations/", response_model=schemas.Organizations)
def create_organization(item: schemas.OrganizationsCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_organization(db=db, item=item, user_id=user_id)


@app.get("/organizations/", response_model=List[schemas.Organizations])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_organizations(db, skip=skip, limit=limit)


@app.get("/organizations/{organization_id}", response_model=schemas.Organizations)
def read_organization(organization_id: int, db: Session = Depends(get_db)):
    db_organization = crud.get_organization(db, organization_id=organization_id)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization


@app.put("/organizations/{organization_id}", response_model=schemas.Organizations)
def update_organization(organization_id: int, item: schemas.OrganizationsCreate, db: Session = Depends(get_db)):
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
def create_subscription(item: schemas.SubscriptionsCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_subscription(db=db, item=item, user_id=user_id)


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


@app.delete("/subscriptions/{subscription_id}", response_model=schemas.Subscriptions)
def soft_remove_subscription(subscription_id: int, db: Session = Depends(get_db)):
    db_subscription = crud.get_subscription(db, subscription_id=subscription_id)
    if db_subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return crud.soft_remove_subscription(db=db, subscription_id=subscription_id)