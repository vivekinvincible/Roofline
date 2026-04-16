from typing import Optional
from jose import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import logging
# This prevents passlib from crashing while trying to detect bcrypt version
logging.getLogger("passlib").setLevel(logging.ERROR)

# ... rest of your code


# Setup hashing
# Note: bcrypt has a natural limit of 72 characters.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# TODO: Load this from os.getenv("SECRET_KEY")
SECRET_KEY = "YOUR_SUPER_SECRET_KEY"
ALGORITHM = "HS256"


def hash_password(password: str):
    print("!!! HASHING FUNCTION TRIGGERED !!!")  # Add this line
    safe_password = password[:72]
    print(f"DEBUG: Password truncated to: {safe_password}")  # Add this line
    return pwd_context.hash(safe_password)


def verify_password(plain_password: str, hashed_password: str):
    """
    Verifies a password by truncating the incoming plain text 
    to match the logic used during signup.
    """
    # We must truncate here too, or users with long passwords
    # will be locked out.
    safe_password = plain_password[:72]
    return pwd_context.verify(safe_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # Use timezone-aware UTC
    expire = datetime.now(timezone.utc) + \
        (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
