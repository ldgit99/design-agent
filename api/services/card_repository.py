import json
from functools import lru_cache
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[2]
CARDS_FILE = BASE_DIR / "data" / "cards.json"


@lru_cache(maxsize=1)
def get_seed_cards() -> list[dict[str, Any]]:
    with CARDS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)
