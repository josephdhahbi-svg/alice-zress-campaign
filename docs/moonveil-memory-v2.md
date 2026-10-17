# Moonveil Memory Engine v2 (proposed integration)

This module keeps **Moonveil's female Dhampir Undead Warlock** separate from **Alice Z'ress, the Drow Great Old One Warlock** already represented elsewhere in this repository.

## Windows PowerShell
From the repository root:

```powershell
py scripts/moonveil_memory.py init
py scripts/moonveil_memory.py briefing --output local/MOONVEIL_BRIEFING.md
py scripts/moonveil_memory.py search patron
py -m unittest discover -s scripts -p test_moonveil_memory.py
```

Record an event:
```powershell
py scripts/moonveil_memory.py event "Session 1" 1 "Entered the Netherese Rabbit Hole"
```

Propose a new fact (does not override locked canon):
```powershell
py scripts/moonveil_memory.py fact opening next_location "Eye of the First World" --source "Session notes"
```

Only after explicit approval, add `--approve` to confirm a fact or replace existing confirmed canon. Every attempt is recorded in the change ledger.

The SQLite file and generated briefing live in `local/` on the player's computer; **do not commit private session data** to a public GitHub repository. The Python script is dependency-free. It does **not** automatically read ChatGPT conversations, access voice transcripts, sync GitHub, or update the browser game. Future work should add explicit opt-in import/export and a UI.

The seeded campaign facts are a starting snapshot from the working agreement, not an independently verified transcription of every earlier conversation. Verify the initial canon before approving any future revisions.
