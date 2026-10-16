# Book 1 — The First Door: playable encounter draft v0.1

Status: PROPOSED HOMEBREW NARRATIVE. Not a replacement for existing Book 1.
Scene ID: scene-book01-rabbit-hole-01
Chronology: level-one transition; DR year unresolved; Underdark, Pit of Ghaunadaur.
Character: Alice Z'ress, drow Great Old One warlock, Acolyte.
Patron: Ghaunadaur. Divine influences: Mystra and Eilistraee.
Custom origin gifts: Shield (Mystra), Acid Splash (Ghaunadaur), Light (Eilistraee).
Do not replace Light with Blade Ward without explicit canon approval.

## Opening: The Falling Door
Alice falls through the rabbit hole. The rock beneath her does not recede; it
rises like a dark tide. A silver sigil flares around her wrist, a protective
equation from Mystra. Below, a lake of sentient slime forms a pupil. Far away,
a thread of moonlight reaches through the stone.

A trapped drow courier clings to a ledge beside a sealed gate. She bears a
message addressed to an Eilistraeen sanctuary, but a tendril of living acid
is inching toward the wax seal. The courier is frightened, not hostile.
Ghaunadaur whispers that the letter would be safer in his depths. Neither
the courier's identity nor the letter's contents are canonized yet.

## Decision panel (five options, fixed order)
1. Lawful Good — Secure the courier and promise to deliver the letter intact.
2. Neutral Good — Use Light to reveal a safe path for both of you.
3. Chaotic Good — Distract the tendril with a thrown stone and pull the courier free.
4. Utility — Inspect the gate's sigils and assess the shortest safe route.
5. Action — Confront the tendril directly, keeping the courier behind cover.

No option forces Alice into an evil act. All five permit meaningful failure
without erasing the courier or changing previously recorded dice outcomes.

## Encounter fixtures (homebrew, not official monster statistics)
- HAZARD-PIT-001: acid tendril, stationary, reach 10 ft, telegraphed one turn
  before a strike; damage and DC require balance approval.
- NPC-PIT-COURIER-001: noncombatant courier, initial status endangered.
- ITEM-PIT-LETTER-001: sealed letter, quest object; cannot be consumed by a
  failed check without recording a consequence.
- CLUE-PIT-GATE-001: gate inscription; persists when discovered.
- FACTION-EILISTRAEE: potential reputation increase for protecting courier.
- FACTION-GHAUNADAUR: observes all decisions, no automatic evil alignment.

## Playtest scripts (not yet executed in browser)
A. Lawful Good succeeds: courier rescued, letter sealed, clue remains available.
B. Neutral Good fails: Light still illuminates area; delay adds danger but
   does not retroactively remove the spell or force courier death.
C. Chaotic Good succeeds: courier rescued; distraction produces noise event.
D. Utility succeeds: gate clue recorded; courier remains endangered until acted on.
E. Action fails: Alice takes a consequence; courier remains rescuable.
F. Save and reload after any choice: revision, event ID, quest flag, clue
   state, HP, and resources must match the pre-reload state.
G. Re-submit same command key: no second choice, damage, or faction gain.
H. Concurrent conflicting choice: stale revision rejected; player may reload.

## Acceptance criteria
The existing browser Book 1 story must be inspected before integration.
The five option kinds remain lawful_good, neutral_good, chaotic_good,
utility, action. Rolls must be recorded rather than silently rerolled.
A full playthrough requires implementation and verification of movement,
combat, spell resources, persistence, and quest outcomes.
