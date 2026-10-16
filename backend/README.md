# Moonveil Automaton FSM — isolated v1 module

Node.js built-in test runner (Node >=20); no external packages required.

Run `node --test backend/automaton_fsm.test.js`.

This is a deterministic in-memory state-transition controller for a **provisional/homebrew** unit identifier, `UNIT-VANGUARD-09`. It does **not** connect to physical robotics hardware; does **not** run Express, WebSockets, SQLite, Docker or Flutter; and must **not** be exposed directly to untrusted control commands.

Five states: `IDLE`, `PATROL`, `ENGAGE`, `RECALIBRATE`, `EMERGENCY_SHUTDOWN`. Commands use an explicit allowlist and empty-object payloads. Emergency shutdown is intentionally terminal until a separately designed, authorized reset process is approved. Starting patrol requires at least 15% battery. Successful transitions return immutable journal-ready events with sequence numbers; persistence and authorization are future work.

The unit ID is an engineering fixture, **not established Alice Z'ress canon**. Existing Book 1 gameplay remains unchanged.
