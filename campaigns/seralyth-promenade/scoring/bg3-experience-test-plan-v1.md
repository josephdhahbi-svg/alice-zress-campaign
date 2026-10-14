# BG3 Feel, Functionality and Resume — Acceptance Tests v1
Date: 2026-10-14
Status: INITIAL BASELINE — desk audit of existing repository documents and in-chat UI mockups, NOT a user playtest.

## New independent BG3-like experience score: 10 criteria x 10 points = 100
For each criterion award 0–2 design specification, 0–3 runnable implementation, 0–3 automated verification, 0–2 observed mobile playtest. This ensures a detailed design cannot score above 20/100 without functioning software.

| Criterion | Design /2 | Implementation /3 | Tests /3 | Mobile playtest /2 | Baseline /10 |
|---|---:|---:|---:|---:|---:|
| Cinematic scene and readable mobile visual UI | 2 | 0 | 0 | 0 | 2 |
| Five-choice dialogue, flags and consequences | 2 | 0 | 0 | 0 | 2 |
| Companion approval and romance state gates | 2 | 0 | 0 | 0 | 2 |
| Transparent, fair d20 checks and 2024 rules | 2 | 0 | 0 | 0 | 2 |
| Tactical grid combat and action economy | 1 | 0 | 0 | 0 | 1 |
| Inventory, loot, equipment and spell resources | 1 | 0 | 0 | 0 | 1 |
| Party progression, NPC continuity, world clocks | 2 | 0 | 0 | 0 | 2 |
| Save/quit/reload exact state with no dupes | 2 | 0 | 0 | 0 | 2 |
| Android touch accessibility and voice/button parity | 1 | 0 | 0 | 0 | 1 |
| Immersion: audio, cinematic pacing, mature options | 1 | 0 | 0 | 0 | 1 |
| **TOTAL** | **16** | **0** | **0** | **0** | **16/100** |

16/100 is a **provisional specification-readiness estimate**, not a measured gameplay similarity, user satisfaction score, or claim that BG3 parity is 16%. UI mockups in conversation have clickable controls but are not independently deployed, persisted or verified in this repository; implementation therefore 0 pending reproducible evidence.

## Required automated test plan (NOT EXECUTED)
T01 choice schema exactly 5 options and custom action
T02 moral/action/recommendation/foreseeable impact fields present
T03 locked romance cannot trigger without mutual interest/consent/prerequisites
T04 approval changes exactly once on resolved event, not on preview
T05 d20 1..20 inclusive, advantage/disadvantage two dice, provenance logged
T06 skill/tool proficiency applied per 2024 rules; no accidental stacking
T07 attack hit, damage, conditions, action economy, initiative, movement legal
T08 inventory transfers conserve quantities, no negative resources
T09 E-STAM credits awarded once, separate from XP
T10 failed check routes forward without falsely granting rewards
T11 BG3 character pre/post-era gating and chronology
T12 save/reload equality including RNG seed/roll log, NPC and faction state
T13 duplicate event replay causes no double loot/approval/XP
T14 branch save/load and rollback restore exact prior checkpoint
T15 Android portrait viewport, button touch sizes, screen reader labels
T16 voice and button select identical normalized action when supported
T17 no unearned endgame artifacts, no forced romance
T18 user-facing content filters, maturity and safety controls
T19 all 21 episodes have choices and cross-book flags, eventually all campaigns
T20 3 observed human mobile playtests and feedback records

## Scoring policy
- Keep original 25-category x 4-axis /1000 story-development rubric intact. Its current JSON has all verified and playtested axes zero. Do not overwrite historical scores.
- Add BG3-like /100 as separate metric; also keep five genre target intensities /50 separate from earned grades.
- Rerun and update scores only when code, test logs, visual evidence or user playtest evidence is available. Never say 'tests passed' without actual execution and recorded output.
- Comparison with BG3 is experiential inspiration, not a claim of visual or functional equivalence.

## Current audit
Existing integrated story bible describes 21 episodes and homebrew clocks; scorecard exists. No executable rules engine, persisted state service, Android app, automated test harness, or observed playtest evidence was inspected here. Result: SPEC REVIEW ONLY; 0 automated tests executed and 0 human playtests.
