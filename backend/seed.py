import os
from sqlmodel import Session, create_engine, select
from models import CountryRule, User, Property, AreaUnit, PropertyType
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)


def seed_country_rules(session: Session):
    # Check if we already have the new global rules
    if session.exec(select(CountryRule).where(CountryRule.country_code == "AE")).first():
        print("--- CountryRules (Global) already exist. Skipping.")
        return

    print("+++ Seeding Global CountryRules...")
    rules = [
        CountryRule(
            country_code="IE",
            country_name="Ireland",
            currency_code="EUR",
            currency_symbol="€",
            tax_rate_pct=0.01,
            lending_multiplier=4.0
        ),
        CountryRule(
            country_code="ES",
            country_name="Spain",
            currency_code="EUR",
            currency_symbol="€",
            tax_rate_pct=0.10,
            lending_multiplier=4.5
        ),
        CountryRule(
            country_code="AE",
            country_name="United Arab Emirates",
            currency_code="AED",
            currency_symbol="د.إ",
            tax_rate_pct=0.04,
            lending_multiplier=5.0
        )
    ]
    session.add_all(rules)


def seed_users(session: Session):
    if session.exec(select(User)).first():
        print("--- Users already exist. Skipping.")
        return

    print("+++ Seeding Users...")
    user = User(
        email="dev@roofline.io",
        hashed_password="fake_hashed_password_123"
    )
    session.add(user)


def seed_properties(session: Session):
    if session.exec(select(Property)).first():
        print("--- Properties already exist. Skipping.")
        return

    print("+++ Seeding Global Properties...")
    properties = [
        Property(
            title="Modern Apartment in Dublin City",
            property_type=PropertyType.APARTMENT,
            price=450000.0,
            currency="EUR",
            area=85.0,
            area_unit=AreaUnit.SQM,
            country_code="IE",
            location_city="Dublin",
            latitude=53.3498,
            longitude=-6.2603
        ),
        Property(
            title="Luxury Villa in Palm Jumeirah",
            property_type=PropertyType.VILLA,
            price=5500000.0,
            currency="AED",
            area=4200.0,
            area_unit=AreaUnit.SQFT,
            country_code="AE",
            location_city="Dubai",
            latitude=25.1124,
            longitude=55.1390
        )
    ]
    session.add_all(properties)


def run_all_seeds():
    env = os.getenv("ENV_STATE", "development")
    print(f"--- STARTING SEED PROCESS [{env}] ---")

    with Session(engine) as session:
        seed_country_rules(session)
        seed_users(session)
        seed_properties(session)

        session.commit()

    print(f"--- SEEDING COMPLETE ---")


if __name__ == "__main__":
    run_all_seeds()
