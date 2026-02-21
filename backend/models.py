from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from enum import Enum


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

# 1. Define Standard Units


class AreaUnit(str, Enum):
    SQM = "sqm"
    SQFT = "sqft"


class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    VILLA = "villa"
    COMMERCIAL = "commercial"


class Property(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    property_type: PropertyType = Field(default=PropertyType.APARTMENT)

    # Financials
    price: float
    currency: str = Field(default="EUR")  # ISO Codes: EUR, AED, USD, GBP

    # Space & Units
    area: Optional[float] = None
    area_unit: AreaUnit = Field(default=AreaUnit.SQM)

    # Location
    country_code: str = Field(index=True)  # "IE", "ES", "AE"
    location_city: str
    latitude: float
    longitude: float

    # Metadata
    source_url: Optional[str] = None  # Link to the original listing
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    favorited_by: List["User"] = Relationship(
        back_populates="favorites", link_model=UserFavorite)


class CountryRule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    country_code: str = Field(unique=True)  # IE, ES, AE, UK
    country_name: str

    # Currency info for the UI
    currency_code: str = Field(default="EUR")
    currency_symbol: str = Field(default="€")

    # Lending Logic
    lending_multiplier: float  # e.g. 4.0 for Ireland
    min_down_payment_pct: float = Field(default=0.10)  # 10%, 20% etc.

    # Tax Logic
    tax_rate_pct: float  # Stamp duty or Transfer tax
    additional_fees_fixed: float = Field(
        default=0.0)  # Fixed legal/notary fees
