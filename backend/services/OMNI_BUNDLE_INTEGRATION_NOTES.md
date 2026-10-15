# Copilot/Gemini Omni-Engine bundle — Integration review
2026-10-15. The user supplied code for database backup scheduler, ambient audio router, sector audio emitter, combat damage webhook, Flutter socket sync, health badge and DM soundboard. This is a partial pasted bundle, not proof of a complete repo.
## Newly integrated code
- audioRegistry.js: symbolic sound keys, plane-to-track mapping, validated non-authoritative SPATIAL_AUDIO_EVENT. No unverified CDN URLs.
- dissonanceRules.js: pure 0–100 clamped projection from already committed combat damage; rejects negative damage, invalid types and uncommitted events.
- 13 Node built-in tests executed locally and passed. Source of the test harness is in the conversation working package, not yet in GitHub.
## Repairs needed before server integration
1. Backup: use better-sqlite3 backup API and encrypted, access-controlled external storage with restore drills. Avoid publishing personal game saves into GitHub main. Add retention and cleanup for failed backups.
2. Audio: use verified licensed assets or locally bundled files; avoid placeholder CDN URLs and broadcasting to unauthenticated global clients. Register divine choir asset only when real.
3. Combat: don't accept client-authoritative damageAmount/damageType; validate engine-generated committed damage event. Don't silently create an 'Unknown Adventurer' on arbitrary POST. Persist dissonance projection within the same command transaction, then broadcast after commit.
4. Socket: Flutter must not mark connected until handshake succeeds; cancel reconnection timers on disconnect, bound exponential backoff, authenticate subscriptions and request missed events by sequence number.
5. Soundboard: Android emulator localhost is not host localhost; configure API endpoint by platform, authenticate requests and show failure states. Volume and mute are user controls.
6. Audio cues and dissonance are not themselves authority to award artifacts, advance Alice, or trigger L21 features.
## Integration next
Wire audio registry to committed PLANAR_SHIFT_EVENT; project dissonance within transactional combat command; add authenticated websocket room broadcast and Flutter read-only event handling; write end-to-end tests.
