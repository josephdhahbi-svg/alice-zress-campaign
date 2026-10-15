# Books 1–3: Quest chain network checkpoint (2026-10-15)
**Status:** NONCANONICAL DESIGN, no player-state changes. The complete machine-readable network, full 18-quest atlas, 21-character roster, relationship web, generator and passing validator are in the companion development archive `alice_books_1_3_quest_chains.zip`.

## Connected quest IDs and titles
**Book 1 Underdark**
- U01 The Silver Courier (Sable, Tessel, Lolth's agents) -> U02 The Lyre Code (Tessel, Mystra), U03 A Map Bought Twice (Velk, Nema)
- U03 -> U04 The Missing Miners (Nema, Velk)
- U02 + U04 -> U05 The Scholar Without a Hive (Irix; Omeluum/Grazilaxx optional, chronology gated)
- U05 -> U06 The Observatory Cipher (Irix, Mystra, Ghaunadaur)
**Book 2 Abyss**
- U06 -> A01 A Guide Who Charges Memories (Yara)
- A01 -> A02 The Web and the Refugees (Lolth-linked slavers, Tessel, Sable), A03 Three Turns of the Maze (Baphomet), A04 Azzagrat's False Treaty (Graz'zt)
- A03 + A04 -> A05 The Anchor That Remembers (Mystra, Irix)
- A05 + A02 -> A06 The Quartermaster's Seal (Marrowglass, Yara)
**Book 3 Avernus**
- A06 -> V01 The Ash-Ferry Contract (Khar, Seren)
- V01 -> V02 The Wounded Machine (Marrowglass, Seren, Velk), V03 A Ledger of Lost Names (Khar, Seren)
- V02 + V03 -> V04 The Last Dawn Sanctuary (Seren, Eilistraee)
- V04 -> V05 Zariel's Unanswered Question (Seren, Zariel); redemption dossier only, no redemption awarded
- U06 + A05 + V04 -> X01 Three Wishes, Three Cleansings (research only; three Wish charges required later)

## People and factions
**Blue heroes:** Alice, Eilistraee, Mystra, Sable (homebrew courier), Nema (homebrew cartographer), Tessel (homebrew Eilistraeen bard), Seren (homebrew healer), optional Omeluum cameo, future Shadowheart cameo.
**Red villains:** Lolth, Ghaunadaur (dangerous patron), Baphomet, Graz'zt, Zariel (potential redemption), Marrowglass (homebrew quartermaster), Orin (potential redemption; future only).
**Green neutral/mixed:** Velk (homebrew duergar factor), Irix (homebrew illithid exile), Yara (homebrew Abyss guide), Khar (homebrew infernal broker), Grazilaxx (optional lore cameo).
Labels are proposed campaign roles, not immutable canon alignment judgments.

## Connections and story logic
Sable/Tessel -> refuge rescue network -> Abyss captives. Nema/Velk -> mine/trade contracts -> Marrowglass supply ledger -> Avernus depot. Irix/Mystra -> safe portal lens and return anchor. Yara -> Blood War transit gate. Seren/Khar -> infernal contract evidence -> sanctuary -> future Zariel redemption investigation. Lolth/Graz'zt/Baphomet remain independent threats; do not invent a unified villain conspiracy without evidence.

## Verified local tests
Python validator passed: **18 quests, 21 characters, 16 relationships**, all dependencies resolve, quest graph acyclic, three books represented, rewards remain locked, Alice remains level 1 with no acquired artifacts or spent Wishes. This validates data consistency only, not official canon or encounter balance.

## Canon gates
Book numbering still provisional. Verify DR chronology, Qilue/Promenade, Demonweb cosmology, BG3 guest availability, Zariel era, portal mechanics, and high-CR boss level gates. All scenes unplayed, no items or quests awarded. Each quest supports diplomacy, investigation/rescue and tactical alternatives; five-choice UI remains Lawful Good / Neutral Good / Chaotic Good / Utility / Action.
