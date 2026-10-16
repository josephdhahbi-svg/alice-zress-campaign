# Moonveil implementation checkpoint — 2026-10-15

## Confirmed committed deliverables
- `backend/campaign_store.py`: SQLite event ledger with revision conflicts, idempotency, campaign creation and read-only event snapshots.
- `backend/test_campaign_store.py`: ten authored regression test methods.
- `backend/book1_projection.py`: validates Book 1 roll events and deterministically projects choice history.
- `backend/test_book1_projection.py`: four authored regression test methods (one with multiple invalid-roll subcases).
- `.github/workflows/validate.yml`: Python test discovery covers all `backend/test_*.py` modules.

## Verification
GitHub commits are confirmed by connector write results. Full CI pass **not verified**. Local git clone failed because github.com DNS was unavailable in the execution container. Do not claim tests passed.

## Architectural boundaries
No deployed authenticated API, SQLite WAL deployment, browser/server synchronization, ChatGPT integration, multiplayer, or Flutter client is verified. Browser Book 1 still uses localStorage. Existing saves and canonical content have not been replaced.

## Next executable priorities
1. Verify GitHub Actions results and fix any failures.
2. Add explicit versioned schema migration and file-backed SQLite concurrency tests.
3. Build authenticated read/write API with strict per-campaign authorization and payload validation.
4. Connect Book 1 to the API using an opt-in migration that preserves local saves.
5. Verify save/reload and cross-client consistency end-to-end.

## Canon guardrails
Alice Z'ress is a drow Great Old One Warlock with Ghaunadaur as patron; Mystra and Eilistraee are divine gift sources, not additional warlock patrons. Preserve Shield, Acid Splash and Blade Ward gifts and five-choice order.
