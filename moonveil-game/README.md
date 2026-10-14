# Moonveil Universe — Playable Core (Prototype)

Original fantasy RPG inspired by choice-driven CRPG design; not affiliated with or based on proprietary Baldur's Gate 3 assets.

Run: `python3 moonveil-game/engine.py` from repository root. Python 3.10+, standard library only.
Tests: `python3 -m unittest discover -s moonveil-game/tests -v`.

This is an isolated vertical slice. It does not overwrite the campaign's canonical ledgers or establish player choices. Saves are written locally under `moonveil-game/saves/` and should not be committed. A future mobile UI can consume the same data and action model.

Features: five clickable-equivalent numbered dialogue options, locked romance choice, D20 skill check, quest flag, companion approval, persistent JSON save, and reactive follow-up dialogue. All characters are adults. No BG3 game files used.
