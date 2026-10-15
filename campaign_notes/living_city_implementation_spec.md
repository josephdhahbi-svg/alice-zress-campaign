# Moonveil Universe — Living City Implementation Specification
Source: user directive 2026-10-14. Status: engineering requirements; NOT a claim of deployed functionality.

## Nonnegotiable principles
The city belongs to its people, not the player. NPCs have independent jobs, goals, schedules, homes, relationships, faction ties, needs, memories, resources, opinions, secrets and agency. The world advances while Alice is absent, asleep, traveling or offline. No static quest-giver-only NPCs. Preserve canon and campaign history.

## Simulation domains (15)
NPCs; households; businesses; factions; guards; criminals; merchants; temples; taverns; citizens; government; economy; information network; reputation network; events.

## NPC record
npc_id, name, species, gender, age, occupation, wealth, home_location, work_location, faction_id, daily_schedule, known_npcs, relationship_scores, beliefs, religion, personality_traits, memories, reputation, goals, secrets, status, alive, health, inventory, current_location, last_update_time.

## Relationships
Relationship ID, npc_a, npc_b, type, strength, history, last_updated. Types: friendship, rivalry, family, romance, mentor, student, business, political, religious, criminal, military, historical. Preserve directionality where relevant.

## Memories
Remember aid, harm, payments, lies, rescues, killings, betrayals, completed quests. Salience-dependent decay; permanent/major historical events remain in immutable ledger.

## Factions
faction_id, name, leader_npc_id, wealth, territory, power, allies, rivals, enemies, goals, members, reputation, resources. Autonomous faction decisions and resource costs.

## Economy
Resources: food, ore, wood, cloth, luxuries, weapons, magic. Production, consumption, stock, shortages, trade, warfare and price adjustments. Use bounded, auditable deterministic updates.

## Event-driven offline advancement
Store last simulated world time and deterministic RNG seed. On resume compute elapsed time and advance queued events, NPC schedules, relationships, economy, factions, city events and quests in chronological order; do not simulate every second. Apply bounded catch-up and avoid double processing. An offline client can catch up on launch without a continuously running server; an always-on hosted simulation requires actual hosting.

## Emergent quests
Merchant shipment -> hired guard -> bandit attack -> faction retaliation -> rumors -> quest discovery. Quest lifecycle tied to simulation state, not solely player proximity.

## City events
Fire, murder, marriage, birth, death, promotion, bankruptcy, festival, election, war, crime, arrest, religious ceremony, caravan, monster attack. Persist as history.

## Information network
Rumors propagate through taverns, merchants, temples, guards, criminals, factions, magic, messengers and travelers; witnesses and recipients know only what reaches them. Track provenance, distortion, trust, delay and expiration.

## Reputation and flags
Reputation by city, district, faction, organization, companion, religion, family, merchant guild, criminals and guard forces. Persistent world/city/district/quest flags and major decisions; no important historical erasure.

