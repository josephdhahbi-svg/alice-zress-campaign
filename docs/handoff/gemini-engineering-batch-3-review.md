# Gemini Engineering Batch 3 intake review

Status: **REVIEWED DESIGN INPUT ONLY — NOT INTEGRATED**.
Source: user-pasted `MOONVEIL UNIVERSE VTT: ENGINEERING BATCH 3 — REAL-TIME VOICE WEBHOOKS & AI DM NARRATIVE GENERATOR` (2026-10-15).
Claimed `npm test` success is **not independently verified**. No logs, checkout or reproducible run supplied.

## Components
- `backend/db/migrations/batch3_schema.sql`: proposed `voice_session_logs`, `ai_narrative_templates`.
- `backend/routes/voiceWebhooks.js`: proposed transcript insert and outbox record.
- `backend/services/aiNarrativeEngine.js`: proposed template lookup and string interpolation; **not an AI model invocation**.
- `backend/tests/batch3.test.js`: two proposed Jest tests, not independently run.

## Blockers
1. POST `/log-transcript` has **no authentication or ownership/campaign authorization**; a caller may submit transcripts under another character ID.
2. No explicit participant consent, opt-in, disclosure, retention policy, deletion procedure, or privacy isolation for voice/transcripts.
3. Outbox payload contains the full transcript; no recipients, access policy, redaction or encryption specified. Never broadcast transcript content by default.
4. Generated IDs use `Date.now()` plus 3 random base36 characters (collision risk); outbox ID only `Date.now()` (collision risk). Use collision-safe IDs and idempotency.
5. `outbox_events` dependency is not created in supplied migration; actual backend foundation is unverified.
6. Schema defines `realm_context`, but test creates and inserts `realm_name`; narrative query will fail on the test table.
7. Narrative engine hardcodes fallback **1495 DR** (forbidden as universal epoch) and assumes `corruption_stacks`; use verified timeline/date precision and optional character fields.
8. Narrative engine returns a template with a prefix, not generated AI narration. Label as template renderer, not generative AI.
9. No checks on transcript size, encoding, sample rate, supported codec, payload types, rate limits or abuse handling.
10. No prompt-injection boundary: transcripts and user text must be treated as untrusted narrative inputs, never commands.
11. No actual audio ingestion, transcription service, or voice webhook signature verification despite the feature name.
12. Tests omit authentication, consent, outbox failure/rollback, replay, idempotency, transcript privacy, rate limits and cross-campaign isolation.
13. SQLite foreign-key cascade deletion conflicts with immutable history design; distinguish ephemeral private transcript storage from append-only audit/event metadata.
14. The test fixture's `I cast fireball` is not a legitimate Level 1 Alice spell action; treat as untrusted sample transcript, never gameplay execution.
15. Do not infer successful `npm test` from the supplied narrative; obtain logs and a runnable checkout.

## Integration decision
**HOLD** production voice/AI DM features. First complete authenticated commands, event ledger, secure saves and Alice U01 read-only interface. Accept only a safe, consent-aware design contract and optional pure, read-only template preview later.

## Gemini next delivery request
Provide corrected schema and read-only narrative template renderer; no recording until consent and authentication exist. Tests must demonstrate missing-consent denial, unauthorized/cross-campaign denial, unknown DR fallback, untrusted transcript isolation, outbox failure rollback and schema consistency. Do not activate recording or mutate Alice.

## Evidence
This review documents code as pasted by user, not code verified in GitHub. No tests executed as part of this review.
