# U01 Read-Only API Contract v1
Status: proposed interface; no server endpoint implemented.

## Purpose
Expose the versioned scene projection to the browser without exposing write access or direct database access.

## Proposed endpoint
`GET /api/v1/scenes/U01_SILVER_COURIER`

Response: JSON matching `data/alice_u01_read_model_v1.json`. The static fixture remains the local demo source until an authenticated read-only API is available.

## Response rules
- Include `schema_version`, `status`, `scene_id`, `character`, `historical_context`, `choices`, `routes`, `art`, `capabilities`, and `mutates_game_state`.
- Do not include secrets, session tokens, other players' private state, or unrestricted inventory.
- Alice must be Level 1 in the protected baseline; origin gifts are listed as custom origin gifts.
- Unknown DR remains null with `date_precision=unknown`; do not substitute current date or 1495 DR.
- All five choices remain visible but disabled until a separate authenticated command endpoint is approved.
- Route status remains `locked_unverified`; the read endpoint cannot unlock routes.
- Art asset remains planned with null file path until an actual approved image exists.
- The server must derive authorization from the authenticated session, not query/body character IDs.
- Set `Cache-Control: no-store` for private character projection unless a reviewed privacy-safe cache policy is approved.

## Failure contract
Return structured JSON with stable `error.code` and safe `error.message`; never leak SQL, stack traces, tokens, or private records. The UI fails closed: if the response is absent, malformed, wrong schema version, or has unsafe status, keep choices disabled and display a clear read-only error.

## Later command endpoint (not implemented)
A future player choice command must require authenticated campaign membership, allowed choice ID, explicit confirmation, expected revision, idempotency key, server-side prerequisite checks, and atomic event-ledger append. This contract does not authorize implementation of that command yet.

## Acceptance criteria
1. Static fixture validates against this contract.
2. UI renders the same five choices in the same order.
3. Missing/invalid response never enables actions.
4. Read API never mutates saves or grants rewards.
5. Unknown date and locked routes remain visible.
