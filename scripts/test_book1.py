#!/usr/bin/env python3
"""Regression checks for the Book 1 scene data and standalone browser prototype."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
GAME = ROOT / "game" / "book1.html"
errors = []


def check(condition, message):
    if not condition:
        errors.append(message)


def main():
    try:
        books = json.loads((DATA / "books.json").read_text(encoding="utf-8"))
        locations = json.loads((DATA / "locations.json").read_text(encoding="utf-8"))
        payoffs = json.loads((DATA / "setup_payoffs.json").read_text(encoding="utf-8"))
        scenes = json.loads((DATA / "scenes.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"FAIL: unable to load Book 1 test data: {exc}")
        return 1

    check(len(books) == 30, "book catalog must contain exactly 30 books")
    check(len(scenes) >= 1, "scene catalog must contain at least one scene")
    if not scenes:
        print("FAIL: no scene data")
        return 1

    scene = next((item for item in scenes if item.get("id") == "scene-book01-rabbit-hole-01"), None)
    check(scene is not None, "Book 1 opening scene ID not found")
    if scene is None:
        print("\\n".join(errors))
        return 1

    book_ids = {item.get("id") for item in books}
    location_ids = {item.get("id") for item in locations}
    payoff_ids = {item.get("id") for item in payoffs}
    check(scene.get("book_id") in book_ids, "scene references an unknown book")
    check(scene.get("location_id") in location_ids, "scene references an unknown location")
    expected = ["lawful_good", "neutral_good", "chaotic_good", "utility", "action"]
    check(scene.get("choice_order") == expected, "scene choice order differs from the established five-choice convention")
    choices = scene.get("choices", [])
    check(len(choices) == 5, "scene must have exactly five choices")
    if len(choices) == 5:
        check([c.get("kind") for c in choices] == expected, "choice kind ordering is incorrect")
        check(len({c.get("id") for c in choices}) == 5, "choice IDs must be unique")
        for choice in choices:
            check(bool(choice.get("success")) and bool(choice.get("failure")), f"choice {choice.get('id')} needs success and failure outcomes")
            check(isinstance(choice.get("check"), dict), f"choice {choice.get('id')} needs a check definition")
    for payoff_id in scene.get("setup_payoff_ids", []):
        check(payoff_id in payoff_ids, f"scene references unknown payoff {payoff_id}")

    gift_names = {gift.get("name") for gift in scene.get("origin_gifts", [])}
    check("Mystra's Shield" in gift_names, "Mystra's Shield origin gift missing")
    check("Ghaunadaur's Acid Splash" in gift_names, "Ghaunadaur's Acid Splash origin gift missing")
    check("Eilistraee's Blade Ward" in gift_names, "Eilistraee's Blade Ward origin gift missing")

    check(GAME.exists(), "game/book1.html is missing")
    if GAME.exists():
        html = GAME.read_text(encoding="utf-8")
        for element_id in ("choices", "modifier", "dc", "roll", "result", "status", "saveSummary", "log", "export", "import", "reset"):
            check(('id="' + element_id + '"' in html) or ("id='" + element_id + "'" in html), f"browser prototype missing control #{element_id}")
        for feature in ("localStorage", "JSON.stringify", "JSON.parse", "createObjectURL", "Math.random"):
            check(feature in html, f"browser prototype missing expected implementation marker {feature}")
        check("No U01 packets are granted or spent by this scene" in html, "scene should explicitly state that it does not alter U01 packets")
        check("scene-book01-rabbit-hole-01" in html, "browser prototype scene ID mismatch")

    if errors:
        print("\\n".join(f"FAIL: {message}" for message in errors))
        print(f"FAILED: {len(errors)} Book 1 regression check(s).")
        return 1
    print(f"PASS: {len(books)} books, {len(choices)} ordered choices, three origin gifts, cross-file references, and browser save/roll controls.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
