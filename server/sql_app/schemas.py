from typing import List, Optional
from pydantic import BaseModel

class UsersBase(BaseModel):
    name: str
    email: str
    is_creator: bool = False
    is_verified: bool = False
    is_applied: bool = False
    is_denied: bool = False

class UsersCreate(UsersBase):
    token: str

class Users(UsersBase):
    id: int

    class Config:
        orm_mode = True

class UsersUpdate(BaseModel):
    name: Optional[str] = None

class OrganizationsBase(BaseModel):
    name: str
    description: Optional[str] = None
    creator_id: int

class OrganizationsCreate(OrganizationsBase):
    pass

class Organizations(OrganizationsBase):
    id: int
    creator_id: int

    class Config:
        orm_mode = True

class OrganizationsUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class SourceBase(BaseModel):
    title: str
    type: str
    url: str

class SourceCreate(SourceBase):
    pass

class Source(SourceBase):
    id: int

    class Config:
        orm_mode = True

class FundraisingsBase(BaseModel):
    title: str
    description: Optional[str] = None
    creator_id: int
    organization_id: int

class FundraisingsCreate(FundraisingsBase):
    sources: List[SourceCreate]

class Fundraisings(FundraisingsBase):
    id: int
    sources: List[Source]

    class Config:
        orm_mode = True

class PostsBase(BaseModel):
    title: str
    text: str

class PostsCreate(PostsBase):
    pass

class Posts(PostsBase):
    id: int
    creator_id: int

    class Config:
        orm_mode = True

class MediaBase(BaseModel):
    title: str
    text: str
    type: str

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: int
    post_id: int
    creator_id: int

    class Config:
        orm_mode = True

class SubscriptionsBase(BaseModel):
    creator_id: int
    organization_id: int

class SubscriptionsCreate(SubscriptionsBase):
    pass

class Subscriptions(SubscriptionsBase):
    id: int

    class Config:
        orm_mode = True