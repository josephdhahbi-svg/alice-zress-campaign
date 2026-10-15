# Gemini Omni-Engine Intake Review — 2026-10-15

Status: REVIEWED PROPOSAL, NOT MERGED. Source: user-pasted Gemini Express/SQLite/Flutter prototype. Do not represent it as tested or operational.

## Retain as design candidates
- Express, Socket.IO, SQLite WAL as potential server stack; evaluate against existing repository before adopting.
- Flutter/Provider mobile client and route query screen.
- Transit hazard states, narrative dialogue graph, character/item/monster schemas as ideas.

## Blocking problems in supplied sample
1. Pathfinding unconditionally creates reverse links even for one-way/time/planar routes.
2. Route requirements/DC, chronology, operational status, and character permissions are not enforced.
3. Route metadata selects `route_name` but outputs `details.routeName` (undefined).
4. `/api/crafting/forge` returns an unearned Singularity Core unconditionally.
5. Flutter `triggerForge` grants +5 local resonance regardless of server-side authorization.
6. CORS wildcard, no authentication/authorization, no save revision checks, no transaction handling for reward grants.
7. Flutter `http://localhost:3000` won't connect to a different host from most physical phones.
8. Proposed `backend/db/moonveil_vtt.db` does not match code's `backend/moonveil_vtt.db`; database binaries and private saves must be ignored by Git.
9. Transit sample is an asserted Netheril-to-Icewind Dale service without verified era, geography or operational status.
10. `findMultiversePath` searches book names rather than stable book/location IDs; ambiguous chronology.
11. Client ignores response `success` and displays `totalHops` even for failures.
12. No tests or verified dependencies/package manifests supplied.

## Architecture decisions
- Treat prototype as independent Lego, not current authoritative repository state.
- Preserve dev branch `dev/alice-three-chosen-roadmap` and existing atlas schema; adapt code via reviewed migration instead of replacing.
- Transport graph is directed; only operational, authorized, chronologically valid edges may be traversed.
- The server, not Flutter, owns resources, rewards, inventory, movement and private messages.
- Any forge endpoint must validate item recipes, prerequisites, inventory, costs, player confirmation and revision/transaction state; return no default rewards.
- Separate public worldbuilding datasets from private game saves; no actual player communications in public source control.
- Add integration tests before allowing any route, crafting, or player state mutation.

## Division of labor
ChatGPT: project management, visual direction and production of requested art assets (portraits, scenes, maps, monsters, equipment, UI illustrations), architectural integration and review.
Copilot: backend, Flutter client, database migrations, validation, testing, security and UI implementation.
Gemini: lore, chronology, geography, character/dialogue/quest writing, source research, schemas and documentation. Both may write code and UI layout specifications, but should not rely on generating images.

## Next integration steps
1. Audit existing repository tech stack and file structure before choosing Express/Flutter implementation.
2. Add tests for one-way routes, time gates, route locks, hazards, and non-granting forge.
3. Design server-authoritative API contracts and typed Flutter DTOs.
4. Build sample routes as **proposed/locked** only; no automatic unlock.
5. Develop visual asset manifest with placeholders until art is intentionally generated.

Player state: Alice Z'ress Level 1 and all player choices remain unchanged.
