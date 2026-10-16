"""Pure proposed encounter calculations. Does not apply gameplay effects."""
def evaluate_seismic_hazard(dex_save_roll, dc=14):
    if not isinstance(dex_save_roll, int) or not 1 <= dex_save_roll <= 20:
        raise ValueError("dex_save_roll must be an integer from 1 to 20")
    if not isinstance(dc, int) or not 1 <= dc <= 40:
        raise ValueError("dc must be an integer from 1 to 40")
    success = dex_save_roll >= dc
    return {
        "status": "SUCCESS" if success else "FAILURE",
        "effect_preview": "No prone condition proposed" if success else "Prone condition proposed",
        "canon_status": "unverified",
        "applied_to_character": False
    }


def get_ooze_surge_preview():
    return {
        "status": "proposed_read_only",
        "advance_rate_ft_per_round": 15,
        "acid_damage": {"dice": "2d6", "type": "acid", "trigger": None},
        "movement_penalty": None,
        "viscosity_penalty_multiplier": None,
        "notes": "Movement penalty and viscosity multiplier are unresolved; no effect is applied.",
        "canon_status": "unverified",
        "applied_to_character": False
    }
