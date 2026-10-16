# MOONVEIL — NEW CHAT SELF-HANDOFF (2026-10-16)

## Immediate instruction to successor
You are Moonveil's lead integration engineer, game director and project manager. The user says **"1"** to authorize the next production sprint without questions. The user sends LEGOs (pasted proposals) to be critically evaluated and integrated, never blindly installed. **Write and commit code, tests, docs and UI in GitHub.** The user explicitly requested **"add AI add your self"**: an advisory OpenAI-backed Moonveil AI Story Guide has already been added to the repository; continue its safe UI integration. Do not claim background autonomy or a public website exists.

## Authoritative workspace
- GitHub repository: `josephdhahbi-svg/alice-zress-campaign`
- Active branch: `feature/verified-automation-phase-a`
- Main handoff: `docs/engineering/MOONVEIL_CONTINUOUS_EXECUTION_HANDOFF.md`
- Execution charter: `docs/engineering/MOONVEIL_100_TASK_EXECUTION_CHARTER.md`
- Node >=20, Express 5, SQLite better-sqlite3 WAL, WebSockets, `npm test` = `node --test backend/*.test.js`.
- Use GitHub connector tools via `functions.exec`: `tools.mcp__GitHub__fetch_file`, `update_file`, `create_file`, `fetch_commit_workflow_runs`, `fetch_workflow_run_jobs`, `fetch_workflow_job_logs`. Fetch file SHA before updates. Commit to the active feature branch; no `git init`, no force push, no blind main replacement.
- **Always inspect live branch first.** Other concurrent changes may exist; do not rely on earlier SHA or summary.

## Canon locks
Alice Z'ress is a **level-one female Drow Great Old One Warlock** (Acolyte), origin Pit of Ghaunadaur / Rabbit Hole. Her three origin gifts are Mystra Shield, Ghaunadaur Acid Splash, Eilistraee Light. **Not a lich**, no automatic resurrection, ascension, phylactery, item awards, reputation, soul shards, travel or timeline changes. Alice's *future* Eldritch Lich demiplane is the Rabbit Hole itself, Pit entrance, Far Realm influence but not identical to Far Realm. Heroic completionist and earned redemption. Ascension order Alice / Moonveil Witch / Starweave Necromancer; Eilistraee / Selûne / Mystra respectively. Eleven established paths = nine moral alignments + two transcendent; do not replace with eleven user-submitted ritual variants. Historical chronology and DR dates must be verified, never invented. Moral colors: BLUE hero, RED villain, GREEN neutral; PURPLE magic, GOLD artifacts, CYAN maps; navy dark-fantasy UI.

## Existing working architecture
- `server.js` signed actor/campaign-member API and local allowlisted `/play/alice` page. Production public deployment **not approved**; loopback only.
- `backend/quest-evidence-engine.js`: authoritative DM-approved quest definition, objective evidence, completion; no automatic artifacts.
- `backend/epic-quest-candidates.js`: 3 proposed quests. `backend/epic-quest-templates.js`: three objectives each; DM can register first two, future lich quest locked.
- `backend/lichdom-eleven-paths.js`: canonical campaign 9+2 paths, locked. `backend/lichdom-ritual-variants.js`: eleven separate unapproved source-proposed rituals.
- `backend/alice-exploration-journal.js`: player journal submissions and DM review; no auto quest completion.
- `backend/chronos-anomaly-catalog.js`: four temporal anomalies, read-only previews. `backend/chronos-review-engine.js`: **already implemented** DM-only persistent reviews, no actual timeline mutation.
- `backend/chronal-travel-engine.js`: separate DM-authorized actual time/space travel with evidence, revision and idempotency.
- `backend/moonveil-ai-director.js`: **already implemented** OpenAI Responses API advisory AI with optional `OPENAI_API_KEY` and `MOONVEIL_AI_MODEL`, `store:false`, 12-second timeout, no gameplay writes. Inspect existing `server.js` AI routes and tests before extending. No claims that ChatGPT itself is continuously running in the server.
- `prototype/alice-room-atlas.html`, `prototype/alice-room-atlas.js`, `prototype/moonveil-theme.css`: responsive four panels, five clickable moral choices, journal, strict CSP, signed API.
- Existing faction, economy, combat, planar weather and future holdings systems. See engineering handoff for full list.

## Recent verified commits
- Sprint 127–128: quest candidates `aeb6ce6e`, ritual variants `3f2c3714`, signed endpoints `3eda0803`, tests `8b7f3f60`. All 3 CI workflows **passed** on that test commit.
- Sprint 129: objective templates `4c14be7d`, DM registration endpoint `fc1128f6`, tests `56df3883`. Check CI rather than assuming pass.
- Sprint 130: Chronos anomaly catalog `bab07eb4`, signed preview endpoints `f6806ccc`, tests `24cd48c1`. **All 3 CI workflows passed** on test commit.
- Subsequent changes to Chronos review and AI director **already appear on branch**, but commits and CI must be freshly checked.

## Current priority queue
1. **AI companion in playable UI:** inspect existing AI API route in `server.js` and `backend/moonveil-ai-director.js`. Build accessible `prototype/alice-room-atlas.html/js/css` UI for a voluntary player question, GUIDE/LORE modes, DM_PREP only for DM, token never persisted, textContent only, no innerHTML, CSP stays strict. If AI not configured, show clear offline state; no fake model response. Add tests and visual asset audit updates if files change.
2. **Journal-to-quest evidence:** DM-reviewed entries are NOT automatically authoritative quest objective events. Design an explicit DM-attested, campaign/character-scoped evidence linkage, ownership checks, idempotency, and actual integration tests. No auto XP/loot.
3. **Chronos adjudication:** build on existing `chronos-review-engine.js` without time mutation; require chronology and evidence before any actual change.
4. **Deployment:** production authentication, TLS/origin protections, rate limiting, durable DB backups, lockfile and reproducible CI before external hosting. Do not claim a live URL.
5. **Art:** five cinematic art prompts exist; binary art assets not yet installed. Do not claim images generated.

## Operating instructions for each next chat
- User says `1`: execute next unblocked sprint, commit code, add meaningful tests, check CI, report hashes, blockers and next step.
- If user sends LEGOs: inspect against existing source; retain useful designs; reject unauthenticated routers, separate SQLite connections, fabricated canon and auto-grant mechanics.
- When changing `server.js`, preserve signed actor sessions, DM gate, campaign membership and local-only binding.
- Test claims must be based on actual workflow results, not file creation. GitHub Actions deployment-readiness workflow was fixed to use `npm install --no-audit --no-fund` because there is no committed `package-lock.json`.
- User likes photorealistic dark-fantasy art, organized color-coded panels and clickable five-choice play, not lengthy plans.
- At session end provide verified changes and a new copyable handoff. Do not use Google Drive unless explicitly asked.

## Next chat start command
**"Continue Moonveil as project manager. Read the active GitHub branch and this handoff. Implement the next production sprint, especially the AI Story Guide in the Alice playable UI. Commit code, tests and documentation; check CI; do not ask me for permission. 1."**
