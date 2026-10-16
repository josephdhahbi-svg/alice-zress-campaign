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
    war = ROOT / "game" / "faction-war.html"
    check(war.exists(), "faction war dashboard is missing")
    if war.exists():
        dashboard = war.read_text(encoding="utf-8")
        for feature in ('id="pulse"', 'id="territories"', 'id="factions"',
                        'id="audit"', 'localStorage', 'JSON.stringify',
                        'moonveil-faction-war-demo-v1', 'does not run hourly',
                        'id="powerTable"', 'id="controlTable"',
                        'id="frontTable"', 'id="supplyTable"',
                        'renderWarTables'):
            check(feature in dashboard, f"faction war dashboard missing {feature}")
        check('faction-war.html' in html, "Living World missing war dashboard link")
    adventure = ROOT / "game" / "adventure-war-room.html"
    check(adventure.exists(), "adventure war room missing")
    if adventure.exists():
        page = adventure.read_text(encoding="utf-8")
        for marker in ('id="battleTable"', 'id="rosterTable"', 'id="objectiveTable"',
                       'id="resourceTable"', 'id="chronologyTable"', 'id="theaterTable"',
                       'id="advance"', 'id="resolve"', 'moonveil-adventure-war-room-v1',
                       'state.book===30', 'state.traversal===7'):
            check(marker in page, f"adventure war room missing {marker}")
        check('adventure-war-room.html' in dashboard, "faction war dashboard missing adventure link")
    tactical = ROOT / "game" / "tactical-war-table.html"
    check(tactical.exists(), "tactical war table missing")
    if tactical.exists():
        battle = tactical.read_text(encoding="utf-8")
        for marker in ('id="board"', 'id="units"', 'id="nextTurn"',
                       'id="defend"', 'id="newBattle"', 'id="export"',
                       'moonveil-tactical-war-v1', 'function attack(',
                       'function advance(', 'function handle(', 'const queue=',
                       'localStorage'):
            check(marker in battle, f"tactical war table missing {marker}")
        check('tactical-war-table.html' in page, "adventure war room missing tactical link")
    deck = ROOT / "game" / "tactical-command-deck.html"
    check(deck.exists(), "tactical command deck missing")
    if deck.exists():
        deck_html = deck.read_text(encoding="utf-8")
        for marker in ('id="macros"', 'id="glyphActions"', 'id="journal"',
                       'id="export"', 'id="reset"', 'id="clear"',
                       'id="rollModifier"', 'id="rollDC"',
                       'moonveil-command-deck-pins-v1', 'localStorage',
                       'ROLL_INITIATIVE', 'OPEN_TACTICAL_MAP',
                       'ATTUNE_ALTAR', 'SUPPORT', 'ATTACK',
                       'DEFEND', 'CONTROL', 'SCAN'):
            check(marker in deck_html, f"command deck missing {marker}")
        for marker in ('preview only', 'implemented=new Set', 'eligibleSupport', 'eligibleAttack', 'new Set(p.filter', 'Roll rejected:', 'SUCCESS', 'FAILURE'):
            check(marker in deck_html, f"command deck safety guard missing {marker}")
        if tactical.exists():
            check('tactical-command-deck.html' in battle,
                  "tactical war table missing command deck link")
    if errors:
        print("\n".join("FAIL: " + e for e in errors))
        print(f"FAILED: {len(errors)} Living World Engine check(s).")
        return 1
    print("PASS: Living World Engine controls, pointer movement, dynamic state, local persistence, import/export, and honest local-only scope.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
