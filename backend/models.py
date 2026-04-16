from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from enum import Enum
from pydantic import validator

# --- 1. ENUMS ---


class AreaUnit(str, Enum):
    SQM = "sqm"
    SQFT = "sqft"


class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    VILLA = "villa"
    COMMERCIAL = "commercial"

# --- 2. LINK TABLES (Must be defined before the models that use them) ---


class UserFavorite(SQLModel, table=True):
    user_id: Optional[int] = Field(
        default=None, foreign_key="user.id", primary_key=True
    )
    property_id: Optional[int] = Field(
        default=None, foreign_key="property.id", primary_key=True
    )

# --- 3. PROPERTY MODEL ---


class Property(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: str = Field(unique=True, index=True)
    source: str = Field(index=True)  # "idealista" or "daft"
    title: str
    description: Optional[str] = None
    property_type: str = Field(default="apartment")
    price: float
    currency: str = Field(default="EUR")
    area: Optional[float] = None
    area_unit: AreaUnit = Field(default=AreaUnit.SQM)
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None
    country_code: str = Field(index=True)  # "IE", "ES"
    location_city: Optional[str] = None
    location_province: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    tour_url: Optional[str] = None
    agency_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Use a string "User" here because User is defined later in the file
    favorited_by: List["User"] = Relationship(
        back_populates="favorites",
        link_model=UserFavorite
    )

# --- 4. USER MODEL ---


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)

    financial_profile: Optional["FinancialProfile"] = Relationship(
        back_populates="user")

    # We can now use Property and UserFavorite directly (no quotes)
    favorites: List[Property] = Relationship(
        back_populates="favorited_by",
        link_model=UserFavorite
    )

    @validator("email")
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v

# --- 5. SUPPORTING MODELS ---


class FinancialProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    annual_income: float
    total_savings: float
    monthly_debt: float
    currency: str = Field(default="EUR")

    user: User = Relationship(back_populates="financial_profile")


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
