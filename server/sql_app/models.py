from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, func, DateTime
from sqlalchemy.orm import relationship

from .database import Base

class BaseMixin:
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"))
    updated_by = Column(Integer, ForeignKey("users.id"))

class Users(Base, BaseMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    token = Column(String)
    is_creator = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    is_applied = Column(Boolean, default=False)
    is_denied = Column(Boolean, default=False)

    fundraisings = relationship("Fundraisings", back_populates="creator", foreign_keys="Fundraisings.creator_id")
    organizations = relationship("Organizations", back_populates="creator", foreign_keys="Organizations.creator_id")
    sources = relationship("Sources", back_populates="creator", foreign_keys="Sources.creator_id")
    posts = relationship("Posts", back_populates="creator", foreign_keys="Posts.creator_id")
    media = relationship("Media", back_populates="creator", foreign_keys="Media.creator_id")
    subscriptions = relationship("Subscriptions", back_populates="creator", foreign_keys="Subscriptions.creator_id")


class Organizations(Base, BaseMixin):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    description = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="organizations", foreign_keys="Organizations.creator_id")
    fundraisings = relationship("Fundraisings", back_populates="organizations", foreign_keys="Fundraisings.organization_id")
    subscriptions = relationship("Subscriptions", back_populates="organizations")


class Fundraisings(Base, BaseMixin):
    __tablename__ = "fundraisings"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    source_id = Column(Integer, ForeignKey("sources.id"))

    creator = relationship("Users", back_populates="fundraisings", foreign_keys="Fundraisings.creator_id")
    sources = relationship("Sources", back_populates="fundraisings", foreign_keys="Fundraisings.source_id")
    organizations = relationship("Organizations", back_populates="fundraisings", foreign_keys="Fundraisings.organization_id")


class Sources(Base, BaseMixin):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    type = Column(String, index=True)
    url = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="sources", foreign_keys="Sources.creator_id")
    fundraisings = relationship("Fundraisings", back_populates="sources")


class Posts(Base, BaseMixin):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    text = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="posts", foreign_keys="Posts.creator_id")
    media = relationship("Media", back_populates="posts")


class Media(Base, BaseMixin):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    text = Column(String)
    type = Column(String)
    post_id = Column(Integer, ForeignKey("posts.id"))
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="media", foreign_keys="Media.creator_id")
    posts = relationship("Posts", back_populates="media")


class Subscriptions(Base, BaseMixin):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))

    creator = relationship("Users", back_populates="subscriptions", foreign_keys="Subscriptions.creator_id")
    organizations = relationship("Organizations", back_populates="subscriptions")