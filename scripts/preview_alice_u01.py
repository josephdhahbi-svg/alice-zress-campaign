"""Alice U01 immutable preview; not a live character save or command endpoint."""
from copy import deepcopy

CHOICES = ("LAWFUL_GOOD", "NEUTRAL_GOOD", "CHAOTIC_GOOD", "UTILITY", "ACTION")

def build_u01_preview():
    return {
        "schema_version": "1.0",
        "status": "DESIGN_ONLY_NO_LIVE_SAVE",
        "scene_id": "U01_SILVER_COURIER",
        "character": {
            "character_id": "CHAR_ALICE_ZRESS",
            "species": "Drow",
            "class": "Great Old One Warlock",
            "level": 1,
            "patron": "Ghaunadaur",
            "acolyte_influence": "Eilistraee",
            "origin_gifts": ["Shield", "Acid Splash", "Light"],
        },
        "historical_context": {"dr_year": None, "date_precision": "unknown"},
        "choices": [{"id": key, "selected": False, "enabled": False} for key in CHOICES],
        "routes": {"status": "locked_unverified", "travel_enabled": False},
        "art": {"asset_id": "ART_ALICE_L1_PORTRAIT_V1", "state": "planned", "file_path": None},
        "mutates_game_state": False,
    }

def get_u01_preview():
    """Return a fresh object; callers cannot mutate shared preview state."""
    return deepcopy(build_u01_preview())
