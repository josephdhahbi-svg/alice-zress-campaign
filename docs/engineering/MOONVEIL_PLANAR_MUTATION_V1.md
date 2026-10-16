# Moonveil Planar Mutation Engine — v1

Status: MOONVEIL_HOMEBREW / PREVIEW_ONLY. Sprint 136.

## Entity
- Name: Planar Mutation Engine
- Type: Read-only environmental narrative forecast
- Purpose: Connect environmental weather hazards to evolving, DM-adjudicated mutation story hooks without modifying character or campaign state.
- Source: `backend/planar-mutation-engine.js`
- Tests: `backend/planar-mutation-engine.test.js`

## Connections
- `backend/planar-weather-engine.js` supplies existing named, plane-matched hazards.
- Future quest bridge may consume `possibleQuestHook` only after explicit DM approval; previews do not write quest evidence.
- No plane access, rewards, mutation points, condition effects, XP, world clock changes, or faction control changes are granted.

## Visual Codex
- Art concept: Eldritch Growth Bloom / Planar Mutation Engine, photorealistic cinematic dark fantasy.
- The generated concept image is a **reference**, not a committed repository asset. It must not be shown as if its illustrative mutation counters, world-map labels, or character depictions were authoritative game state.
- Do not place mutation art in the opening rabbit-hole scene; reserve it for a matching later codex entry or environment.

## Integration decisions
- ACCEPT: immutable previews, weather connections, lore hooks, tests.
- POSTPONE: persistent mutation simulation, planar collapse, autonomous AI effects, live factions, actual mutation dice checks, rewards and UI integration until server-side authorization and timeline consistency are implemented.
- REJECT: silent player transformations or AI-driven campaign state mutation.
