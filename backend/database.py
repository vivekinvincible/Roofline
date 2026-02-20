import os
from pathlib import Path
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

# 1. Determine which environment we are in (Default to development)
env_state = os.getenv("ENV_STATE", "development")

# 2. Find the correct file
base_dir = Path(__file__).resolve().parent
env_file = base_dir / f".env.{env_state}"

# 3. Load it
if env_file.exists():
    load_dotenv(dotenv_path=env_file)
else:
    # Fallback to standard .env if specific ones don't exist
    load_dotenv(dotenv_path=base_dir / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

# This is your "Unit of Work" factory


def get_db():
    with Session(engine) as session:
        yield session
