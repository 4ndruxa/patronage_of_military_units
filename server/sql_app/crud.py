from sqlalchemy import and_, func
from sqlalchemy.orm import Session, joinedload
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id, models.Users.deleted_at == None).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.Users).filter(models.Users.email == email, models.Users.deleted_at == None).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Users).filter(models.Users.deleted_at == None).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UsersBase):
    db_user = models.Users(email=user.email, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UsersUpdate):
    db.query(models.Users).filter(models.Users.id == user_id, models.Users.deleted_at == None).update(user.dict(exclude_unset=True))
    db.commit()
    return db.query(models.Users).filter(models.Users.id == user_id).first()

def get_fundraising(db: Session, fundraising_id: int):
    return (
        db.query(models.Fundraisings)
        .options(joinedload(models.Fundraisings.sources))
        .options(joinedload(models.Fundraisings.organizations))
        .filter(models.Fundraisings.id == fundraising_id, models.Fundraisings.deleted_at == None)
        .first()
    )

def get_all_fundraisings(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Fundraisings)
        .options(joinedload(models.Fundraisings.sources))
        .options(joinedload(models.Fundraisings.organizations))
        .filter(models.Fundraisings.deleted_at == None)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_fundraisings_by_creator(db: Session, creator_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Fundraisings)
        .options(joinedload(models.Fundraisings.sources))
        .options(joinedload(models.Fundraisings.organizations))
        .filter(models.Fundraisings.creator_id == creator_id, models.Fundraisings.deleted_at == None)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_fundraisings_by_organization(db: Session, organization_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Fundraisings)
        .options(joinedload(models.Fundraisings.sources))
        .options(joinedload(models.Fundraisings.organizations))
        .filter(models.Fundraisings.organization_id == organization_id, models.Fundraisings.deleted_at == None)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_fundraising(db: Session, item: schemas.FundraisingsCreate):
    db_fundraising = models.Fundraisings(
        title=item.title,
        description=item.description,
        creator_id=item.creator_id,
        organization_id=item.organization_id
    )
    db.add(db_fundraising)
    db.commit()
    db.refresh(db_fundraising)

    for source_data in item.sources:
        db_source = models.Sources(
            title=source_data.title,
            type=source_data.type,
            url=source_data.url,
            fundraising_id=db_fundraising.id,
            creator_id=db_fundraising.creator_id
        )
        db.add(db_source)
        db.commit()
        db.refresh(db_source)

    return db_fundraising

def update_fundraising(db: Session, fundraising_id: int, item: schemas.FundraisingsUpdate):
    db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id, models.Fundraisings.deleted_at == None).update(item.dict(exclude={"sources"}))
    db.commit()

    existing_sources = db.query(models.Sources).filter(models.Sources.fundraising_id == fundraising_id).all()
    existing_source_ids = {source.id for source in existing_sources}

    new_sources = [source for source in item.sources if not hasattr(source, 'id')]
    update_sources = [source for source in item.sources if hasattr(source, 'id')]

    for source_data in update_sources:
        if source_data.id in existing_source_ids:
            db.query(models.Sources).filter(models.Sources.id == source_data.id).update(source_data.dict())
    
    for source_data in new_sources:
        new_source = models.Sources(**source_data.dict(), fundraising_id=fundraising_id, creator_id=item.creator_id)
        db.add(new_source)

    new_source_ids = {source.id for source in update_sources}
    sources_to_remove = existing_source_ids - new_source_ids
    if sources_to_remove:
        db.query(models.Sources).filter(models.Sources.id.in_(sources_to_remove)).delete(synchronize_session='fetch')

    db.commit()

    return db.query(models.Fundraisings).options(joinedload(models.Fundraisings.sources)).filter(models.Fundraisings.id == fundraising_id).first()

def soft_remove_fundraising(db: Session, fundraising_id: int):
    db_fundraising = db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id).first()
    if not db_fundraising:
        return None
    db.query(models.Fundraisings).filter(models.Fundraisings.id == fundraising_id).update({"deleted_at": func.now()})
    db.commit()
    db.refresh(db_fundraising)
    return db_fundraising


