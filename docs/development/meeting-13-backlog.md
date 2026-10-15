# Moonveil Meeting 13 — Development Backlog
Official motto: **EVERYTHING IS LEGOS.**
Branch: `dev/alice-three-chosen-roadmap`

Status key: DONE = committed artifact; PARTIAL = prototype only; BLOCKED = requires missing infrastructure or evidence.

| # | Priority | Task | Status | Exit criterion |
|---|---|---|---|---|
| 1 | P0 | Verify current repository handoff and files | DONE | Relevant files fetched from target branch |
| 2 | P0 | Shared U01 projection fixture | DONE | Versioned JSON preserves Alice Level 1 and five disabled choices |
| 3 | P0 | Browser UI consumes projection | PARTIAL | Static HTML fetches fixture when repository root is served over HTTP |
| 4 | P0 | Contract tests | DONE | Eight locally reconstructed tests pass; full checkout pending |
| 5 | P0 | Full repository checkout and all validators | BLOCKED | Network/DNS checkout required; no full-suite claim |
| 6 | P0 | Authenticated read-only API | BLOCKED | Gemini server/database foundation and authorization required |
| 7 | P0 | Secure command/event ledger | BLOCKED | Actual reviewed backend files and integration tests required |
| 8 | P1 | Browser interaction/accessibility testing | BLOCKED | Run in real desktop/mobile browsers |
| 9 | P1 | D&D source/era audit for U01 locations and NPCs | PARTIAL | Each named location/NPC has source, edition, date range, status |
| 10 | P1 | Approved original Alice portrait + asset manifest | BLOCKED | Image file created, reviewed, and stored with metadata |
| 11 | P1 | Copilot WorldOS read projection | BLOCKED | Schema-compatible records and synthetic tests supplied |
| 12 | P1 | Gemini secure backend integration | BLOCKED | Auth, CAS, idempotency, ledger and reproducible tests verified |
| 13 | P2 | Player-confirmed choice command | BLOCKED | Secure server command and explicit user approval |
| 14 | P2 | Dice/encounter presentation | PROPOSED | Server-authenticated result contract and display component |
| 15 | P2 | Save/reload end-to-end demo | PROPOSED | Disposable test campaign round-trips state safely |

## Immediate sequence
1. Finish read-model validation and browser fail-closed behavior.
2. Execute tests from a complete checkout.
3. Obtain and review Gemini's real database/auth/command files.
4. Obtain Copilot's source-attributed U01 location/NPC data.
5. Add approved portrait asset.
6. Only after the above, implement player-confirmed choices and save/reload.

No player save, route status, reward, or production environment was changed by this backlog.
