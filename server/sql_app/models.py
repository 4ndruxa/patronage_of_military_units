from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, func, DateTime
from sqlalchemy.orm import relationship

from .database import Base

class BaseMixin:
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())
    deletedAt = Column(DateTime, nullable=True)

    createdBy = Column(Integer, ForeignKey("users.id"))
    updatedBy = Column(Integer, ForeignKey("users.id"))

class Users(Base, BaseMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    isCreator = Column(Boolean, default=False)
    isVerified = Column(Boolean, default=False)
    isApplied = Column(Boolean, default=False)
    isDenied = Column(Boolean, default=False)

    fundraisings = relationship("Fundraisings", back_populates="creator", foreign_keys="Fundraisings.creatorId")
    organizations = relationship("Organizations", back_populates="creator", foreign_keys="Organizations.creatorId")
    sources = relationship("Sources", back_populates="creator", foreign_keys="Sources.creatorId")
    posts = relationship("Posts", back_populates="creator", foreign_keys="Posts.creatorId")
    media = relationship("Media", back_populates="creator", foreign_keys="Media.creatorId")
    subscriptions = relationship("Subscriptions", back_populates="creator", foreign_keys="Subscriptions.creatorId")


class Organizations(Base, BaseMixin):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    description = Column(String)
    creatorId = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="organizations", foreign_keys="Organizations.creatorId")
    fundraisings = relationship("Fundraisings", back_populates="organizations", foreign_keys="Fundraisings.organizationId")
    subscriptions = relationship("Subscriptions", back_populates="organizations")


class Fundraisings(Base, BaseMixin):
    __tablename__ = "fundraisings"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String)
    creatorId = Column(Integer, ForeignKey("users.id"))
    organizationId = Column(Integer, ForeignKey("organizations.id"))
    sourceId = Column(Integer, ForeignKey("sources.id"))

    creator = relationship("Users", back_populates="fundraisings", foreign_keys="Fundraisings.creatorId")
    sources = relationship("Sources", back_populates="fundraisings", foreign_keys="Fundraisings.sourceId")
    organizations = relationship("Organizations", back_populates="fundraisings", foreign_keys="Fundraisings.organizationId")


class Sources(Base, BaseMixin):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    type = Column(String, index=True)
    url = Column(String)
    creatorId = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="sources", foreign_keys="Sources.creatorId")
    fundraisings = relationship("Fundraisings", back_populates="sources")


class Posts(Base, BaseMixin):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    text = Column(String)
    creatorId = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="posts", foreign_keys="Posts.creatorId")
    media = relationship("Media", back_populates="posts")


class Media(Base, BaseMixin):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    text = Column(String)
    type = Column(String)
    postId = Column(Integer, ForeignKey("posts.id"))
    creatorId = Column(Integer, ForeignKey("users.id"))

    creator = relationship("Users", back_populates="media", foreign_keys="Media.creatorId")
    posts = relationship("Posts", back_populates="media")


class Subscriptions(Base, BaseMixin):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    creatorId = Column(Integer, ForeignKey("users.id"))
    organizationId = Column(Integer, ForeignKey("organizations.id"))

    creator = relationship("Users", back_populates="subscriptions", foreign_keys="Subscriptions.creatorId")
    organizations = relationship("Organizations", back_populates="subscriptions")