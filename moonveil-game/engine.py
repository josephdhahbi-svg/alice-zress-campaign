"""Small playable Moonveil RPG vertical slice. Standard library only."""
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCENE = ROOT / "data" / "scenes.json"
SAVE = ROOT / "saves" / "local-save.json"

def new_state():
    return {"schema": 1, "approval": {"lyra_solaria": 0},
            "flags": {}, "events": [], "scene": "moonlight_tent"}

def load_state(path=SAVE):
    if not path.exists():
        return new_state()
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != 1:
        raise ValueError("Unsupported save version")
    return data

def save_state(state, path=SAVE):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, indent=2), encoding="utf-8")
    temporary.replace(path)

def eligible(choice, state):
    requirement = choice.get("requires", {})
    return (state["approval"].get("lyra_solaria", 0) >= requirement.get("approval", -50)
            and (not requirement.get("flag") or state["flags"].get(requirement["flag"], False)))

def resolve(choice, state, roll=None):
    if not eligible(choice, state):
        return {"ok": False, "message": "Choice locked: requirements not met."}
    if any(event["choice_id"] == choice["id"] for event in state["events"]):
        return {"ok": False, "message": "This scene choice has already been resolved."}
    check = choice.get("check")
    if check:
        if roll is None:
            roll = random.randint(1, 20)
        if not 1 <= roll <= 20:
            raise ValueError("D20 roll must be 1..20")
        total = roll + check["modifier"]
        if total < check["dc"]:
            state["events"].append({"choice_id": choice["id"], "roll": roll, "total": total, "success": False})
            return {"ok": True, "message": f"Investigation {roll}+{check['modifier']}={total} vs DC {check['dc']}: failed. Lyra suggests another approach."}
    else:
        total = None
    state["approval"]["lyra_solaria"] = max(-50, min(50, state["approval"]["lyra_solaria"] + choice["approval"]))
    state["flags"][choice["flag"]] = True
    state["events"].append({"choice_id": choice["id"], "roll": roll if check else None, "total": total, "success": True})
    return {"ok": True, "message": choice["reply"]}

def main():
    scene = json.loads(SCENE.read_text(encoding="utf-8"))
    state = load_state()
    print("\nMOONVEIL UNIVERSE — THE MOONLIGHT TENT")
    print(scene["location"])
    print(f'{scene["speaker"]}: "{scene["opening"]}"')
    print("Lyra approval:", state["approval"]["lyra_solaria"])
    for choice in scene["choices"]:
        marker = "" if eligible(choice, state) else " [LOCKED]"
        print(f'{choice["id"]}. {choice["label"]}{marker}')
    try:
        choice_id = int(input("Choose an option: "))
    except (ValueError, EOFError):
        print("No valid choice entered.")
        return
    choice = next((c for c in scene["choices"] if c["id"] == choice_id), None)
    if choice is None:
        print("Unknown choice.")
        return
    result = resolve(choice, state)
    print(result["message"])
    if result["ok"]:
        save_state(state)
        print("Saved locally:", SAVE)

if __name__ == "__main__":
    main()
