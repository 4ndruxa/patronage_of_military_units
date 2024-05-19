from typing import List, Optional
from pydantic import BaseModel

class TokenRequest(BaseModel):
    code: str

class UsersBase(BaseModel):
    name: str
    email: str

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

class OrganizationInfo(BaseModel):
    id: int
    name: str

class FundraisingsBase(BaseModel):
    title: str
    description: Optional[str] = None
    creator_id: int

    class Config:
        orm_mode = True

class FundraisingsCreate(FundraisingsBase):
    organization_id: int
    sources: List[SourceCreate]

class FundraisingsUpdate(FundraisingsBase):
    organization_id: int
    sources: List[Source]

class Fundraisings(FundraisingsBase):
    id: int
    sources: List[Source]
    organization_id: int
    organizations: OrganizationInfo

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
    fundraising_id: int
    user_id: int

class SubscriptionsCreate(SubscriptionsBase):
    pass

class Subscriptions(SubscriptionsBase):
    id: int

    class Config:
        orm_mode = True