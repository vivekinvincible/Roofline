import os
from sqlmodel import Session, create_engine, select
from models import CountryRule, User, Property
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)


def seed_country_rules(session: Session):
    if session.exec(select(CountryRule)).first():
        print("--- CountryRules already exist. Skipping.")
        return

    print("+++ Seeding CountryRules...")
    rules = [
        CountryRule(country_code="IE", tax_rate=0.01, lending_multiplier=4.0),
        CountryRule(country_code="ES", tax_rate=0.10, lending_multiplier=4.5)
    ]
    session.add_all(rules)


def seed_users(session: Session):
    if session.exec(select(User)).first():
        print("--- Users already exist. Skipping.")
        return

    print("+++ Seeding Users...")
    # Add 'hashed_password' here to satisfy the database constraint
    user = User(
        email="dev@roofline.io",
        full_name="Vivek Dev",
        hashed_password="fake_hashed_password_123"
    )
    session.add(user)


def run_all_seeds():
    env = os.getenv("ENV_STATE", "development")
    print(f"--- STARTING SEED PROCESS [{env}] ---")

    with Session(engine) as session:
        seed_country_rules(session)
        seed_users(session)
        # seed_properties(session) <--- Add new ones here as you go

        session.commit()

    print(f"--- SEEDING COMPLETE ---")


if __name__ == "__main__":
    run_all_seeds()
