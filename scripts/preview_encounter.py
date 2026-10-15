"""Pure, read-only Moonveil encounter preview. No monster or player state is mutated.

The optional scaling model is HOME BREW, not a published D&D encounter rule.
"""
from math import isfinite

def _number(value, minimum, maximum, label):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not isfinite(value):
        raise ValueError(f"{label}: finite number required")
    if not minimum <= value <= maximum:
        raise ValueError(f"{label}: outside supported preview range")
    return value

def preview_encounter(template, party_size, average_level, planar_multiplier=1.0, *, enable_homebrew=False):
    """Return base official/template stats or a labeled optional homebrew preview."""
    party_size = _number(party_size, 1, 12, "party_size")
    average_level = _number(average_level, 1, 20, "average_level")
    planar_multiplier = _number(planar_multiplier, 0.5, 2.0, "planar_multiplier")
    if int(party_size) != party_size:
        raise ValueError("party_size: whole number required")
    hp = _number(template.get("base_hp"), 1, 10000, "base_hp")
    ac = _number(template.get("base_ac"), 1, 30, "base_ac")
    cr = _number(template.get("base_challenge_rating"), 0, 30, "base_challenge_rating")
    if not isinstance(enable_homebrew, bool):
        raise ValueError("enable_homebrew must be boolean")
    base = {"hp": int(hp), "ac": int(ac), "challenge_rating": cr}
    result = {
        "encounter_id": template.get("encounter_id"),
        "monster_name": template.get("base_monster_name"),
        "base_stats": base,
        "mode": "homebrew_preview" if enable_homebrew else "base_preview",
        "canon_status": "homebrew_proposal" if enable_homebrew else template.get("source_status", "unverified"),
        "mutates_game_state": False,
    }
    if enable_homebrew:
        size_factor = max(1.0, party_size / 4.0)
        level_factor = max(1.0, average_level / 3.0)
        result["preview_stats"] = {
            "hp": max(1, round(hp * size_factor * level_factor * planar_multiplier)),
            "ac": min(30, int(ac) + int((average_level - 1) // 4)),
            "challenge_rating": cr,
        }
        result["warnings"] = [
            "Optional homebrew numbers only; CR is not recalculated.",
            "Not validated as balanced or official D&D encounter design.",
        ]
    else:
        result["preview_stats"] = base.copy()
    return result
