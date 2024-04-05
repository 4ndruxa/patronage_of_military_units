from pydantic import BaseModel


class FundraiseBase(BaseModel):
    title: str
    description: str | None = None


class ItemCreate(FundraiseBase):
    pass


class Item(FundraiseBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_owner: bool
    items: list[Item] = []

    class Config:
        orm_mode = True