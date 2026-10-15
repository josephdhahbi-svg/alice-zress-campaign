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
