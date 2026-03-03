from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- ENUMS ---


class AreaUnit(str, Enum):
    SQM = "sqm"
    SQFT = "sqft"


class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    VILLA = "villa"
    COMMERCIAL = "commercial"

# --- LINK TABLES ---


class UserFavorite(SQLModel, table=True):
    user_id: Optional[int] = Field(
        default=None, foreign_key="user.id", primary_key=True)
    property_id: Optional[int] = Field(
        default=None, foreign_key="property.id", primary_key=True)

# --- CORE MODELS ---


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    financial_profile: Optional["FinancialProfile"] = Relationship(
        back_populates="user")

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

    # New: Tracking IDs from external sources to prevent duplicates
    external_id: str = Field(unique=True, index=True)
    source: str = Field(index=True)  # "idealista" or "daft"

    title: str
    description: Optional[str] = None
    property_type: str = Field(default="apartment")

    # Financials
    price: float
    currency: str = Field(default="EUR")

    # Space
    area: Optional[float] = None
    area_unit: AreaUnit = Field(default=AreaUnit.SQM)
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None

    # Location
    country_code: str = Field(index=True)  # "IE", "ES"
    location_city: Optional[str] = None
    location_province: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Multimedia
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    tour_url: Optional[str] = None

    # Agency Info
    agency_name: Optional[str] = None

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    favorited_by: List["User"] = Relationship(
        back_populates="favorites", link_model=UserFavorite)


class CountryRule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    country_code: str = Field(unique=True)
    country_name: str
    currency_code: str = Field(default="EUR")
    currency_symbol: str = Field(default="€")
    lending_multiplier: float
    min_down_payment_pct: float = Field(default=0.10)
    tax_rate_pct: float
    additional_fees_fixed: float = Field(default=0.0)
