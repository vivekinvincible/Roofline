from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Real Estate Global API")


class FinancialProfile(BaseModel):
    savings_eur: float
    annual_income_eur: float
    is_resident: bool = False


@app.get("/")
def home():
    return {"message": "Global Real Estate Engine Active"}


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
