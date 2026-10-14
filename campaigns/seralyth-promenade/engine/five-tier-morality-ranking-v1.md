# Moonveil Five-Tier Moral Ranking v1
Date: 2026-10-14
Status: USER-APPROVED classification, highest rank = 1.

1. HERO — BLUE (#2563eb): compassionate, courageous, selfless, protects others.
2. HERO-LEANING NEUTRAL — TEAL (#0d9488): generally decent and helpful, independent and pragmatic.
3. TRUE NEUTRAL — GREEN (#16a34a): balanced, independent, neither intrinsically heroic nor villainous.
4. VILLAIN-LEANING NEUTRAL — AMBER (#d97706): self-interested, opportunistic or ruthless without necessarily embracing evil.
5. VILLAIN — RED (#dc2626): cruelty, exploitation and destructive wrongdoing.

## Implementation policy
- Use all five tiers on NPCs, factions, quests, dialogue and choice previews. Rank 1 highest, rank 5 lowest. This supersedes earlier BLUE/GREEN/RED-only display standards, which remain broad umbrella categories when needed.
- Existing BLUE hero = rank 1 unless established nuanced characterization calls for rank 2; existing GREEN neutral = rank 3 by default unless evidenced as rank 2 or 4; existing RED villain = rank 5 unless nuanced rank 4 is justified.
- Morality reflects choices and behavior, not ancestry, race, gender, romance preference or character class.
- True neutral can remain neutral permanently with satisfying quest, romance and ending paths. No forced conversion.
- Character tiers change only from earned story developments; preserve original source/canon status and record event/date/location/reason for change.
- For five primary player options, prefer at least two hero-compatible and two neutral-compatible choices; do not force villainous choice just to fill a tier.
- Lord Malakar starts rank 5 per his established evil conquest agenda, with any redemption requiring earned quest progress; Vira defaults rank 3 pending actions; Valen and Kira rank 1 as their stated heroic baseline. These are characterization interpretations, not tested gameplay.
- Retain the user's hero-first campaign spotlight target. Five moral tiers are classifications, not fixed quotas for player options.
- Update downstream shop/NPC/quest/map schema fields to moral_rank 1..5 and moral_label; older moral colors need a migration layer.
