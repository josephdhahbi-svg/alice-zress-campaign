# Copilot Master 100-Task Assignment — ChatGPT Integration Review

Status: **REVIEWED AS A TASK ASSIGNMENT, NOT AS A COMPLETED WORLDOS DELIVERY**.
Source: user-pasted Copilot/relay response. No new WorldOS code or test evidence was supplied in that response.

## Assessment
The assignment is useful as a dependency-ordered backlog. Tasks 1–10 are still proposed until Copilot inspects the repository and supplies actual inventory. The relay's statement that the list of five Underdark locations is "source-verified" is not substantiated by source citations, edition/page references, DR date ranges, or current registry records.

## Verified against current repository
- `data/master_roads_atlas.json` identifies itself as `seeded_design_graph`, and its 30 book slots have null titles/dates, empty route arrays, and `unassigned_placeholder` source status. It explicitly says book slots are not assigned authoritative titles and must not be mapped to published adventures until the roadmap is verified.
- `data/living_world_integration_schema_v1.json` is marked `PROPOSED_NOT_OPERATIONAL`; it defines shared fields including `entity_id`, `canon_status`, `source_reference`, timeline/plane/location IDs, DR bounds, date precision, and fail-closed availability.
- Existing schema source statuses are `official_verified`, `homebrew_approved`, `crossover_approved`, and `unverified`. Do not replace these with `verified/homebrew/uncertain`.
- `docs/architecture/alice-u01-read-only-slice-v1.md` keeps U01's DR date unknown, all five choices unselected, routes locked/unverified, and the portrait planned.
- Alice remains Level 1, Great Old One Warlock, Ghaunadaur patron, Eilistraee influence, gifts Shield/Acid Splash/Light.

## Required corrections to the relay review
1. The named shortlist — Menzoberranzan, Silken Paths, Wormwrithings, Dark Dominion, Blingdenstone — is **not verified by the pasted response**. Each needs source references and date/era availability before being promoted to `official_verified`.
2. The response says "NPC schedules (unverified)" can be safely delivered. They may be displayed only as explicitly unverified proposals; do not represent them as historical facts or live availability.
3. Stable IDs should follow existing registry conventions and current schema, not impose a new lowercase snake_case migration without reviewing existing IDs.
4. Relationship names and entity types must extend the existing contract rather than silently replacing it.
5. No claim of integration, testing, or accepted canon is warranted until files, provenance, and test evidence are delivered.

## Integration decisions
- Accept the 100-task structure as Copilot's backlog proposal.
- Do not accept it as proof that Tasks 1–10 were executed.
- Ask Copilot to deliver the actual repository inventory first, with file paths, field names, current validator behavior, and source citations for every proposed U01 location.
- Require a small synthetic fixture pack for unknown date, wrong plane, closed route, invalid relationship, and traversal-boundary cases.
- ChatGPT retains final review and UI/art integration; Gemini owns mutable game state and command authority; Copilot owns source-attributed WorldOS definitions and read models.

## Next five actions
1. Copilot: actual repository audit and source-attributed U01 location shortlist.
2. Gemini: complete authenticated read-only projection and secure command/event-ledger source files.
3. ChatGPT: validate the JSON read model and HTML fail-closed behavior.
4. Run exact tests from a complete checkout; do not rely on reconstructed tests as a full-suite result.
5. Create the first approved Alice portrait and register it only after the image file actually exists.

No game state was changed. No tests were executed as part of this review.
