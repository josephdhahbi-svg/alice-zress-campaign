# Moonveil LEGO Event Bridge
The new eventBridge.js connects the prior audioRegistry.js and dissonanceRules.js to a single committed-event contract. It is a pure adapter; it does not write to the database, trigger AI prompts or publish messages itself. Integrate only after an authenticated rules engine has committed an event.
- PLANAR_SHIFT_EVENT -> optional spatial audio cue for a known plane
- DICE_ROLL_EVENT -> optional natural-20 audio cue when rules engine marks it a critical success
- COMBAT_DAMAGE_EVENT -> dissonance projection + read-only update notification
- QUEST_EVENT / NPC_RELATIONSHIP_EVENT -> event delivery unchanged
- All messages include schemaVersion Omni-Engine V8.0 and event/command/actor IDs.
Run: node --test backend/services/test_eventBridge.js
Caveat: a client must not be able to set committed=true. The adapter belongs behind a trusted event-ledger reader. Dissonance projection should be persisted in the same transaction that commits damage, not by the broadcast adapter. Audio keys do not guarantee actual media files. Level 21+ systems remain locked for Level 1 Alice.
