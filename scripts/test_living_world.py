#!/usr/bin/env python3
"""Static regression checks for the standalone Moonveil Living World Engine."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "game" / "living-world.html"
errors = []


def check(condition, message):
    if not condition:
        errors.append(message)


def main():
    check(HTML.exists(), "game/living-world.html is missing")
    if HTML.exists():
        html = HTML.read_text(encoding="utf-8")
        for control in ("teleport", "animate", "spawnAlice", "spawnWraith", "vanish",
                        "scenePit", "sceneHallway", "save", "load", "export",
                        "importFile", "clear", "applyEdit", "removeSelected"):
            check(f'id="{control}"' in html, f"missing world control #{control}")
        for feature in ("pointerdown", "pointermove", "pointerup", "localStorage",
                        "JSON.stringify", "JSON.parse", "createObjectURL",
                        "validateState", "sceneLabel", "entityList"):
            check(feature in html, f"missing expected engine feature: {feature}")
        check("moonveil-living-world-v1" in html, "versioned local save key missing")
        check("restoredFromSave" in html, "automatic saved-world restore missing")
        check("confirm(" in html, "clear-world confirmation missing")
        check("does not synchronize with a server" in html, "local-only limitation must be explicit")
    if errors:
        print("\n".join("FAIL: " + e for e in errors))
        print(f"FAILED: {len(errors)} Living World Engine check(s).")
        return 1
    print("PASS: Living World Engine controls, pointer movement, dynamic state, local persistence, import/export, and honest local-only scope.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