def get_organization(db: Session, organization_id: int):
    return db.query(models.Organizations).filter(models.Organizations.id == organization_id, models.Organizations.deleted_at == None).first()

def get_all_organizations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Organizations).filter(models.Organizations.deleted_at == None).offset(skip).limit(limit).all()

def create_organization(db: Session, item: schemas.OrganizationsCreate):
    db_item = models.Organizations(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_organization(db: Session, organization_id: int, item: schemas.OrganizationsUpdate):
    db.query(models.Organizations).filter(models.Organizations.id == organization_id, models.Organizations.deleted_at == None).update(item.dict(exclude_unset=True))
    db.commit()
    return db.query(models.Organizations).filter(models.Organizations.id == organization_id).first()

def soft_remove_organization(db: Session, organization_id: int):
    db.query(models.Organizations).filter(models.Organizations.id == organization_id).update({"deleted_at": func.now()})
    db.commit()

def get_organizations_by_creator(db: Session, creator_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Organizations) \
        .filter(models.Organizations.creator_id == creator_id, models.Organizations.deleted_at == None) \
        .offset(skip) \
        .limit(limit) \
        .all()

def get_post(db: Session, post_id: int):
    return db.query(models.Posts).filter(models.Posts.id == post_id, models.Posts.deleted_at == None).first()

def get_all_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Posts).filter(models.Posts.deleted_at == None).offset(skip).limit(limit).all()

def create_post(db: Session, item: schemas.PostsCreate, user_id: int):
    db_item = models.Posts(**item.dict(), creator_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_post(db: Session, post_id: int, item: schemas.PostsCreate):
    db.query(models.Posts).filter(models.Posts.id == post_id, models.Posts.deleted_at == None).update(item.dict())
    db.commit()
    return db.query(models.Posts).filter(models.Posts.id == post_id).first()

def soft_remove_post(db: Session, post_id: int):
    db.query(models.Posts).filter(models.Posts.id == post_id).update({"deleted_at": func.now()})
    db.commit()

def get_media(db: Session, media_id: int):
    return db.query(models.Media).filter(models.Media.id == media_id, models.Media.deleted_at == None).first()

def get_all_media(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Media).filter(models.Media.deleted_at == None).offset(skip).limit(limit).all()

def create_media(db: Session, item: schemas.MediaCreate, user_id: int):
    db_item = models.Media(**item.dict(), creator_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_media(db: Session, media_id: int, item: schemas.MediaCreate):
    db.query(models.Media).filter(models.Media.id == media_id, models.Media.deleted_at == None).update(item.dict())
    db.commit()
    return db.query(models.Media).filter(models.Media.id == media_id).first()

def soft_remove_media(db: Session, media_id: int):
    db.query(models.Media).filter(models.Media.id == media_id).update({"deleted_at": func.now()})
    db.commit()

def get_subscription(db: Session, subscription_id: int):
    return db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id, models.Subscriptions.deleted_at == None).first()

def get_all_subscriptions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Subscriptions).filter(models.Subscriptions.deleted_at == None).offset(skip).limit(limit).all()

def create_subscription(db: Session, item: schemas.SubscriptionsCreate):
    db_item = models.Subscriptions(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_subscription(db: Session, subscription_id: int, item: schemas.SubscriptionsCreate):
    db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id, models.Subscriptions.deleted_at == None).update(item.dict())
    db.commit()
    return db.query(models.Subscriptions).filter(models.Subscriptions.id == subscription_id).first()

def soft_remove_subscription(db: Session, user_id: int, fundraising_id: int):
    db.query(models.Subscriptions).filter(
        and_(
            models.Subscriptions.fundraising_id == fundraising_id,
            models.Subscriptions.user_id == user_id
        )
    ).update({"deleted_at": func.now()})
    db.commit()

def get_subscriptions_by_user(db: Session, user_id: int):
    return db.query(models.Fundraisings).join(models.Subscriptions).filter(models.Subscriptions.user_id == user_id, models.Subscriptions.deleted_at == None).all()