from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime


# 1. Create the Join Table (Link Model)
class UserFavorite(SQLModel, table=True):
    user_id: Optional[int] = Field(
        default=None, foreign_key="user.id", primary_key=True)
    property_id: Optional[int] = Field(
        default=None, foreign_key="property.id", primary_key=True)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    financial_profile: Optional["FinancialProfile"] = Relationship(
        back_populates="user")

    # Updated: Added link_model
    favorites: List["Property"] = Relationship(
        back_populates="favorited_by",
        link_model=UserFavorite
    )


class FinancialProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    annual_income: float
    total_savings: float
    monthly_debt: float
    currency: str = Field(default="EUR")

    user: User = Relationship(back_populates="financial_profile")


class Property(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    price: float
    country: str
    location_city: str
    image_url: Optional[str] = None
    latitude: float
    longitude: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Added: Link back to User
    favorited_by: List[User] = Relationship(
        back_populates="favorites",
        link_model=UserFavorite
    )


class CountryRule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    country_code: str = Field(unique=True)  # IE or ES
    tax_rate: float  # e.g., 0.01 for IE, 0.10 for ES
    lending_multiplier: float  # e.g., 4.0 for IE
