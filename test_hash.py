from passlib.context import CryptContext
try:
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    print("Hashing 'password123' with pbkdf2_sha256...")
    h = pwd_context.hash("password123")
    print(f"Success: {h}")
except Exception as e:
    print(f"Error: {e}")
