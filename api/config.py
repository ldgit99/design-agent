from functools import lru_cache
from os import getenv

from pydantic import BaseModel


class Settings(BaseModel):
    openai_api_key: str = ""
    openai_model: str = "gpt-5.4"
    app_env: str = "development"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        openai_api_key=getenv("OPENAI_API_KEY", ""),
        openai_model=getenv("OPENAI_MODEL", "gpt-5.4"),
        app_env=getenv("APP_ENV", "development"),
    )
