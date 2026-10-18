# Moonveil third-party repository integration registry
Date: 2026-10-18. Status: research and engineering plan, not code/vendor import.

## Rules
1. Preserve user-owned Moonveil game files; never overwrite established characters, choices, saved states, or approved images.
2. Audit the exact upstream LICENSE and dependency licenses before any source reuse. Reading a GPL/AGPL project's techniques does **not** permit copying its source into Moonveil without license compliance.
3. Keep 2014 SRD v5.1 content, other official D&D settings lore, and original Moonveil homebrew in separate provenance classes.
4. Pin tested upstream revisions; avoid blind latest-branch merges. Never send save files or credentials to an upstream app/agent without authorization.
5. Agents, Discord bots, and robot FSMs cannot autonomously approve canon changes or grant rewards. All mutations go through an audited command/event ledger.

## Prioritized reference repositories shared by creator
| Upstream | Target system | Reuse strategy | Status |
|---|---|---|---|
| https://github.com/samcf/ogres | Map UI, scenes, tokens, initiative, phone responsiveness | Evaluate API/protocol interoperability or independent design implementation; **AGPL-3.0** makes direct code reuse a licensing decision | Reference reviewed |
| https://github.com/dungeon-revealer/dungeon-revealer | Fog-of-war, mapped rooms, reveals | Review behavior and APIs; verify LICENSE before reusing | Reference reviewed |
| https://github.com/avrae/avrae | Dice notation, initiative, automated checks, sheet integrations | Study external interface; code is **GPL-3.0**, no copying into proprietary components without review | Reference reviewed |
| https://github.com/oldmanumby/dnd.srd.5.1 | Rules, spells, equipment, monster records | Import only content licensed under applicable SRD attribution/terms, with canonical IDs, edition, provenance | Reference reviewed |
| https://github.com/adventurerscodex/adventurerscodex | Character sheets, equipment, campaigns, party tools | Compare data schemas; **GPL-3.0** restricts code integration choices | Reference reviewed |
| https://github.com/Valloric/statblock5e | Monster and NPC stat-block display | Evaluate templating, check license | Backlog review |
| https://github.com/Miserlou/dnd-tldr | Rule summaries | Reference usability only; check data rights | Backlog review |
| https://github.com/BigJk/snd | Encounter/tool inspiration | Evaluate and license-audit | Backlog review |
| https://github.com/aurorabuilder/elements | Character option datasets | Content rights and version provenance audit required | Backlog review |
| https://github.com/Orcpub/orcpub | Character-builder feature inventory | Evaluate and license-audit | Backlog review |
| https://github.com/Durtur/Dungeoneer | GM utilities | Evaluate and license-audit | Backlog review |
| https://github.com/opendnd/opendnd | Campaign tool design | Evaluate and license-audit | Backlog review |
| https://github.com/Enter-Ravenloft/maps | Ravenloft maps | Asset copyright/provenance and scene-placement approval required | Backlog review |
| https://github.com/rpgtex/DND-5e-LaTeX-Template | Printable sheets/handouts | Optional export workflow; verify license | Backlog review |
| https://github.com/jonathonf/solbera-dnd-fonts | Visual typography | Verify individual font redistribution and licensing; optional | Backlog review |

## User's existing sources and deployment targets
- https://github.com/josephdhahbi-svg/alice-zress-campaign — Alice and current development integration branch
- https://github.com/josephdhahbi-svg/moonveil-ravenloft — original Ravenloft development repository; **audit in place before migration**
- https://josephdhahbi-svg.github.io/moonveil-ravenloft/ — earlier user-supplied Pages URL; check before claiming it works
- https://ogres.app/ — Ogres reference site

## Build order (proposed, non-canon)
1. Run Node smoke CI and test static website deployment end-to-end.
2. Inspect both user repositories and determine canonical active engine, data contracts, and existing asset IDs. Avoid forked sources of truth.
3. Define shared `GameCommand` and immutable `GameEvent` schema with campaign_id, save_id, actor_id, scene_id, action_id, outcome, source_revision, timestamp, schema_version.
4. Map per-campaign UI states into a namespaced persistent store. Server-side sync remains unimplemented until authenticated API and tests exist.
5. Implement deterministic rules tests for d20, attack, damage, pact slots, inventory and attunement based on approved character sheets; no invented stats.
6. Integrate scene/fog and tokens using documented APIs or independent implementations, honoring upstream terms.
7. Add explicit lore provenance and pending-approval workflows; no agent may silently rewrite canon.
8. Restore creator-approved photorealistic art by exact Visual Codex IDs, not by approximating file names.

## Do not mislabel
- An external GitHub link is a **reference**, not a linked running service or automatic development agent.
- A passing syntax smoke test is **not** comprehensive browser/gameplay or Android verification.
- A GitHub Pages workflow committed to a branch is **not** proof the website is deployed.
