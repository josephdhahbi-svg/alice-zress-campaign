# Omniversal VTT v41 — Production hardening plan

Status: proposed architecture, not a claim of deployed infrastructure.

## Verified repository state (2026-10-15)
- Existing root server.js uses Express, better-sqlite3 WAL, session auth, migrations, backups, WebSocket, and faction integrations.
- The provided automation_100_tasks.js, post_execution_runner.js, and .github/workflows/omniversal-pipeline.yml were not found at their proposed root paths.
- Do not overwrite server.js with the simplified example. Preserve existing routes, auth, WebSocket, migrations, and state.

## Critical defects in supplied sample
1. Task runner tests a stale pendingTasks array after execution, causing an extra scheduled pass. After all tasks pass it may eventually write on a subsequent pass, but its scheduling is fragile and failure handling is synthetic.
2. executeTaskStep fabricates outcomes based on task ID and attempt count; it does not validate infrastructure.
3. Post runner unconditionally labels every phase OPTIMIZED and PRODUCTION_READY.
4. CI runs npm install instead of npm ci, deploys without test gates, and triggers a deploy hook without confirming deployment completion.
5. /health always returns UP in the supplied example, without DB checks. WAL status alone is insufficient to establish DB health.
6. Sentry.Handlers usage depends on SDK major version; do not replace the working server without checking package version and initialization requirements.
7. SQLite WAL and snapshots need a consistent backup strategy; copying only the main database while writes occur is unsafe.
8. Backup restore is a privileged, high-risk operation. Require auth, audit logs, validation, maintenance gating, and rollback; do not hot-swap a live DB connection blindly.
9. Never allow autonomous generated tasks to execute arbitrary commands, edit secrets, or deploy directly. Use an allowlisted task registry and bounded retries.

## Implementation phases
### Phase A — Non-destructive CI baseline
- Inspect package.json scripts and current tests.
- Add read-only verification tasks for DB migrations, foreign keys, WAL, auth, API, WebSocket, and game-state invariants.
- Each task reports actual evidence, elapsed time, status, and failure details.
- Fail closed: no passing audit without all mandatory checks.
- Use bounded retries for transient failures, deterministic backoff, and clear exit codes.

### Phase B — Reliable post-execution audit
- Replace synthetic 100 phase labels with a typed allowlisted registry.
- Record SKIPPED for unconfigured integrations, never OPTIMIZED.
- Produce machine-readable JSON with build SHA, timestamp, checks, failures, and deployment eligibility.

### Phase C — Deployment and recovery
- Add npm ci, test and audit gates, artifact upload, and environment protections.
- Validate Render deploy hook availability; poll deployment status and /health readiness after release.
- Add authenticated S3 backups with retention and periodic restore drills.
- Introduce separate /health/live and /health/ready endpoints. Readiness checks DB SELECT 1 and schema version; avoid destructive probes.
- Protect secrets and use least-privilege credentials.

### Phase D — Observability
- Inspect installed @sentry/node version before instrumentation.
- Attach release SHA, environment, sanitized context; avoid collecting sensitive game/player data.
- Add alerts with thresholds and escalation; test alert routing.

## Release gate
Production readiness is true only when required checks actually run and pass, backups are verified recoverable, security checks pass, and deployed health is observed. Missing integrations remain explicitly UNCONFIGURED.

## Game invariants to test
- Alice Z'ress remains Great Old One Warlock.
- Heroic narrative continuity and chronology records preserved.
- Relic inventory model uses 100 main + 10 secret + 1 ultimate = 111; no unearned rewards.
- Five-choice interactive mode remains available even if narration autoplay is enabled.
- Existing faction and session state survive migrations and backup/restore.
