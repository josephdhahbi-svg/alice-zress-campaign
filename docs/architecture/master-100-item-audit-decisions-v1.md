# Moonveil 100-item master audit: decisions and 25 architecture answers

Status: **requirements intake, not proof of implementation**. Source: user-pasted Gemini comprehensive checklist, items 1–100, received 2026-10-15. Existing handoff and architecture files were read from the development branch. No code execution or database inspection occurred in this review.

## Audit dispositions

- **Items 1–8:** ACCEPT AS REQUIRED DESIGN, verify implementation; WAL/foreign keys per connection, immutable event ledger, atomic commands, idempotency, four distinct clocks, multi-era timeline, Alice Level 1. Reject a universal 1495 DR default. Netheril dates must be verified by source; Karsus's Folly at −339 DR, not a generic 3000 BCE epoch.
- **9–19:** ACCEPT WITH CONDITIONS. Backups must be encrypted, verified, recoverable, and retention policy approved; 14 copies alone is not sufficient. CI is welcome but use currently supported Node versions rather than assuming 18 is still supported. Production deploy is HOLD. Snapshot restore is a privileged compensating event. SQLite has one writer; avoid misleading claims of general connection pooling.
- **20:** REJECT as written: no routine deletion of immutable gameplay events. Allow bounded retention for operational logs only, subject to legal/security policy.
- **21–25:** ACCEPT; index, validation, error envelopes, test isolation, actual concurrency tests (not merely Jest --runInBand).
- **26–38:** ACCEPT AS CORE SECURITY CONTRACT; enforce authenticated, idempotent, revision-checked event commands and fail-closed temporal portals.
- **39–50:** MIXED; auth, server-side dice, crafting, and postal previews are relevant. Weather, alignment, shifts, hazards, resonance and encounters are proposed homebrew requiring source classification, bounded mechanics and player consent. Do not conflate five narrative choice options with a mechanical alignment meter.
- **51–56:** ACCEPT AS FUTURE WORLDOS DESIGNS, not implemented.
- **57:** HOLD: recording voice/transcripts requires consent, privacy controls, retention rules, and a working supported integration.
- **58–61:** ACCEPT AS DESIGNS; quest branching and narrative generation may suggest options but cannot execute player choices.
- **62:** REVISE: official monster CR and stat blocks cannot be silently rewritten by an arbitrary formula. Optional scaling is explicitly homebrew preview.
- **63–74:** ACCEPT OR STAGE as read-only modules first; cron world mutation and automatic planar shifts are HOLD until policy/consent. No unverified ChatGPT webhook endpoint.
- **75:** HOLD: no unattended Git commit/push automation without separately approved workflow.
- **76–100:** Architecture questions answered below; answers are design recommendations, not deployed features.

## 25 answers (original item number)

76. One authenticated command service writes ledger/outbox in a transaction; Socket.IO rooms receive versioned event notifications after commit, never independent game mutations. Send small payloads and request snapshots when gaps occur.
77. Cache immutable lore JSON and book indexes by content hash and version, using bounded in-memory cache/CDN for public art; invalidate by release/version. Do not cache private save state across campaigns.
78. Offline Flutter queues only user-intent commands with UUID/idempotency key and expected revision; no locally authoritative spell casts. Reconnect revalidates resources and prompts user on conflict.
79. Encrypt private saves at rest with authenticated encryption (e.g. AES-256-GCM) using managed keys, TLS in transit, access controls, rotation, and separate backup encryption. Never store private saves in a public repo.
80. AI DM consumes minimal redacted, consented state projections from the event stream; tone policy is server-derived, never from untrusted webhook content; player choice remains human.
81. Use numbered forward-only migrations within SQLite transaction when possible, pre-migration verified backups, integrity checks, and tested restore/roll-forward procedure; no automatic destructive rollback after partial external side effects.
82. Campaign ticks and historical DR are shared game clocks; UTC is audit/scheduling only. Player time zones affect display and session schedules, not chronology.
83. Start with bounded per-room buffers (e.g. 256 events or 1 MiB, 5-minute TTL), instrument drops and tune under load; never substitute ring buffer for durable ledger.
84. UI shows provisional dice animation only; final rolled number and resource deduction appear after signed/server-confirmed event. Show retry/error without inventing a result.
85. Faction changes require explicit causal world events and bounded policy rules; cron may propose or schedule but not silently override player-driven territory without an approved simulation mode.
86. Namespace and version homebrew rule sets by campaign; validate prerequisites, typed state schema and edition-specific mechanics; changes create audit events, not table mutations without migration.
87. Run SQLite online backup safely, verify integrity_check and restore into disposable environment, compare manifest/hash and backup age; alert on failure before retention pruning.
88. Return stable error codes with structured missing prerequisites (e.g. PORTAL_KEY_REQUIRED), localized-safe text, no hidden spoilers or sensitive inventory disclosure.
89. Store versioned, reviewed item catalogs per edition/source/book, stable IDs and migrations, release tags and immutable content hashes; reference catalog version from saves.
90. Transactional outbox, per-destination exponential backoff with jitter, bounded attempts, circuit breaker, deduplication and dead-letter state; do not assume ChatGPT UI offers a public webhook.
91. Instrument SQLite query timings and EXPLAIN QUERY PLAN, better-sqlite3 trace wrappers and OpenTelemetry metrics; watch busy time, WAL checkpoint latency and slow query percentiles.
92. Resonance recovery is custom homebrew: define campaign-specific rule table, explicit plane modifiers, rest duration and caps; no automatic effects until approved.
93. Visual Codex is presentation only; encounter selection must derive from verified location/era/biome tables, never infer canon monster spawn rates from artwork.
94. Use per-test :memory: databases or isolated temp DB files, deterministic fixtures, no real save seeds, distinct ports, and teardown; parallel workers must not share mutable fixtures.
95. Immutable event ledger is structured business truth, not debug logs. Use separate operational INFO/WARN/ERROR logs with redaction; never suppress or delete audit events based on log level.
96. Postal interception risk should depend on route danger, security, weather and faction control, not simply character level; cap probabilities and publish formula as optional homebrew.
97. Apply identity/campaign/IP rate limits, separate expensive-command quotas, payload size limits, burst controls, idempotency, and graceful 429 retry guidance; tune using load tests.
98. Model quest stages as versioned directed graphs with prerequisite and exclusion events; explicit choice branches, deadlines, idempotent transitions and missable consequences.
99. Present five ordered choices as player decision buttons (Lawful Good, Neutral Good, Chaotic Good, Utility, Action); do not automatically map them to a hidden alignment score. Show confirmed consequences separately.
100. Gemini: secure backend contracts and tests; Copilot: WorldOS, OpenAPI and continuity test matrices; ChatGPT: integration review, D&D canon, Visual Codex, dev-branch commits. Batch 3 voice/AI is design-only until privacy, security, and authoritative event flow are validated.

## Immediate acceptance gates
1. Verify actual files and run all existing validators in a complete checkout.
2. Build versioned, isolated SQLite migration/ledger test harness with no real Alice seed.
3. Integrate authenticated read-only previews, then command transactions.
4. Do not deploy, run background world mutations, auto-push Git or delete immutable events.
5. Record tests and commit SHAs honestly in master handoff.
