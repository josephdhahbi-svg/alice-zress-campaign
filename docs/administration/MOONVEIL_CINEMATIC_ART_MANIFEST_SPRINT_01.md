# Moonveil cinematic art manifest — sprint 01
Status: **PROMPT_ONLY / NOT RENDERED / NOT INSTALLED**. No artwork is claimed to exist in the repository. Rights, provenance, approval and visual QA required before integration.

## Shared visual specification
Photorealistic dark fantasy, 16:9 cinematic framing, subtle atmospheric fog, high-detail material realism, volumetric bioluminescence. Palette: background navy #0b0f19 to slate #131c31; BLUE hero #478DFF; RED villain #F16B78; GREEN neutral #48C99A; PURPLE magic #B99AFF; GOLD artifact #F4C66B; CYAN map #64C8DF. Keep text/UI overlays out of generated scene plates; HTML overlays handle accessibility.

| Asset ID | Scene | Production prompt | Status |
|---|---|---|---|
| ART-RH-001 | Pit entrance | Vast Underdark stone amphitheater around a narrow impossible vertical Rabbit Hole, damp obsidian, pale cyan fungus, silver shafts of moonlight, tiny female drow silhouette, 35mm cinematic lens, realistic fog | PROMPT_ONLY |
| ART-RH-002 | Ghaunadaur scar | Respectful close-up of female drow warlock collarbone bearing a faint violet alien scar, sinister crimson reflection of primordial ooze, soft practical lighting, no gore, 85mm lens | PROMPT_ONLY |
| ART-RH-003 | Void observatory | Far Realm aperture behind black stone arches, non-Euclidean violet stars, blue Weave filaments, silver reflected light, awe and unease, photorealistic fantasy environment | PROMPT_ONLY |
| ART-RH-004 | Eilistraee's light | Female drow warlock at the threshold, luminous silver protective radiance, distant moonlit silhouette, dark cavern, agency and hope, cinematic wide shot | PROMPT_ONLY |
| ART-RH-005 | Return gate | Sealed ancient portal within the hole itself, floating chronal rings, gold inscriptions, dormant purple parasite motif, no active resurrection, wide cinematic composition | PROMPT_ONLY |

## Integration gates
1. Generate or license original image and record creator/tool, timestamp, rights, source, SHA256, and exact repository path.
2. Confirm Alice's character continuity (female Drow Great Old One Warlock, Level 1 origin; no earned lich form).
3. Visual QA for composition, legibility, mobile crops, contrast, and alt text.
4. Approve before wiring image paths into the HTML prototype.
5. Only mark **VERIFIED** after committed bytes, asset validation, and render proof.

## UI implementation
`prototype/moonveil-theme.css` and `prototype/alice-cinematic-ui.html` are original code assets, not photorealistic images. The five-choice and dice interactions are **local previews only**; no signed session, dice ledger, or character mutation.
