# Architecture decision: one VTT journal

The existing backend/migrations.js and server.js are the authoritative persistence layer. Use vtt_campaign_events with revisions, actor membership, and event IDs.

Do not execute elder-eye/admin/schema.sql or seed.sql against the production VTT: they are isolated drafts and have overlapping campaign/event tables and divergent location IDs. Their presence does not imply deployed state.

The canonical Book 1 scene is data/scenes.json (scene-book01-rabbit-hole-01, location pit-of-ghaunadaur). Do not silently substitute the older admin seed's pit-ghaunadaur ID. Preserve EE-B2-001 in the Visual Codex as a reserved immutable ID; its image binary is not verified in the repository.

The new backend/elder-eye-scene-service.js uses the existing vtt_campaign_events table and rejects unauthorized, stale, duplicate-conflicting or invalid actions. This is a service adapter, not yet an HTTP endpoint. Integration with server.js requires using existing authenticated actor context and broadcastCampaign, not trusting actor IDs from browser payloads.

Test with npm test (root package script includes backend/*.test.js). Do not report green until the test command or CI workflow has actually run and succeeded.
