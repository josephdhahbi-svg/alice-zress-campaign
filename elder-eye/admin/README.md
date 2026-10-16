# Elder Eye administrative foundation

Development branch only. No production migration has been run.

## Setup
Install `better-sqlite3` in the existing Node backend if not already present. Initialize the database with `schema.sql` then `seed.sql`. Inject the resulting connection into `createElderEyeEngine(db)` from `engine.js`.

## Rules
- Alice Z'ress is the established Level 1 Drow Great Old One Warlock, Acolyte.
- Shield (Mystra), Acid Splash (Ghaunadaur), Blade Ward (Eilistraee) are campaign-specific gifts, not automatically normal spell-slot entitlements.
- Unknown HP, AC, inventory and ability usage limits remain NULL or unverified; never fabricate them.
- EE-B2-001 identifies The Sunken Spire Gate. Image generated in chat but not yet imported into repository.
- Art must be photorealistic, cinematic, and never anime/cartoon.
- Decision order: 1 Lawful Good, 2 Neutral Good, 3 Chaotic Good, 4 Utility, 5 Action.
- Canon metadata distinguishes official D&D, campaign adaptation, homebrew and unverified.
- Preserve event chronology; add migrations instead of dropping tables.

## Next development steps
1. Review existing server structure and integrate routes without breaking legacy APIs.
2. Add transactional quest, inventory and combat modules.
3. Implement VTT scene JSON contracts and location/asset resolver.
4. Add validation tests and backup/restore procedures.
5. Connect visual codex source files and audit remaining book titles.
6. Only after testing, merge the branch and migrate the deployed database.
