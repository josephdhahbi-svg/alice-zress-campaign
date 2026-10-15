"""Read-only crafting eligibility; never consumes ingredients or grants items."""

def _nonnegative_int(value):
    return type(value) is int and value >= 0

def preview_crafting(recipe, actor, *, completed_events=(), confirmed_choice=False):
    """Return conservative eligibility and reasons; never mutates input."""
    reasons = []
    if not actor.get("authenticated") or not actor.get("authorized"):
        reasons.append("unauthorized")
    if not confirmed_choice:
        reasons.append("player_confirmation_required")
    if actor.get("source_status") not in ("official_verified", "homebrew_approved", "crossover_approved"):
        reasons.append("character_source_unverified")
    if recipe.get("source_status") not in ("official_verified", "homebrew_approved", "crossover_approved"):
        reasons.append("recipe_unverified")
    year = actor.get("dr_year")
    if type(year) is not int:
        reasons.append("historical_date_unknown")
    window = recipe.get("time_window")
    if not isinstance(window, dict) or type(window.get("dr_start")) is not int or type(window.get("dr_end")) is not int:
        reasons.append("recipe_time_window_unverified")
    elif type(year) is int and not (window["dr_start"] <= year <= window["dr_end"]):
        reasons.append("recipe_outside_time_window")
    if not recipe.get("location_id") or recipe.get("location_id") != actor.get("location_id"):
        reasons.append("wrong_or_unknown_location")
    if not recipe.get("plane_id") or recipe.get("plane_id") != actor.get("plane_id"):
        reasons.append("wrong_or_unknown_plane")
    if not recipe.get("timeline_id") or recipe.get("timeline_id") != actor.get("timeline_id"):
        reasons.append("wrong_or_unknown_timeline")
    events = set(completed_events)
    if not set(recipe.get("required_event_ids", [])).issubset(events):
        reasons.append("missing_quest_prerequisites")
    if set(recipe.get("forbidden_event_ids", [])).intersection(events):
        reasons.append("forbidden_event_present")
    level, required_level = actor.get("level"), recipe.get("required_level")
    if not _nonnegative_int(level) or not _nonnegative_int(required_level) or level < required_level:
        reasons.append("level_requirement_not_met")
    resonance, cost = actor.get("resonance_points"), recipe.get("resonance_cost")
    if not _nonnegative_int(resonance) or not _nonnegative_int(cost) or resonance < cost:
        reasons.append("resonance_requirement_not_met")
    alignment = recipe.get("alignment_tier_required")
    if alignment and alignment not in actor.get("earned_alignment_tiers", []):
        reasons.append("alignment_requirement_not_met")
    ingredients = recipe.get("ingredients")
    inventory = actor.get("inventory")
    if not isinstance(ingredients, list) or not isinstance(inventory, dict):
        reasons.append("ingredient_records_missing")
    else:
        required = {}
        for ing in ingredients:
            if not isinstance(ing, dict) or not ing.get("item_id") or not _nonnegative_int(ing.get("quantity")) or ing["quantity"] == 0:
                reasons.append("invalid_ingredient_specification")
                continue
            required[ing["item_id"]] = required.get(ing["item_id"], 0) + ing["quantity"]
        for item_id, qty in required.items():
            if not _nonnegative_int(inventory.get(item_id)) or inventory[item_id] < qty:
                reasons.append("missing_ingredients")
    return {"eligible": not reasons, "reasons": sorted(set(reasons)), "mutates_game_state": False,
            "recipe_id": recipe.get("recipe_id")}
