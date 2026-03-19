from fastapi import FastAPI, BackgroundTasks, APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from database import engine, get_db
from models import Property, FinancialProfile, SQLModel
from adapters import IdealistaAdapter, DaftAdapter
from storage import PropertyStorage
from ingestors import ListingIngestor
import sqlalchemy as sa
import os
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

# Ensure tables are created
SQLModel.metadata.create_all(engine)

app = FastAPI(title="Real Estate Global API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🚀 SERVER STARTING IN MODE: {os.getenv('ENV_STATE')}")


@app.get("/properties/debug")
def debug_properties(db: Session = Depends(get_db)):
    # Fetch the 5 most recent properties
    statement = select(Property).order_by(Property.created_at.desc()).limit(5)
    results = db.exec(statement).all()

    # Count total properties in the DB
    total_count = db.exec(select(sa.func.count(Property.id))).one()

    return {
        "total_in_db": total_count,
        "recent_samples": results
    }


router = APIRouter()


@app.get("/properties/{country_code}", response_model=Dict[str, Any])
def get_properties_by_country(
    country_code: str,
    limit: int = 3,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Retrieve properties for a specific country with pagination support.
    """
    # 1. Standardize and Validate
    normalized_code = country_code.upper()
    if normalized_code not in ["IE", "ES"]:
        raise HTTPException(
            status_code=400,
            detail="Currently, only 'IE' (Ireland) and 'ES' (Spain) are supported."
        )

    # 2. Get the TOTAL count (Crucial for the frontend 'hasMore' logic)
    count_statement = select(func.count()).select_from(Property).where(
        Property.country_code == normalized_code
    )
    total_count = db.exec(count_statement).one()

    # 3. Query the specific page (Apply Offset and Limit)
    statement = (
        select(Property)
        .where(Property.country_code == normalized_code)
        .offset(offset)
        .limit(limit)
    )
    results = db.exec(statement).all()

    # 4. Return structured data
    return {
        "total": total_count,
        "properties": results
    }


@app.post("/ingest/local")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    def run_ingest():
        print("!!! BACKGROUND THREAD AWAKE !!!")
        print(f"--- 🚀 Background Ingestion Started ---")
        print(f"DEBUG: Working Directory: {os.getcwd()}")

        files_to_process = [
            ("data/idealista_raw.json", IdealistaAdapter()),
            ("data/daft_raw.json", DaftAdapter())
        ]

        # Check if files exist BEFORE opening the DB session
        for path, _ in files_to_process:
            if not os.path.exists(path):
                print(f"❌ ERROR: File MISSING at {os.path.abspath(path)}")
                # We don't 'return' here, we just skip this file or log it
            else:
                print(f"✅ FOUND: {path}")

        try:
            with Session(engine) as session:
                print("DEBUG: Database session opened.")
                store = PropertyStorage(session)
                ingestor = ListingIngestor(store)

                for path, adapter in files_to_process:
                    if os.path.exists(path):
                        print(f"Starting ingestion for: {path}")
                        ingestor.ingest_file(path, adapter)

            print(f"--- ✅ Background Ingestion Finished ---")
        except Exception as e:
            print(f"❌ CRITICAL DATABASE ERROR: {e}")

    background_tasks.add_task(run_ingest)
    return {"message": "Ingestion started. Check your terminal for progress."}


@app.get("/properties/affordable")
def get_affordable(savings: float, is_resident: bool = False, db: Session = Depends(get_db)):
    # Your calculation logic
    costs = 0.12
    ltv = 0.80 if is_resident else 0.70
    max_price = (savings / (1 + costs)) / (1 - ltv)

    # SQLModel query
    properties = db.exec(select(Property).where(
        Property.price <= max_price)).all()
    return {"max_price": round(max_price, 2), "results": properties}


@app.post("/calculate-buying-power/spain")
def calculate_spain(profile: FinancialProfile):
    # Logic based on 2026 Spanish non-resident mortgage rules (approx 30-40% deposit)
    # Plus average 12% closing costs (ITP + Notary)
    closing_costs_multiplier = 0.12
    max_ltv = 0.70 if not profile.is_resident else 0.80

    # Simple buying power logic
    available_cash = profile.savings_eur / (1 + closing_costs_multiplier)
    max_property_price = available_cash / (1 - max_ltv)

    return {
        "max_property_price": round(max_property_price, 2),
        "estimated_taxes": round(max_property_price * closing_costs_multiplier, 2),
        "required_deposit": round(max_property_price * (1 - max_ltv), 2),
        "currency": "EUR"
    }
