# Sprint 132 — AI CI repair and evidence boundary

## Committed changes
- AI Story Guide model validation now accepts dotted OpenAI model identifiers while rejecting unsafe whitespace and path-like values.
- Added regression tests for model identifier validation.
- Existing signed AI UI status checks and disconnect-generation isolation remain in place.

## CI root cause
The previous deployment-readiness and omniversal test jobs each passed 134/135 backend tests. The failing test was `AI provider response is advisory, bounded and not a game command`, throwing `INVALID_AI_CONFIGURATION` because `gpt-4.1-mini` did not match the former model-ID pattern. New workflow results must be checked before declaring success.

## Journal-to-quest integration decision
**Postpone direct event creation until a DM-attested linkage transaction and HTTP integration tests are implemented.** The exploration journal's `ACKNOWLEDGED` status is not quest proof. The quest engine requires a `QUEST_OBJECTIVE_VERIFIED` campaign event matching campaign, character, quest, and objective, plus quest registration/approval. A future bridge must:
1. Require signed DM membership and check the target character's campaign and owner.
2. Require an ACKNOWLEDGED journal entry from the same campaign, and retain its original submitting actor.
3. Bind one journal entry to an explicitly selected character/quest/objective with immutable evidence ID, DM attestation, and transaction-safe idempotency.
4. Reject cross-campaign linkage, unapproved quests, mismatched objectives, duplicate conflicting linkage, and forged journal ownership.
5. Call the existing authoritative quest verifier; never award XP, loot, ascension, travel, or timeline changes automatically.

## Next sprint
Finish CI verification, then implement and test the explicit journal evidence bridge with no new gameplay rewards.
