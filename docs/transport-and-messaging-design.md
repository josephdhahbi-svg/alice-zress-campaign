# Moonveil Transport and Messaging Design

All 30 books share a master travel registry at `data/book_transport_master_sheet.json`. A proposed route is not an operational route. Each book will record arrivals, exits, transit stations, route operators, fares, schedules, hazards, chronology, and cross-book destinations.

## Communication modes

- Physical mail: couriers, riders, caravan post, ship mail. Requires a traversable route; delivery time, fare, and reliability are unknown until verified or designed.
- Magical messaging: Sending and related spells. Respect the selected rules edition and limitations; magic does not imply unrestricted worldwide delivery.
- OTHLOS: future Moonveil telecommunications system at the Abbey of Three Lights, using planned relay technology and magical integration. **Not built or operational in Alice's current level-one campaign.**

## Message event schema

Store message ID, sender, recipient, origin, destination, channel, dispatch timestamp, delivery timestamp, cost, delivery state (queued / in transit / delivered / delayed / lost / intercepted / returned), visibility, and audit events. Private player mail and session logs stay in protected game storage, never public GitHub.

## Travel validation

Route unlock requires chronology, geography, infrastructure availability, cost, faction access, and player choice. Travel should change the world's time and resources only through an authorized gameplay action. Support construction projects, maintenance, service disruptions, and alternate routes. The same route can carry characters, goods, news, and letters, with different speeds and risks.

## Example

Waterdeep to Dagger Falls is a proposed overland corridor; there is **no verified direct stagecoach service**. A future courier route may follow it after a grounded geography and operator audit. Prices, distances and schedules are intentionally blank.
