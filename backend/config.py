"""
FlameLens AI — Configuration
Loads settings from .env file.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
DATABASE_URL: str = str(BASE_DIR / "data" / "flamelens.db")
CHROMADB_PATH: str = str(BASE_DIR / "data" / "chromadb")
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

# Pip-libs path so pandas/chromadb are importable
import sys
PIP_LIBS = str(Path("E:/pip-libs").resolve())
if PIP_LIBS not in sys.path:
    sys.path.insert(0, PIP_LIBS)
