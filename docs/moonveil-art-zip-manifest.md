# Moonveil Art Catalog — ZIP Manifest and Import Contract

Status: **asset slots only**. No PNG artwork is bundled by this document; do not mark an image ready until the actual file is reviewed, committed and hash-verified.

## Proposed portable ZIP

```text
Moonveil_Art_Catalog/
  manifest.txt
  Characters/
    Alice_Zress.png             [NOT YET VERIFIED]
    Glyph_CP09.png              [NOT YET VERIFIED]
  Battlefields/
    Moonveil_Warfront.png       [NOT YET VERIFIED]
    Underdark_Cavern.png        [NOT YET VERIFIED]
  Factions/
    Shadow_Syndicate.png        [NOT YET VERIFIED]
  Spells/
    Arcane_Bolt.png             [NOT YET VERIFIED]
  UI_Props/
    War_Table.png               [NOT YET VERIFIED]
```

These filenames are **requested target slots**, not a claim that the files exist. Add images only after generation or approved upload. Keep concept-art collage panels distinct from verified individual assets.

## Stable VTT mapping

| Portable filename | Existing VTT ID | Canonical repository path |
| --- | --- | --- |
| Characters/Alice_Zress.png | C001 | assets/characters/C001_Alice.png |
| Characters/Glyph_CP09.png | C002 | assets/characters/C002_Glyph.png |
| Battlefields/Underdark_Cavern.png | ENV001 | assets/environments/ENV001_Cave.png |
| UI_Props/War_Table.png | not assigned | pending review |
| Battlefields/Moonveil_Warfront.png | not assigned | pending review |
| Factions/Shadow_Syndicate.png | not assigned | pending review |
| Spells/Arcane_Bolt.png | not assigned | pending review |

Existing IDs must never be repurposed. The existing E005 Ooze and ENV003 Arcane Portal slots remain pending.

## Acceptance workflow

1. Place actual PNG files at approved `assets/...` paths and preserve existing IDs.
2. Record source/provenance, license or permission, chronology (DR date), plane, canonical status, and SHA-256 digest in `assets/manifest.json`.
3. Set `status: "ready"` only after verifying that the image is a real PNG with a matching SHA-256. Run `node scripts/validate-art.js`.
4. GitHub Actions validates all changes to `assets/**` before acceptance. GitHub Pages continues to deploy committed static files through its existing deployment workflow.
5. If artwork is missing or still pending, `assets/catalog.js` returns no image, preserving the existing fallback behavior.

The supplied sample `art-generator-webhook.js` is **not installed**: it opens a second SQLite connection and incorrectly labels a prompt log as generated artwork. The supplied Flutter widget is likewise a separate client example, not part of the browser VTT. Any future asset-generation service requires authenticated authorization, input limits, explicit provider integration, secure storage and honest pending/ready states.

Visual direction: obsidian #140D1B, void purple #0A0710, electric cyan #00FFFF, amber #FFC107, red mist; dark-fantasy atmosphere and clean readable silhouettes. Alice remains a Great Old One Warlock, Ghaunadaur her patron, Eilistraee and Mystra protectors.
