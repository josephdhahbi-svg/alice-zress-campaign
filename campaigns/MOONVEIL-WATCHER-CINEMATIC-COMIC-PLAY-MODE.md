# MOONVEIL — WATCHER CINEMATIC + COMIC PLAY MODE

Status: **MASTER EXPERIENCE DESIGN / PROPOSED FEATURE**
Player role: **THE WATCHER**
Purpose: Let Joseph experience Moonveil like an interactive movie while following narration/voice, making key choices, and opening a comic-book recap at the end of each adventure.

# EXPERIENCE PRINCIPLE

The Watcher does not need to manage every tabletop rule manually.

The game presents the world cinematically:
**WATCH -> LISTEN -> CHOOSE -> WITNESS CONSEQUENCE -> OPEN COMIC -> CONTINUE**

The system may automate routine rolls, bookkeeping, NPC turns and tracker updates while always surfacing important choices and consequences.

# CINEMATIC PRESENTATION

Each scene should be written and presented like a movie sequence:
1. Establishing shot — where/when.
2. Character shot — who matters now.
3. Action/dialogue — narrated in voice-friendly prose.
4. Evidence shot — visible clue/mark/item/map detail.
5. Decision moment — five large clickable choices.
6. Consequence sequence — immediate result plus hidden/persistent world changes.
7. Transition shot — leads naturally to the next scene.

Voice narration should use short, speakable paragraphs and identify who is speaking without drowning the listener in rules text.

# FIVE CLICKABLE CHOICES

Default large buttons:
**TALK** | **INVESTIGATE** | **SNEAK** | **RESCUE/BUILD** | **FIGHT**

When a scene requires different meaningful actions, button text can become specific:
**TRUST NYM** | **ASK THALIA** | **FOLLOW THE EYE** | **CALL TO EILISTRAEE** | **DRAW YOUR BLADE**

Every button must explain the intention before commitment when consequences would otherwise be unclear.

# WATCHER HUD

Keep the movie image dominant.

Compact optional overlays:
- Alice/party portraits and current status.
- HP/resources only when tactically relevant.
- current location + date/sequence.
- objective.
- LIGHT evidence confidence.
- important artifact/mark.
- relationship changes.
- subtitles/transcript.
- voice play/pause/replay controls.
- **COMIC** button after completed scenes/adventures.

Advanced trackers remain available behind an expandable panel rather than filling the movie screen.

# COMIC BOOK AT THE END

At the end of every completed adventure, generate a **session-specific comic recap** from what actually happened.

The comic must NOT depict choices the player did not make as though they happened.

Suggested structure:
- Cover — adventure title + principal heroes.
- Page 1 — opening/location.
- Page 2 — inciting problem.
- Page 3 — investigation/discovery.
- Page 4 — major relationship/character moment.
- Page 5 — confrontation.
- Page 6 — player's decisive choice.
- Page 7 — consequence/victory/loss.
- Page 8 — archaeology left behind + next-road teaser.

Long adventures may receive more pages.

The final screen exposes:
**[READ COMIC] [HEAR RECAP] [VIEW LOOT] [VIEW CLUES] [CONTINUE]**

Comic production is a target workflow. A written panel/script is not falsely labeled as a rendered comic image until artwork is actually generated.

# VOICE COMPANION

Narration should support listening while watching:
- cinematic narrator;
- character dialogue;
- optional concise rules explanation;
- recap/replay;
- pause at every player decision;
- do not speak hidden GM information;
- pronounce recurring names consistently.

The game should never make a consequential player choice merely because narration continued.

# ALICE Z'RESS EXAMPLE

Camera descends through moonlit caverns beneath Waterdeep.

Alice stands before an ancient black-glass Eye. Silver roads move beneath its surface.

Narrator:
"The Eye does not blink. Alice realizes that may be worse. Something on the other side has noticed that she noticed it."

The screen pauses.

Buttons:
**[TOUCH THE EYE] [ASK THALIA] [LET NYM LISTEN] [PRAY/SING TO EILISTRAEE] [DESTROY THE CHAMBER]**

After the player's choice, the movie resumes and the actual consequence is stored in the campaign footprint.

At adventure end, the comic recreates that exact version of the scene.

# HERO JOURNEY VISUALIZATION

