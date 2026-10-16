"""Fail-closed validator for the Alice U01 read-only browser data bundle."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_CHOICES = ["LAWFUL_GOOD", "NEUTRAL_GOOD", "CHAOTIC_GOOD", "UTILITY", "ACTION"]

def validate_bundle(alice, encounter, causal, html):
    errors = []
    if alice.get("status") != "DESIGN_ONLY_NO_LIVE_SAVE" or alice.get("mutates_game_state") is not False:
        errors.append("alice: live/mutating state forbidden")
    character = alice.get("character", {})
    if character.get("character_id") != "CHAR_ALICE_ZRESS" or character.get("level") != 1:
        errors.append("alice: protected character identity/level mismatch")
    gifts = character.get("origin_gifts", [])
    gift_names = [g.get("spell") if isinstance(g, dict) else g for g in gifts]
    if gift_names != ["Shield", "Acid Splash", "Light"]:
        errors.append("alice: origin gifts/order mismatch")
    if alice.get("scene_id") != "U01_SILVER_COURIER":
        errors.append("alice: scene ID mismatch")
    if alice.get("historical_context", {}).get("dr_year") is not None:
        errors.append("alice: unverified historical date must remain unknown")
    choices = alice.get("choices", [])
    if [c.get("id") for c in choices] != EXPECTED_CHOICES:
        errors.append("alice: choice order/IDs mismatch")
    if any(c.get("selected") is not False or c.get("enabled") is not False for c in choices):
        errors.append("alice: choices must remain unselected and disabled")
    if alice.get("routes", {}).get("travel_enabled") is not False:
        errors.append("alice: unverified travel must remain disabled")
    if alice.get("art", {}).get("file_path") is not None or alice.get("art", {}).get("state") != "planned":
        errors.append("alice: planned art must not be presented as published")
    caps = alice.get("capabilities", {})
    for key in ("dice", "combat", "save", "travel", "choice_submission"):
        if caps.get(key) is not False:
            errors.append(f"alice: capability {key} must remain disabled")
    if encounter.get("status") != "PROPOSED_HOMEBREW_ENCOUNTER_READ_ONLY":
        errors.append("encounter: must remain a proposed homebrew preview")
    if encounter.get("player_state_effects_enabled") is not False or encounter.get("interface_rules", {}).get("save_mutation") is not False:
        errors.append("encounter: state effects/mutation must be disabled")
    if any(h.get("status") != "preview_only" for h in encounter.get("hazards", [])):
        errors.append("encounter: all hazards must be preview_only")
    if causal.get("status") != "PROPOSED_CAUSAL_CHAIN_READ_ONLY" or causal.get("canon_status") != "unverified" or causal.get("state_effect") != "none":
        errors.append("causal: graph must remain unverified and non-mutating")
    events = causal.get("events", [])
    ids = {e.get("event_id") for e in events}
    if len(ids) != len(events) or None in ids:
        errors.append("causal: event IDs must be present and unique")
    for e in events:
        for ref in e.get("cause_event_ids", []) + e.get("consequence_event_ids", []) + e.get("prerequisite_event_ids", []):
            if ref not in ids and ref != "PLAYER_CONFIRMED_U01_CHOICE":
                errors.append(f"causal: dangling event reference {ref}")
    required_paths = (
        "../data/alice_u01_read_model_v1.json",
        "../data/encounter_netherese_enclave_collapse_v1.json",
        "../data/proposed_cosmic_to_u01_causal_chain_v1.json",
    )
    for path in required_paths:
        if path not in html:
            errors.append(f"html: missing data fetch path {path}")
    if "btn.disabled=true" not in html:
        errors.append("html: choice buttons must be disabled")
    return errors

def main():
    data = lambda name: json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
    html = (ROOT / "web" / "alice_u01_preview.html").read_text(encoding="utf-8")
    errors = validate_bundle(data("alice_u01_read_model_v1.json"),
                             data("encounter_netherese_enclave_collapse_v1.json"),
                             data("proposed_cosmic_to_u01_causal_chain_v1.json"), html)
    if errors:
        print("\n".join("ERROR: " + e for e in errors))
        raise SystemExit(1)
    print("PASS: Alice U01 read-only data, encounter preview, causal graph and HTML contract")
if __name__ == "__main__":
    main()
