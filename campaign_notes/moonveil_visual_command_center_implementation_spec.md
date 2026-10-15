# Moonveil Visual Command Center — implementation checkpoint
Date: 2026-10-14
Status: SPECIFICATION / proposed Flutter integration, NOT verified as running.

## User-supplied prototype
Flutter `VisualCommandCenter` uses Provider's `InventoryProvider`, a two-column GridView, restricted-item opacity, and a modal bottom sheet. It currently uses placeholder icons rather than item pictures. The "Roll D20 Check & Trigger AI-DM" button only closes the sheet and displays a SnackBar; no random roll, physics, webhook or persistence occurs. The code presupposes an InventoryProvider implementation not verified in this repository.

## Build in phases
1. Codex data: item_id, name, image_asset_or_url, rarity_official, rarity_ui, source, canon_status, description, stats, acquisition_prerequisites, ownership_state, category_library_id. Display artwork with loading/error fallbacks and accessible labels. Distinguish locked, discovered, secured, owned, equipped, purified.
2. Inspection bottom sheet: show actual picture, item description, mechanical stats, lore, source, status and quest gate. A locked item may be inspected but cannot be used.
3. Dice service: secure/random d20 value 1–20, explicit modifier, total, roll_id and timestamp; animate dice only as presentation. Preserve raw result and audit log.
4. Backend: authenticated POST of action/roll with idempotency key and game/session ID; server validates inventory, prerequisites, roll and state changes. Never trust the client alone for artifact ownership.
5. Persistence: Node.js API and SQLite WAL transactions for canonical event ledger. GitHub stores versioned game design and source code, NOT a real-time multiplayer state database. Flutter subscribes to backend state changes; retries and offline reconciliation need design and tests.
6. Gameplay UI: four story comic panels + full-width five-choice panel (Lawful Good, Neutral Good, Chaotic Good, Utility, Action). Images and large touch targets; confirmation for irreversible selections.

## Campaign constraints
Alice is Level 1; Book of Vile Darkness, Hand of Vecna, Eye of Vecna, Solar/Visage, and all late-game treasures remain locked until quests. User essence colors: Far Realm purple, Undead green, Light white, Magic blue. Fiend color pending. NPC morality colors are a separate legend.

## Acceptance criteria
- Item picture renders or shows a documented fallback.
- Tap opens details; locked items cannot be used.
- Roll returns a real 1–20 value and records modifier/total.
- UI only says AI-DM updated after successful backend acknowledgement.
- Network failure shows retry/error; does not fabricate success.
- Repeated roll submissions cannot duplicate rewards or events.
- Tests cover restricted access, acquisition, synchronization, and persistence recovery.

## Next integration dependency
Before wiring into the actual Flutter app, verify its project root, provider model and existing backend routes. User-supplied `lib/screens/VisualCommandCenter.dart` is a prototype, not evidence of deployed files.
