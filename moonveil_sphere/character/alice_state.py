"""Read-only reference projection; never reads or writes a live save."""
from copy import deepcopy


def get_alice_protected_state():
    return deepcopy({
        "schema_version": "1.0",
        "entity_id": "CHAR_ALICE_ZRESS",
        "name": "Alice Z'ress",
        "species": "Drow",
        "class": "Great Old One Warlock",
        "level": 1,
        "patron": "Ghaunadaur",
        "influence": ["Eilistraee"],
        "u01_scene_id": "U01_SILVER_COURIER",
        "u01_choices_remaining": 5,
        "u01_choices": [
            {"id": "LAWFUL_GOOD", "selected": False},
            {"id": "NEUTRAL_GOOD", "selected": False},
            {"id": "CHAOTIC_GOOD", "selected": False},
            {"id": "UTILITY", "selected": False},
            {"id": "ACTION", "selected": False}
        ],
        "custom_origin_gifts": ["Shield", "Acid Splash", "Light"],
        "triad_attunements_status": "LOCKED_FUTURE_MILESTONE",
        "canon_status": "unverified",
        "workflow_status": "proposed_reference_projection",
        "mutates_game_state": False
    })
