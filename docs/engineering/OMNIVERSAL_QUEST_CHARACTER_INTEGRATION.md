# Omniversal Quest and Character Integration

## Implemented
- 300 authored side-quest drafts in `data/quest-packs` (100 regional stories, 100 wave-2 chain stages, 100 wave-3 consequence stages).
- Ten persistent chain identities with ten recurring cast members each (100 total).
- `data/characters/omniversal-chain-roster-100.json`: proposed level-one NPC stat sheets, six ability scores, armor class, HP, skills, equipment, narrative roles, timeline fields, and linked quest IDs.
- `backend/omniversal-quest-character-catalog.js`: validates links from all 100 characters to the 200 quests in waves 2 and 3; exposes safe read-only copies.
- Signed campaign-member GET endpoints:
  - `/api/campaigns/:campaignId/omniversal/characters?limit=100&offset=0`
  - `/api/campaigns/:campaignId/omniversal/characters/:characterId`
  - `/api/campaigns/:campaignId/omniversal/quests?limit=100&offset=0`
  - `/api/campaigns/:campaignId/omniversal/quests/:questId`
- `backend/omniversal-memory.js` separately records DM-attested campaign memories by trilogy, book and traversal.

## Design boundaries
- The 100 sheets are **homebrew NPC draft templates**, not verified official monster stat blocks or player-character sheets.
- Species, spell lists, damage, challenge rating, alignment, encounter balance and advancement remain unresolved. Do not auto-apply the draft level to a character.
- The catalog is read-only. It does not spawn NPCs, start quests, award XP, mutate inventories, or advance time.
- Earlier 100 regional quests are linked to the wave-2 chains through `previousQuestId`, and wave 3 points back to wave 2. The 100 cast sheets link to waves 2 and 3; regional quest-giver sheets are a separate future task.
- DM-attested memories are not yet automatically connected to quest outcomes, NPC dialogue, or the catalog. Authoritative evidence checks and NPC knowledge propagation are future integrations.
- All chronology remains pending DR-era verification and all rewards require DM approval.

## Next content/engineering priorities
1. Build the regional quest-giver roster and link wave-1 NPCs to waves 2 and 3.
2. Replace placeholder attacks and spells with role-appropriate, level-balanced mechanics.
3. Connect quest state to the DM evidence engine and enforce unlock prerequisites.
4. Add clickable NPC character cards, relationship views, and quest-chain graphs to the mobile interface.
5. Validate all historical appearances before canon-locking any published D&D character.