Alice's seven-stage journey can become seven cinematic/comic volumes:
1. Alice Z'ress — Survivor/Seeker.
2. Hero of the Promenade.
3. Champion of Eilistraee.
4. Eldritch Lich.
5. Arch Eldritch Lich.
6. Aspect of the Moon.
7. Avatar of Eilistraee.

Each transformation receives:
- cinematic quest;
- transformation sequence;
- before/after character card;
- comic cover;
- persistent consequence entry;
- no automatic unlock without prerequisites.

# ARCHIVE

Completed comics live in a **Moonveil Chronicle Shelf** organized:
Series -> Trilogy -> Book -> Adventure -> Session Comic.

A later player can read an earlier comic as an in-world historical record, but the comic is a player-facing recap; whether an identical document exists inside the fiction must be established separately.

# IMPLEMENTATION TRUTH

This document defines the desired experience.

Do not claim clickable movie UI, synchronized voice playback, rendered comics or automated recap generation are implemented until repository code and tests prove they are.

# NORTH STAR

The player should be able to sit back like a movie watcher, listen to the story, look at the characters/world, press a meaningful button when it is their turn to decide, and finish the adventure by opening a comic book showing the story they actually created.


# CONTINUOUS AUDIO-COMIC MODE — LOCKED EXPERIENCE TARGET

The preferred Watcher presentation is not a stop-start illustrated recap. It is a **flowing movie told through sequential photorealistic comic frames while one continuous narration track carries the Watcher through the same exact story**.

Core playback:
**VOICE STARTS -> FRAME 1 -> FRAME 2 -> FRAME 3 -> ... -> DECISION (only when necessary) -> VOICE RESUMES -> END-COMIC/CHAPTER**

## Audio and image synchronization
Every narration beat has a matching panel/frame ID. The spoken narration and visible frame must describe the same moment, characters, location, action, emotion and evidence.

Example timing script:
- 00:00–00:12 FRAME 01 — establishing shot beneath Waterdeep.
- 00:12–00:25 FRAME 02 — Promenade/refugees.
- 00:25–00:38 FRAME 03 — wounded scout arrives.
- 00:38–00:55 FRAME 04 — child in danger.
- 00:55–01:15 FRAME 05 — Alice steps between child and threat.
- 01:15–01:35 FRAME 06 — eldritch attack.
- 01:35–01:55 FRAME 07 — rescue.
- 01:55–02:15 FRAME 08 — Eye mark discovered.
- 02:15–02:30 FRAME 09 — Eye opens / chapter hook.

Transitions should feel cinematic: slow push, cut, close-up, wide reveal, reaction shot, action beat, aftermath, fade/cut to black.

## Voice-writing rule
Write narration for the ear first:
- natural flowing sentences;
- dialogue embedded cleanly;
- minimal stat/rules interruption;
- no reading database metadata aloud;
- enough visual description to follow without staring at text;
- no duplicate narration and caption text unless accessibility mode requests it.

## Photorealistic visual rule
Watcher art target: **cinematic photorealism / realistic live-action fantasy photography**, consistent actors/character appearance, costumes, lighting, weapons, locations and injuries from frame to frame.

Published-canon visual/lore details should be source-verified where required. Moonveil-original characters, transformations, Eye artifacts and events must remain visibly labeled homebrew/Moonveil canon in production records rather than presented as official published D&D canon.

## Continuous comic construction
Instead of one dense page, prefer a sequence of large readable frames/pages suitable for phone playback. Each frame receives:
**FRAME ID | timestamp | camera | visual prompt | narrator line | dialogue | SFX | continuity state | canon/evidence status**

The final comic is assembled from those same frames. Therefore the comic and narrated movie cannot drift into different versions of events.

## Automatic Hero Mode
Routine heroic choices can remain automated under the selected Courage/Protection route. Playback only pauses when a decision is designated DESTINY-LOCK, irreversible, or specifically reserved for the Watcher.

## Accessibility / follow-along
Target controls:
**PLAY/PAUSE VOICE | PREVIOUS FRAME | NEXT FRAME | REPLAY LINE | SUBTITLES | AUTO-ADVANCE | COMIC VIEW**

AUTO-ADVANCE changes the visible frame at the narration timestamp. COMIC VIEW lets the Watcher scroll the exact same frames manually.

## Production truth
This specification locks the desired presentation format. Actual synchronized audio playback, automatic frame timing and rendered photorealistic frame continuity are not called IMPLEMENTED until the app code, assets and tests exist.
