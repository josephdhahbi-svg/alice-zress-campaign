# Moonveil Art, Administration and Asset Intake Register
Date: 2026-10-16
Status: INTAKE / NOT A DEPLOYED GAME ASSET LIBRARY
Owner: Moonveil integration project manager
Branch: feature/verified-automation-phase-a

## Rules of record
- Art visible in ChatGPT or generated in a chat is NOT automatically stored in GitHub, linked into the VTT, licensed for redistribution, or approved as final canon.
- Every asset requires: asset ID, character/place/item subject, purpose, source and rights, provenance, local or repository path, approval, canon era/DR and location, visual QA, accessibility alt text, UI integration, and verification evidence.
- Never mark a placeholder as final art. Never claim an image is in the game without verifying its exact accessible path and frontend reference.
- Generated dashboard mockups can contain invented gameplay data. Their fake XP, items, guild memberships, dates, gold and deployment status must NEVER enter game state.
- Three Sacred Lich Ascensions: Moonveil Witch (Selune / protection), Alice Z'ress (Eilistraee / freedom), Starweave Necromancer (Mystra / knowledge). Sacrifices are PROPOSED story arcs, not earned transformations.

## New generated concept art — intake awaiting repository import
| ID | Asset | Source | Available conversation file | Approved for use? | GitHub integrated? |
| --- | --- | --- | --- | --- | --- |
| ART-ADM-001 | Wide Moonveil administration dashboard concept | ChatGPT image generation, 2026-10-16 | /mnt/data/a_wide_cinematic_high_detail_fantasy_sci_fi_game.png | PENDING QA; includes fictitious progress and inventory | NO |
| ART-ADM-002 | Ornate Moonveil art and paperwork dashboard concept | ChatGPT image generation, 2026-10-16 | /mnt/data/a_high_detail_fantasy_game_ui_dashboard_a_moonve.png | PENDING QA; includes fictitious CI/deployment labels | NO |

## Required art inventory and missing-asset work orders
| ID | Subject | Intended role | Verified image path in repo | Status | Work order |
| --- | --- | --- | --- | --- | --- |
| ART-CHAR-001 | Alice Z'ress Level 1 | Main portrait and dialogue | NOT VERIFIED | NEEDS AUDIT | Verify existing portraits, select canonical reference and produce export |
| ART-CHAR-002 | Moonveil Witch | Sacred lich ascension cinematic | NOT VERIFIED | NEEDS AUDIT | Character portrait, pre/post sacrifice variants |
| ART-CHAR-003 | Starweave Necromancer | Sacred lich ascension cinematic | NOT VERIFIED | NEEDS AUDIT | Raven-black hair, red eyes, black robes; pre/post variants |
| ART-LOC-001 | Rabbit Hole | Origin transition | NOT VERIFIED | NEEDS AUDIT | Portal art with time-space geometry |
| ART-LOC-002 | Pit of Ghaunadaur | Book 1 opening | NOT VERIFIED | NEEDS AUDIT | Underdark establishing art |
| ART-LOC-003 | Eilistraee shrine | Choice scene | NOT VERIFIED | NEEDS AUDIT | Moonlit Underdark shrine |
| ART-LOC-004 | Abyss | World atlas | NOT VERIFIED | NEEDS AUDIT | Environment establishing art |
| ART-LOC-005 | Avernus | World atlas | NOT VERIFIED | NEEDS AUDIT | Environment establishing art |
| ART-LOC-006 | Ravenloft | World atlas | NOT VERIFIED | NEEDS AUDIT | Environment establishing art |
| ART-LOC-007 | Spelljammer | World atlas | NOT VERIFIED | NEEDS AUDIT | Environment establishing art |
| ART-LOC-008 | Sigil | World atlas | NOT VERIFIED | NEEDS AUDIT | Environment establishing art |
| ART-UI-001 | Four panels and five decisions | Player-facing GUI | NOT VERIFIED | NEEDS BUILD | Hook to authenticated dialogue API; no fake persistent choices |
| ART-UI-002 | Inventory/equipment icon atlas | Player-facing GUI | NOT VERIFIED | NEEDS BUILD | Only show verified owned items |
| ART-UI-003 | Guild and faction crests | Player-facing GUI | NOT VERIFIED | NEEDS BUILD | Canon classification and source checks |
| ART-UI-004 | Administration asset review | DM GUI | NOT VERIFIED | NEEDS BUILD | Approve, reject, source and provenance records |

## Asset approval form
- Asset ID:
- Asset title:
- Intended subject and scene:
- Character or faction classification (BLUE hero / RED villain / GREEN neutral):
- Era, DR date or UNKNOWN:
- Plane and location:
- Source status (OFFICIAL / HOMEBREW / ORIGINAL / PROPOSED):
- Creator, generation method, date and reference:
- Rights and distribution permission:
- Exact original asset path and SHA-256:
- Thumbnail/optimized path and dimensions:
- Accessibility alt text:
- Artistic continuity review:
- Canon continuity review:
- Reviewer and approval timestamp:
- Actual frontend reference:
- Tested render screenshot and commit:
- Final status (INTAKE / NEEDS REVISION / APPROVED / INTEGRATED / VERIFIED):

## Administration work queue
1. Audit repository art directories and UI references with exact file evidence.
2. Compare user-supplied prior portraits against current canon before replacing any.
3. Export new concept art to versioned game-ready assets after QA; images in this conversation are not GitHub commits.
4. Build a structured JSON asset manifest and checks for missing files, duplicated IDs and unapproved art.
5. Connect only approved assets to the playable GUI and test responsive/mobile render.
6. Preserve paperwork in the handoff and track status without claiming false completion.
