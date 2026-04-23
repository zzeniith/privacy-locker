from cryptography.fernet import Fernet
from config import ENCRYPTION_KEY

fernet = Fernet(ENCRYPTION_KEY)

def encrypt_file(data: bytes) -> bytes:
    return fernet.encrypt(data)

def decrypt_file(data: bytes) -> bytes:
    return fernet.decrypt(data)