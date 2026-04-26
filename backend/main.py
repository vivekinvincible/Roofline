import os
from typing import List, Dict, Any, Optional
from datetime import timedelta
import sqlalchemy as sa
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func, SQLModel, or_

# Local project imports
# Standardized to use get_db from your database file
from database import engine, get_db
from models import Property, FinancialProfile, User
from adapters import IdealistaAdapter, DaftAdapter
from storage import PropertyStorage
from ingestors import ListingIngestor
from auth_utils import hash_password, verify_password, create_access_token
import traceback
from pydantic import BaseModel

# Ensure tables are created on startup
print(f"Creating database at: {engine.url}")
SQLModel.metadata.create_all(engine)

app = FastAPI(title="Real Estate Global API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🚀 SERVER STARTING IN MODE: {os.getenv('ENV_STATE', 'development')}")

# --- NEW SCHEMAS FOR BUYING POWER ---


class EligibilityRequest(BaseModel):
    country: str  # 'ireland' or 'spain'
    monthly_gross: float
    monthly_debt: float
    current_rent: float
    monthly_savings: float
    total_savings: float


# 1. This schema accepts the raw request.
# It has NO max_length, so it won't trigger the error.
class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str


@app.post("/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        existing_user = db.exec(select(User).where(
            User.email == payload.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=400, detail="Email already registered")

        # 2. MANUALLY truncate the password to 72 characters here.
        # This prevents the bcrypt library from crashing.
        safe_password = payload.password[:72]

        # 3. Hash the safe version
        hashed = hash_password(safe_password)

        # 4. Map to the Database Model
        new_user = User(
            full_name=payload.full_name,
            email=payload.email,
            hashed_password=hashed
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully"}

    except Exception as e:
        # If it still fails, check the terminal for the printout
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    # Debug: Print these to your terminal to see what's actually arriving
    print(f"LOGIN ATTEMPT: Email={email}, Password={password}")

    if not email or not password:
        raise HTTPException(
            status_code=400, detail="Email and password required")

    user = db.exec(select(User).where(User.email == email)).first()

    # Check if user even exists in the DB
    if not user:
        print("DEBUG: User not found in database")
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # Verify the hash
    if not verify_password(password, user.hashed_password):
        print("DEBUG: Password verification failed")
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # 3. Create JWT Token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name
        }
    }


# --- 1. DEBUG ENDPOINTS ---


@app.get("/properties/debug")
def debug_properties(db: Session = Depends(get_db)):
    """Quick check to see if properties exist in the DB."""
    statement = select(Property).order_by(Property.created_at.desc()).limit(5)
    results = db.exec(statement).all()
    total_count = db.exec(select(func.count(Property.id))).one()

    return {
        "total_in_db": total_count,
        "recent_samples": results
    }

# --- 2. THE MAIN PROPERTY SEARCH (PAGINATED + MATCHMAKER + SEARCH) ---


