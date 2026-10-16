"""Deterministic Book 1 choice projection from the append-only event ledger.

No network, auth, or official D&D adjudication is implied. The browser's
provisional roll results are preserved rather than rerolled.
"""
CHOICE_KINDS = ("lawful_good", "neutral_good", "chaotic_good", "utility", "action")
SCENE_ID = "scene-book01-rabbit-hole-01"

def validate_choice_event(payload):
    if not isinstance(payload, dict):
        raise ValueError("Choice event must be an object")
    if payload.get("sceneId") != SCENE_ID:
        raise ValueError("Unsupported scene")
    if payload.get("kind") not in CHOICE_KINDS:
        raise ValueError("Unknown choice kind")
    roll = payload.get("rawRoll")
    modifier = payload.get("modifier")
    dc = payload.get("dc")
    if type(roll) is not int or not 1 <= roll <= 20:
        raise ValueError("Invalid d20")
    if type(modifier) is not int or not -10 <= modifier <= 20:
        raise ValueError("Invalid modifier")
    if type(dc) is not int or not 1 <= dc <= 40:
        raise ValueError("Invalid DC")
    if payload.get("total") != roll + modifier or type(payload.get("total")) is not int:
        raise ValueError("Roll total mismatch")
    if type(payload.get("success")) is not bool or payload["success"] != (roll + modifier >= dc):
        raise ValueError("Outcome mismatch")
    return True

def project_book1(snapshot):
    """Project an ordered event snapshot into an immutable-to-caller summary."""
    if not isinstance(snapshot, dict) or not isinstance(snapshot.get("events"), list):
        raise ValueError("Invalid snapshot")
    choices = []
    last_revision = 0
    for event in snapshot["events"]:
        rev = event.get("revision")
        if type(rev) is not int or rev <= last_revision:
            raise ValueError("Events out of order")
        last_revision = rev
        if event.get("type") != "CHOICE_RESOLVED":
            continue
        payload = event.get("payload")
        validate_choice_event(payload)
        choices.append({"event_id": event["event_id"], "revision": rev,
                        "kind": payload["kind"], "success": payload["success"],
                        "total": payload["total"], "dc": payload["dc"]})
    return {"campaign_id": snapshot.get("campaign_id"),
            "revision": snapshot.get("revision"),
            "scene_id": SCENE_ID, "choices": choices,
            "choice_count": len(choices)}
