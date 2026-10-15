# Moonveil Living City Atomic v3 — tested checkpoint
2026-10-15. NONCANONICAL prototype; no actual Alice campaign state changed.

## Real code and test results
Full source and tests packaged in `moonveil_living_city_atomic_v3.zip` in the conversation download.
Locally modified engine.py, living_city.py and city_network.py to respect existing outer SQLite transactions. Added atomic_actions.py with BEGIN IMMEDIATE and test_atomic_actions.py.
Ran `python -m unittest discover -q`: **34 tests passed**.
Injected an SQLite trigger failure during network reaction insertion: command, event, city event, rumor and revision changes all rolled back. Duplicate command IDs remain idempotent. All five heroic choices tested.

## Important limitation
This repository commit includes atomic_actions.py and this checkpoint, not the full dependency source. Full runnable code is in the downloadable archive. Copy those files into this directory before attempting to execute the module. This remains a local Python prototype; Flutter UI, backend server, real-time ChatGPT save bridge, art retrieval and production dice are not implemented.

## Why this matters
Previous v2 implementation could commit a scene event then fail before applying its trade/rumor consequence. The v3 transaction boundary ensures all effects either persist together or none persist. This is essential for a living world that remembers reliably.
