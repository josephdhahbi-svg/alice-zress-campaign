# Moonveil Heroic Scene Contract
Implements Alice's first Silver Courier scene as a portable, pure Node.js contract. Four narrative panels, exactly five choices in fixed order: Lawful Good, Neutral Good, Chaotic Good, Utility, Action. No evil or neutral moral options. The contract validates idempotent command identifiers and optimistic revision before an authoritative engine handles the action.
The contract is a *new* Lego connecting Flutter/ChatGPT presentation to the future transactional command engine; it does not itself save state, generate art, or grant items. The existing Python Living City remains a separate noncanonical prototype. Keep Alice Level 1, all legendary artifacts unowned.
Run tests: node --test backend/services/test_heroicSceneContract.js.
Next: add POST /api/scene/choice authenticated adapter to transactional engine and outbox, with server-side profile ownership checks and optimistic concurrency; connect Flutter buttons and snapshot replay.
