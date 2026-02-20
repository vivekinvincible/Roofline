import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# 1. PATH CONFIGURATION
# This file lives in: backend/migrations/env.py
# We need to point to: backend/
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# 2. LOAD ENVIRONMENT VARIABLES
# We use an absolute path to ensure the .env file is found

# migrations/env.py
env_state = os.getenv("ENV_STATE", "development")
dotenv_path = BASE_DIR / f".env.{env_state}"

if not dotenv_path.exists():
    dotenv_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=dotenv_path)


# 3. IMPORT YOUR MODELS
# Because of step 1, this "just works" now
try:
    from models import SQLModel
except ImportError as e:
    print(f"Current sys.path: {sys.path}")
    raise ImportError(
        f"Could not import 'models' from {BASE_DIR}. "
        "Check that models.py exists in the backend folder."
    ) from e

# 4. ALEMBIC CONFIGURATION
config = context.config  # type: ignore

# 5. DATABASE CONNECTION INJECTION
db_url = os.getenv("DATABASE_URL")

# Guard check: Provides a clear error instead of a cryptic TypeError
if not db_url:
    raise ValueError(
        f"DATABASE_URL is missing! I checked the .env file at: {dotenv_path}. "
        "Please ensure that file exists and contains DATABASE_URL=..."
    )

config.set_main_option("sqlalchemy.url", db_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the metadata for 'autogenerate' support
target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # Detects changes to column types (e.g., String(50) -> String(100))
            compare_type=True,
            # Detects changes to indexes and unique constraints
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
