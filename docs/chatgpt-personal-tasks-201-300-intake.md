# ChatGPT personal assignment — Tasks 201–300
Status: ACCEPTED / ACTIVE BACKLOG (not implemented by acceptance alone)
Source: user-supplied 100-task master order, 2026-10-16.

## Scope
The user assigned ChatGPT responsibility for tasks 201–300 in ten departments:
- 201–210 project management
- 211–220 game architecture
- 221–230 dungeon master
- 231–240 story and characters
- 241–250 living world
- 251–260 technical development
- 261–270 visual design
- 271–280 continuity and canon
- 281–290 testing and quality
- 291–300 expansion and release

The user's complete original 100-item task wording is preserved in the conversation attachment. This intake is an index, **not** a replacement or a claim that tasks are complete.

## Task namespace reconciliation
- `001–100`: administration master order in `docs/administration-master-100-tasks.md`.
- `101–200`: additional living-world task proposal supplied in the conversation; check whether a canonical GitHub register exists before claiming repository tracking.
- `201–300`: this ChatGPT personal assignment; do not renumber.
- `DP001–DP100`: separate dual-play cross-team proposal in `docs/dual-play-100-task-team-plan.md`; overlaps conceptually with 211–220, 253–259, 287, and 291–299 but is not an extra implementation.
- `docs/task-status.md` is an older *different* 100-task execution-status list; its IDs are not assumed to refer to the new administration master order. Avoid conflating the two lists.

## Five immediate executable priorities
1. **201 — Repository audit:** inspect full tree, browser source, backend FSM, data schema, scripts, and workflows; record tested behavior separately from proposals. Status IN_PROGRESS.
2. **202 — Reconcile backlogs:** preserve all ID namespaces and document duplicates/conflicts. Status IN_PROGRESS (this intake).
3. **203 — Authoritative dashboard:** define a cross-reference index and evidence links. Status TODO.
4. **206 — Decision log:** create an explicit architectural decision record. Status IN_PROGRESS; see `docs/decisions/ADR-0001-dual-play-authority.md`.
5. **281 — Run regression tests:** use repository CI or a checked-out runtime; do not claim passing tests based solely on inspecting source. Status TODO.

## Verified observations (GitHub inspection, 2026-10-16)
- Main branch recursive tree returned 143 entries, not truncated. Entry count includes directories; it is **not** a count of files.
- Browser entrypoints include `game/book1.html`, `game/living-world.html`, `game/index.html`.
- `backend/automaton_fsm.js` is an isolated in-memory FSM, not a deployed game server.
- `.github/workflows/validate.yml` defines Python data/game tests and a Node FSM test.
- Proposed SQLite, Express, WebSocket, Flutter and Discord modules are not verified deployed.
- The latest user request is for two modes of play, with a single authoritative save, not two independent campaigns.

## Acceptance rule
A task is DONE only when an artifact exists **and** its required tests/review evidence exist. GitHub commits establish a change, not a passing runtime test.
