# Dialogue Alignment Matrix — Gemini Intake and ChatGPT Review v1
Date: 2026-10-14. Status: brainstorming, not approved canon or implemented branching.

## Supplied proposal
110 dialogue lines: ten each for nine traditional alignments, ten Gold Heroic Ideal, ten Violet Harmonic Unity. Five criteria scored 1-5: voice/cadence, subtext, consequences, sensory setting, philosophical relevance.
Editorial overall collection sample 16/25: voice 3, subtext 3, branching 2, sensory 3, philosophy 5. Not an individual-line audit.

## Design constraints
- Player action and consequences determine route progression; dialogue alone cannot award Gold/Violet.
- Separate player intent, spoken promise, action taken, witnessed consequence, and faction interpretation.
- Gold/Violet are homebrew ending paths, not official alignments; they can coexist with traditional alignment.
- Evil dialogue must be available only where appropriate to player/NPC, not forced onto heroic PCs.
- Don't collapse Chaotic Good into recklessness, Chaotic Neutral into betrayal, or True Neutral into moral equivalence.
- Redemption requires accountability, consent, reparations, risk and victims' safety; no magical coercion disguised as mercy.
- Violet claims about Ghaunadaur as cosmic wound or 'broken frequency' are **unverified homebrew mysteries**, not Forgotten Realms fact. Allow alternate revelations, including that Ghaunadaur refuses change.
- Gold dialogue 'remember how to be human' should say 'remember how to choose mercy' for a world of many species; 'monsters become brothers' risks trivializing victim protection.
- Eilistraee is not necessarily pacifist; compassionate resistance may include justified force.

## Engine schema proposal
choice_id, scene_id, speaker_id, text, visible_tags, hidden_intent, prerequisites, skill_check, npc_reaction, immediate_effects, delayed_effects, faction_delta, quest_flags, gold_evidence, violet_clue, victim_safety, followup_scene_ids, source_status, revision.
No automatic alignment points for selecting a line. A resolution event should log what actually happened. Five choices per scene can be diverse actions, not mechanically forced to be five alignments.

## Concrete test scene
At the sealed Promenade gate, a captured ooze-cult courier claims a hostage is alive in a flooded passage.
1. Offer guarded safe passage for truthful directions; gain rescue lead, risk escape.
2. Demand testimony with sanctuary witnesses; slower but supports accountability.
3. Prioritize rescue before interrogation; saves time, may lose intelligence.
4. Negotiate a temporary ceasefire with the courier; risks cult influence.
5. Examine the courier's slime-marked memories with consent and ritual safeguards; opens possible Violet clue if evidence supports it.
Consequences depend on checks, rescue, and evidence, not dialogue label.

## Suggested next Gemini task
Convert 11 representative slogans into 11 complete 3-turn exchanges with distinct NPC responses, a choice schema, immediate/delayed effects, and tests for route gaming. Provide a 25-row rubric only if scoring the full engine; avoid unsupported verified/playtest points.
