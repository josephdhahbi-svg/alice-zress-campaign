# Moonveil Team Meeting 11 — Gemini + Copilot integration review
Status: **REVIEWED USER-SUPPLIED DELIVERIES — NOT OPERATIONAL**.

## Gemini delivery
Claims ten components implemented/tested, but supplies concrete code only for dice roller, quest decision router, voice controller, and a three-test Jest suite. No executable test logs or verified GitHub implementation paths supplied. Treat all claims of tested status as **unverified**.

- Dice roller uses `crypto.randomInt` and advantage/disadvantage, but lacks modifier/type bounds, command authorization, persisted roll events, and ruleset provenance. A pure dice helper is acceptable as a proposed LEGOS piece, not a complete auditable dice service.
- Quest router has no authentication or character ownership checks, optional expected revision, timestamp-derived event IDs, hardcoded `1495 DR`, no verified quest choice allowlist or prerequisites, no player confirmation, no stable response replay on duplicate idempotency key, and no state-revision compare-and-swap. Query checks decisionKey only by character, not quest/campaign. **REJECT for live commands.**
- Voice endpoint trusts client `explicitConsentGiven`, lacks auth/verified consent and says 'received' while not persisting. **HOLD**. No voice logging enabled.
- Jest tests only cover a dice calculation, duplicate decision and stale revision; no auth, consent, concurrency, rollback, cross-campaign, unknown DR, choice allowlist, reward protection or real save/reload tests. Tests not independently run.
- No universal historical epoch. Character `CHAR_ALICE_M11` is a synthetic fixture and must not be confused with protected `CHAR_ALICE_ZRESS`.

## Copilot delivery
Received a WorldOS **proposal**, not verified source records or running software. It includes proposed location/NPC/faction contracts, one fictional cavern, a courier named Vellrae T'sarran, faction motivations, and preview interfaces.

- Map proposed `id` to `entity_id`; use `canon_status` and existing values `official_verified`, `homebrew_approved`, `crossover_approved`, `unverified`, rather than inventing `verified/homebrew/uncertain` enum values.
- `Cavern of Whispering Webs`, `Vellrae T'sarran`, and `Courier Guild` are **unverified homebrew proposals**, not canon or approved in-game entities.
- Proposed `U01_SilverCourier` must map to protected `U01_SILVER_COURIER` (avoid duplicate quest IDs).
- Named canonical districts and sanctuaries require source/edition/DR verification. No assumed travel times, routes, political events or schedules.
- Faction relationships must be time-scoped and sourced; avoid treating simplifications as canonical universal relationships.
- NPC schedules need date precision, plane/calendar context, exceptions, event gates and provenance.
- Copilot's text says 'accepted/integrated', but provides no code, test or GitHub evidence. It remains **design input**.

## Shared integration decisions
- Definition registries are versioned and source-grounded; event ledger authoritative only for mutable gameplay history; WorldOS projections are read-only and rebuildable.
- Alice remains Level 1 GOO Warlock, Ghaunadaur patron, gifts Shield/Acid Splash/Light, all five U01 options unselected.
- No mutations, reward grants, route unlocks, immutable-event deletion, voice recording, or deployment.
- First next steps: implement auth + mandatory idempotency and CAS; synthetic chronology/geography/traversal tests; responsive read-only U01 UI; verified canon audit; independent test run.

## Questions to Gemini
1. Where are the complete actual source files for `database.js`, `authGuard.js`, `commandService.js`, and migrations?
2. Can you demonstrate an unauthorized cross-campaign decision rejected before any mutation?
3. Can you remove hardcoded DR and require verified date precision?
4. Can duplicate command IDs return exactly the same committed result without duplicate side effects?
5. Can you provide full reproducible test logs and failing negative cases?

## Questions to Copilot
1. Which source/page and DR range support each named Underdark district and sanctuary?
2. Can every proposed NPC/location carry existing `canon_status` enum, `entity_id`, `source_reference`, and unknown-date gates?
3. Can you supply synthetic negative fixtures for nonexisting locations, wrong plane, closed routes and invalid book traversal?
4. Can you preserve U01_SILVER_COURIER as the only quest ID?
5. Can you provide read-only projections without inventing operational travel or postal availability?

No independent tests executed as part of this review.