@app.get("/properties/{country_code}", response_model=Dict[str, Any])
def get_properties_by_country(
    country_code: str,
    limit: int = 3,
    offset: int = 0,
    max_price: Optional[float] = None,
    search: Optional[str] = None,  # NEW: Search parameter added
    db: Session = Depends(get_db)
):
    """
    Retrieve properties for a specific country.
    Supports pagination, live budget matching, and keyword search.
    """
    # Standardize input (e.g., 'ie' -> 'IE')
    normalized_code = country_code.upper()
    if normalized_code not in ["IE", "ES"]:
        raise HTTPException(
            status_code=400,
            detail="Currently, only 'IE' (Ireland) and 'ES' (Spain) are supported."
        )

    # Base query filter by country
    base_query = select(Property).where(
        Property.country_code == normalized_code)

    # 1. Apply budget filter if max_price is provided
    if max_price:
        base_query = base_query.where(Property.price <= max_price)

    # 2. Apply text search logic if search query is provided
    if search:
        # Standardize to lowercase and wrap in wildcards
        search_term = f"%{search.strip().lower()}%"

        base_query = base_query.where(
            or_(
                func.lower(Property.title).contains(search.lower()),
                func.lower(Property.address).contains(search.lower()),
                func.lower(Property.description).contains(search.lower())
            )
        )

    # Get the TOTAL count for this specific search (respects filters)
    count_statement = select(func.count()).select_from(base_query.subquery())
    total_count = db.exec(count_statement).one()

    # Apply pagination and sorting
    final_statement = (
        base_query
        .order_by(Property.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    results = db.exec(final_statement).all()

    return {
        "total": total_count,
        "properties": results
    }

# --- 3. SPECIALIZED CALCULATORS ---

# --- 3. THE UNIFIED ELIGIBILITY ENGINE ---


@app.post("/calculate-eligibility")
def calculate_eligibility(req: EligibilityRequest):
    """
    Calculates maximum buying power, closing costs, and 
    mortgage readiness metrics based on regional rules.
    """
    m_gross = req.monthly_gross
    m_debt = req.monthly_debt
    savings = req.total_savings

    # Conservative Net Income (approx 72% for typical tax brackets)
    net_monthly = m_gross * 0.72

    mortgage_capacity = 0
    tax_rate = 0
    fee_buffer = 0

    if req.country.lower() == 'ireland':
        # Central Bank Rule: 4x Gross Annual Income
        mortgage_capacity = (m_gross * 12) * 4
        tax_rate = 0.01  # Stamp Duty
        fee_buffer = 3500  # Solicitors, Surveyors, Valuations

    elif req.country.lower() == 'spain':
        # DTI Rule: Max 35% of Net Income minus existing debts
        available_for_mortgage = (net_monthly * 0.35) - m_debt
        # Estimated loan: 180 monthly payments (approx 20 years at current rates)
        mortgage_capacity = available_for_mortgage * 180
        tax_rate = 0.10  # ITP Tax (Varies by region 8-12%)
        fee_buffer = 2000  # Notary & Registry

    else:
        raise HTTPException(status_code=400, detail="Unsupported country code")

    # 1. Calculation for Max Property Price
    # (Loan + Savings - Fees) / (1 + TaxRate)
    max_price = (mortgage_capacity + savings - fee_buffer) / (1 + tax_rate)
    max_price = max(0, round(max_price, 2))

    # 2. Hassle-Free Metrics
    estimated_monthly_payment = mortgage_capacity / 240  # 20-year term estimate
    dti_ratio = ((estimated_monthly_payment + m_debt) / net_monthly) * 100

    # Stress Test (+2% Rate Hike simulation)
    stress_test_payment = estimated_monthly_payment * 1.25

    return {
        "max_price": max_price,
        "loan_limit": round(mortgage_capacity, 2),
        "closing_costs": round((max_price * tax_rate) + fee_buffer, 2),
        "metrics": {
            "dti_ratio": round(dti_ratio, 2),
            "is_dti_healthy": dti_ratio < 35,
            "stress_test_monthly": round(stress_test_payment, 2),
            "repayment_capacity": round(req.current_rent + req.monthly_savings, 2)
        }
    }


@app.get("/properties/affordable")
def get_affordable(savings: float, is_resident: bool = False, db: Session = Depends(get_db)):
    """Simple calculation for quick affordability checks."""
    costs = 0.12
    ltv = 0.80 if is_resident else 0.70
    max_price = (savings / (1 + costs)) / (1 - ltv)

    properties = db.exec(select(Property).where(
        Property.price <= max_price)).all()
    return {"max_price": round(max_price, 2), "results": properties}


@app.post("/calculate-buying-power/spain")
def calculate_spain(profile: FinancialProfile):
    """Deep logic for Spanish non-resident mortgage rules."""
    closing_costs_multiplier = 0.12
    max_ltv = 0.70 if not profile.is_resident else 0.80

    available_cash = profile.savings_eur / (1 + closing_costs_multiplier)
    max_property_price = available_cash / (1 - max_ltv)

    return {
        "max_property_price": round(max_property_price, 2),
        "estimated_taxes": round(max_property_price * closing_costs_multiplier, 2),
        "required_deposit": round(max_property_price * (1 - max_ltv), 2),
        "currency": "EUR"
    }

# --- 4. DATA INGESTION ---


@app.post("/ingest/local")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """Triggers background processing of raw JSON listing files."""
    def run_ingest():
        print("!!! BACKGROUND THREAD AWAKE !!!")
        files_to_process = [
            ("data/idealista_raw.json", IdealistaAdapter()),
            ("data/daft_raw.json", DaftAdapter())
        ]

        try:
            with Session(engine) as session:
                store = PropertyStorage(session)
                ingestor = ListingIngestor(store)

                for path, adapter in files_to_process:
                    if os.path.exists(path):
                        print(f"✅ Starting ingestion for: {path}")
                        ingestor.ingest_file(path, adapter)
                    else:
                        print(
                            f"❌ ERROR: File MISSING at {os.path.abspath(path)}")

            print(f"--- ✅ Background Ingestion Finished ---")
        except Exception as e:
            print(f"❌ CRITICAL DATABASE ERROR: {e}")

    background_tasks.add_task(run_ingest)
    return {"message": "Ingestion started. Check your terminal for progress."}