## Proposed normalized SQLite tables
worlds(world_id, game_time, seed, last_advanced_at);
districts(district_id, city_id, name);
locations(location_id, district_id, name, type);
npcs(npc_id, name, species, gender, age, occupation, wealth, home_location_id, work_location_id, faction_id, beliefs_json, religion, traits_json, goals_json, secrets_json, status, alive, health, current_location_id, last_update_time);
npc_schedules(schedule_id, npc_id, start_minute, end_minute, day_mask, location_id, activity, priority);
households(household_id, home_location_id, funds);
household_members(household_id, npc_id, role);
relationships(relationship_id, npc_a, npc_b, relationship_type, strength, history_json, last_updated);
npc_memories(memory_id, npc_id, event_id, salience, confidence, decay_rate, learned_at, last_recalled_at);
factions(faction_id, name, leader_npc_id, wealth, power, goals_json, resources_json);
faction_members(faction_id, npc_id, role);
faction_relations(faction_a, faction_b, relation_type, score);
faction_territories(faction_id, district_id, control);
businesses(business_id, owner_npc_id, location_id, type, funds, production_json, consumption_json);
inventories(inventory_id, owner_type, owner_id);
inventory_items(inventory_id, item_id, quantity);
economy(district_id, resource_id, stock, demand, price, updated_at);
rumors(rumor_id, origin_event_id, content_json, created_at, expires_at);
rumor_knowledge(rumor_id, npc_id, learned_at, trust, version_json);
quests(quest_id, trigger_event_id, status, conditions_json, outcomes_json);
quest_states(quest_id, actor_id, state, updated_at);
reputations(subject_id, target_type, target_id, score, updated_at);
persistent_flags(scope_type, scope_id, flag_key, flag_value_json, updated_at);
city_events(event_id, city_id, event_type, happened_at);
world_events(event_id, happened_at, event_type, source_type, source_id, target_type, target_id, location_id, result_json, metadata_json, idempotency_key UNIQUE);
simulation_queue(job_id, due_at, event_type, payload_json, status, idempotency_key UNIQUE);
sync_outbox(outbox_id, event_id, payload_json, status, retry_count, created_at).
Use foreign keys, indices, CHECK constraints, migrations, transactions and FTS5 where appropriate. world_events is append-only; corrections are new compensating events. Implement triggers/permissions or service-layer enforcement and idempotent outbox writes in the same transaction.

## Authoritative pipeline
Player -> Flutter UI -> game engine -> rules validation -> SQLite transaction + event ledger + outbox -> narrative context -> ChatGPT. ChatGPT narrates and proposes actions; only the validated game engine commits state.

## Flutter directory proposal
flutter_client/lib/features/living_city/{models,repositories,services,simulation,ui}/
models: npc.dart, relationship.dart, faction.dart, rumor.dart, quest.dart, city_event.dart, world_clock.dart.
repositories: npc_repository.dart, event_repository.dart, faction_repository.dart, economy_repository.dart.
services: world_clock_service.dart, rumor_service.dart, reputation_service.dart, quest_generation_service.dart.
simulation: simulation_engine.dart, event_scheduler.dart, npc_schedule_system.dart, faction_system.dart, economy_system.dart, memory_decay_system.dart, offline_catchup.dart.
ui: city_screen.dart, district_screen.dart, npc_detail_screen.dart, rumor_board_screen.dart.
tests: unit, integration, migration, determinism and offline recovery suites.

## Implementation phases
1. **Playable vertical slice**: one Promenade district, 5–10 autonomous NPCs, schedules, event ledger, merchant incident, rumor, quest, save/reload.
2. **Living district**: households, businesses, guards, temple, factions, relationships, memory decay and economy.
3. **Living city**: multiple districts, city government, citywide trade, information networks and persistent consequences.
4. **Multi-city region**: caravans, intercity travel, wars, political and economic influence.
5. **World simulation**: campaign-wide timeline, planes, regional event orchestration and continuity checks.

## First five proposed GitHub commits
1. `docs: living city architecture and persistence contract`
2. `feat(db): versioned schema, event ledger, migration tests`
3. `feat(sim): deterministic clock, event queue, offline catch-up`
4. `feat(npc): schedules, relationships, memories and rumors`
5. `feat(city): merchant incident vertical slice and Flutter UI`

## Risks and testing
Risks: runaway simulation, save corruption, nondeterminism, duplicate offline events, incompatible schema migrations, overpowered emergent economies, lore chronology violations, unbounded memory, privacy/security, Git merge conflicts and AI hallucinated state. Tests: invariant/foreign key, append-only ledger, transaction/outbox atomicity, seed replay, save/reload, offline catch-up, idempotency, rumor visibility, economic conservation, NPC independence, concurrent conflict handling, migration rollback, Flutter widget/end-to-end and 1/30/365-day performance scenarios.

## Alice continuity
Alice Z'ress is a Level 1 Great Old One Warlock at rabbit-hole entry, with Eilistraee devotion, Ghaunadaur patron and Mystra protection. Do not overwrite with the Level 20 Dark Maiden Misvisage profile. The Promenade of the Dark Maiden is the main starting hub (EE-001). Preserve actual source maps and separate generated illustrations. All significant entities/events must include source/canon status, DR chronology and location/plane metadata.
