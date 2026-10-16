"""Book-tier metadata only; not a route planner or route unlock engine."""
BOOK_TIERS = {
    1: {"book_range": [1, 10], "label": "Subterranean Foundation and Awakening"},
    2: {"book_range": [11, 20], "label": "Planar Ascension and Surface Crossing"},
    3: {"book_range": [21, 30], "label": "Cosmic Apex and Outer Shell"}
}


def get_sector_pass_details(sector_name: str, pass_tier: int):
    if not isinstance(pass_tier, int) or pass_tier not in BOOK_TIERS:
        return {"status": "invalid_tier", "details": None}
    if sector_name != "Underdark / Core Singularity":
        return {"status": "unmapped_sector", "details": None}
    tier = BOOK_TIERS[pass_tier]
    return {
        "status": "proposed_campaign_structure",
        "sector": sector_name,
        "pass_tier": pass_tier,
        "book_range": tier["book_range"],
        "label": tier["label"],
        "traversal_id": None,
        "historical_date": None,
        "route_unlocks_enabled": False
    }
