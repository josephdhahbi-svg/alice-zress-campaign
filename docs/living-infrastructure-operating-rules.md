# Moonveil Living Infrastructure: Operating Rules v1

## Transportation
A route is a **directed** connection between two location IDs. Bidirectional services require two records. Route states: proposed, under_construction, operational, disrupted, seasonal, locked_pending_verification, retired. The route planner only traverses `operational` routes; it never modifies saves, pays fares, or advances the clock. Its first implementation finds the fewest-hop route, **not** the fastest or cheapest route.

A planned railroad, airship dock, subway, ley-line terminal, ferry or portal cannot be used until the infrastructure exists in the correct era and location, and its access conditions are met. A proposed sourcebook crossover is not a published canon road.

## Book arrival and departure
Each of B01–B30 must eventually provide: verified map anchors; one or more arrival routes; one or more departures; local and regional transit services; at least one communications method (including a justified lack of service); and a route continuity review. Locations are shared between books. New arrivals do not overwrite existing characters or timelines.

## Messaging
Physical letters require an operational transport chain and a courier service; travel route existence alone does not imply postal service. Spell-based messages must obey the selected rules edition, spell resources, range/plane restrictions, and target requirements. OTHLOS is future Moonveil infrastructure and cannot transmit until built.

A message lifecycle is: draft -> queued -> in_transit -> delivered, with alternate outcomes delayed, lost, or returned. Interception and privacy rules must be reviewed before implementation. Message bodies, addresses for real people, private session correspondence and player saves must **never** be committed to GitHub.

## Future engine work
1. Verify book titles, DR dates, locations and canonical source references.
2. Implement weighted travel costs and durations, capacity, service timetables, faction access, and hazards.
3. Build mail routing on operational transportation legs, plus explicit postal operators and stations.
4. Persist gameplay travel and messaging through authenticated, revision-safe server APIs with player authorization.
5. Test with five Netherese sample characters before unlocking any Alice crossover.

## Verification status
The atlas has 30 template book inventories and ten proposed locked character links. The route planner is source-committed; full checkout test execution and gameplay integration remain pending. No player state was changed.
