# Moonveil — BG3 Feel/Function Parity Matrix v1
Date 2026-10-14. Status: acceptance criteria, NOT measured parity.
Goal: original, legally distinct mobile RPG that makes post-BG3 Forgotten Realms continuation feel coherent, immersive, responsive and persistent. No copied assets, proprietary scripts or exact UI.

Score each dimension 0-5 separately for Design, Runnable, Automated verification, Android observed playtest; total 30 dimensions x 20 = 600. Record build version, screenshot/video, test logs, tester, date, evidence links; absent evidence=0 for runnable/test/playtest.

## 30 comparison dimensions
01 Mobile first impression and atmosphere
02 Original cinematic 3D/2D scene art quality
03 Lighting, shadows, environment depth
04 Character models and portrait expressiveness
05 Camera transitions and framing
06 Dialogue subtitles, timing and facial expression
07 Voice acting and spatial sound
08 Music and dynamic soundscapes
09 Touch controls, navigation and readable HUD
10 Inventory icons, inspect, equip, compare, trade
11 Party selection, portraits and switching
12 Character sheet, leveling, classes and builds
13 Spellbook, hotbar and resource feedback
14 Grid/terrain, pathfinding, verticality
15 Initiative, action economy and reaction prompts
16 Hit chance, damage, conditions and dice audit
17 Environmental interactions and elemental surfaces
18 Enemy behavior and tactical variety
19 Five-way dialogue with conditional prerequisites
20 Skill checks and alternate success/failure routes
21 Companion approval/disapproval and banter
22 Optional consensual romance and friendship paths
23 Moral previews, world impact, ending branches
24 Quest journal, map markers, exploration secrets
25 Faction reputations and autonomous living world
26 NPC chronology and post-BG3 canon gates
27 Save/quit/reload precise scene, party and world state
28 Input parity (touch, keyboard, voice when supported)
29 Mature content options and accessibility controls
30 Performance, stability, loading, battery and offline behavior

## Additional resume stress cases
- Quit during dialogue, reload same speaker/node/available choices.
- Quit during combat, restore positions, turn order, conditions, used resources.
- Quit after loot and retry: item and approval awarded exactly once.
- Load a save after patch: versioned migration preserves chronology and inventory.
- Select different BG3 ending imports: Karlach, Orpheus, Shadowheart and other companion states respect selected branch.
- No save file from BG3 is assumed readable; manual ending questionnaire is initial fallback.

## Scoring rules
Keep original /1000 story rubric and /100 engine readiness rubric separately. New /600 matrix is a third independent audit, not a substitute or automatic pass. Initial runnable/automated/mobile evidence is 0 until a build exists. Do not invent visual similarity percentages or successful tests. Recommended launch gate: all critical gameplay/save checks automated; three Android human playtests; visual and feel evaluations from users with BG3 experience.
