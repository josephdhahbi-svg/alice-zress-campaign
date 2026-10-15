# Moonveil Temporal-Spatial Continuity Contract v1
Date: 2026-10-15
Status: PROPOSED ENGINE SPECIFICATION; not yet implemented. Applies to 30 books and seven traversals.

## Canon and clocks
Track (a) in-world historical DR date, with calendar system and precision; (b) local time, UTC offset where meaningful, and plane-specific time-flow rules; (c) monotonic campaign event sequence; (d) real-world audit timestamp. Never infer a DR date from a real-world timestamp. Unknown canon dates remain unknown. Time travel does not rewrite immutable event history.

## Required entity fields
id; entity_type; name; canon_status (official/homebrew/crossover/unverified); source_reference; era; dr_start; dr_end; date_precision; plane_id; world_id; region_id; location_id; coordinates_if_verified; earliest_availability; latest_availability; duration; cooldown; prerequisite_expression; unlock_window; failure_or_expiry_effect; timeline_id; created_event_id; last_changed_event_id; verification_status.

Entities: characters, NPCs, deities' manifestations, monsters, items, spells, rituals, quests, factions, structures, routes, mail services, portals, events, encounters, rewards, and visual assets. Not every field has a value: use explicit null/unknown, not invented dates.

## Availability evaluation
1. Validate world, plane, timeline, and location; reject impossible chronology.
2. Check whether entity exists at requested date; separately check whether player knows of it.
3. Check activation window and service state (operational for routes).
4. Check prerequisites against authoritative, immutable event ledger and current server save revision.
5. Check character permissions, inventory, resources, quest flags, and cooldown.
6. Return available/locked/expired/not_yet_existing/unverified with explanation and no mutation.
7. On player-confirmed action, transactionally recheck requirements, write event and new revision, then emit multiplayer update.

## Temporal quests
Prerequisites may require events completed BEFORE a deadline, AFTER another event, or DURING an interval. Missing a window can lock the original reward and open a separately authored alternate outcome; never retroactively grant rewards. Historical characters appear only if alive/present or explicitly supported by planar/time travel. A canon death or destruction requires dated source review.

## Route and communications constraints
Directed edges with valid_from, valid_until, departure schedule, duration, disruption interval, era, plane, location IDs, access rules, and source. Arrival time must satisfy every subsequent leg's window. Time-dependent shortest path cannot assume reversibility or FIFO if magical travel violates it; flag non-FIFO services for special handling. Mail uses only authorized operational courier services; future OTHLOS is locked until built.

## Art and UI
Every image manifest entry has entity_id, timeline_id, date_or_era, plane/location, canon_status, depiction_state, source_reference, and variant_id. Show era/date and availability on interactive maps; distinguish historic, current, future, and hypothetical layers. Never use future-built infrastructure in an earlier map without explicit historical-overlay labeling.

## Alice protection
Alice Z'ress remains Level 1, Great Old One Warlock, in U01 Silver Courier; five choices awaiting user selection. Shield/Mystra, Acid Splash/Ghaunadaur, Light/Eilistraee are custom origin gifts. No route unlock, reward, movement, or time advancement without the user's choice.

## Test cases required
- NPC appears only after arrival date and vanishes after departure.
- Missed quest deadline blocks reward but enables authored alternate branch.
- Portal available only in date window; no reverse edge inferred.
- Route begins operational then becomes disrupted during journey.
- Time travel across Mystryl/Mystra eras does not conflate identities.
- Item cannot be claimed before quest prerequisites or after expiration.
- Planar time offsets do not reorder immutable audit events.
- Unverified date/location blocks automatic canon route activation.
- Concurrent clients cannot double-award timed reward.
- Artwork for a future era cannot silently appear on past-era map.

Implementation note: this contract extends existing infrastructure rules; do not overwrite their statuses or convert templates into operational services.
