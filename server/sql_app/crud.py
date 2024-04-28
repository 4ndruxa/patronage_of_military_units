from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.Users).filter(models.Users.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Users).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UsersCreate):
    db_user = models.Users(email=user.email, token=user.token, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UsersUpdate):
    db.query(models.Users).filter(models.Users.id == user_id).update(user.dict(exclude_unset=True))
    db.commit()
    return db.query(models.Users).filter(models.Users.id == user_id).first()

def get_fundraising(db: Session, fundraising_id: int):
    return db.query(models.Fundraisings).options(joinedload(models.Fundraisings.sources)).filter(models.Fundraisings.id == fundraising_id).first()

def get_all_fundraisings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Fundraisings).options(joinedload(models.Fundraisings.sources)).offset(skip).limit(limit).all()

def create_fundraising(db: Session, item: schemas.FundraisingsCreate):
    db_fundraising = models.Fundraisings(**item.dict(exclude={"sources"}))
    db.add(db_fundraising)
    db.commit()
    db.refresh(db_fundraising)

    for source_data in item.sources:
        db_source = models.Sources(**source_data.dict(), fundraising_id=db_fundraising.id, creator_id=db_fundraising.creator_id)
        db.add(db_source)
        db.commit()
        db.refresh(db_source)

    return db_fundraising

def update_fundraising(db: Session, fundraising_id: int, item: schemas.FundraisingsCreate):
    db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id).update(item.dict(exclude={"sources"}))
    db.commit()

    existing_sources = db.query(models.Sources).filter(models.Sources.fundraising_id == fundraising_id).all()
    existing_source_ids = {source.id for source in existing_sources}
    new_source_ids = {source.id for source in item.sources if source.id}

    for source_data in item.sources:
        if source_data.id in existing_source_ids:
            db.query(models.Sources).filter(models.Sources.id == source_data.id).update(source_data.dict())
        else:
            new_source = models.Sources(**source_data.dict(), fundraising_id=fundraising_id)
            db.add(new_source)

    sources_to_remove = existing_source_ids - new_source_ids
    if sources_to_remove:
        db.query(models.Sources).filter(models.Sources.id.in_(sources_to_remove)).delete(synchronize_session='fetch')

    db.commit()
    return db.query(models.Fundraisings).options(joinedload(models.Fundraisings.sources)).filter(models.Fundraisings.id == fundraising_id).first()

def soft_remove_fundraising(db: Session, fundraising_id: int):
    db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id).update({"deleted_at": func.now()})
    db.commit()

def get_organization(db: Session, organization_id: int):
    return db.query(models.Organizations).filter(models.Organizations.id == organization_id).first()

def get_all_organizations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Organizations).offset(skip).limit(limit).all()

def create_organization(db: Session, item: schemas.OrganizationsCreate):
    db_item = models.Organizations(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_organization(db: Session, organization_id: int, item: schemas.OrganizationsUpdate):
    db.query(models.Organizations).filter(models.Organizations.id == organization_id).update(item.dict(exclude_unset=True))
    db.commit()
    return db.query(models.Organizations).filter(models.Organizations.id == organization_id).first()

def soft_remove_organization(db: Session, organization_id: int):
    db.query(models.Organizations).filter(models.Organizations.id == organization_id).update({"deleted_at": func.now()})
    db.commit()

def get_post(db: Session, post_id: int):
    return db.query(models.Posts).filter(models.Posts.id == post_id).first()

def get_all_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Posts).offset(skip).limit(limit).all()

def create_post(db: Session, item: schemas.PostsCreate, user_id: int):
    db_item = models.Posts(**item.dict(), creator_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_post(db: Session, post_id: int, item: schemas.PostsCreate):
    db.query(models.Posts).filter(models.Posts.id == post_id).update(item.dict())
    db.commit()
    return db.query(models.Posts).filter(models.Posts.id == post_id).first()

def soft_remove_post(db: Session, post_id: int):
    db.query(models.Posts).filter(models.Posts.id == post_id).update({"deleted_at": func.now()})
    db.commit()

def get_media(db: Session, media_id: int):
    return db.query(models.Media).filter(models.Media.id == media_id).first()

def get_all_media(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Media).offset(skip).limit(limit).all()

def create_media(db: Session, item: schemas.MediaCreate, user_id: int):
    db_item = models.Media(**item.dict(), creator_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_media(db: Session, media_id: int, item: schemas.MediaCreate):
    db.query(models.Media).filter(models.Media.id == media_id).update(item.dict())
    db.commit()
    return db.query(models.Media).filter(models.Media.id == media_id).first()

def soft_remove_media(db: Session, media_id: int):
    db.query(models.Media).filter(models.Media.id == media_id).update({"deleted_at": func.now()})
    db.commit()


def get_subscription(db: Session, subscription_id: int):
    return db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id).first()

def get_all_subscriptions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Subscriptions).offset(skip).limit(limit).all()

def create_subscription(db: Session, item: schemas.SubscriptionsCreate, user_id: int):
    db_item = models.Subscriptions(**item.dict(), creator_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_subscription(db: Session, subscription_id: int, item: schemas.SubscriptionsCreate):
    db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id).update(item.dict())
    db.commit()
    return db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id).first()

def soft_remove_subscription(db: Session, subscription_id: int):
    db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id).update({"deleted_at": func.now()})
    db.commit()