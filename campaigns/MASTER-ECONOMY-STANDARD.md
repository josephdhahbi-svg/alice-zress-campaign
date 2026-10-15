# Moonveil Master Economy Ledger Standard

Status: **LOCKED ADMINISTRATION RULE**
Applies to: MEGA-001 Netherdeck, MEGA-002 Sword Coast Second Deck, and future connected Moonveil campaigns.

## Core economic rule
Money is a real game resource. Every item, service, material, reward, repair, trade, toll, wage, lodging cost, crafting input, consumable, treasure sale, and quest payment must be recorded.

The master economy must answer at any moment:
- How much money does each character have?
- How much does the party treasury have?
- What did every item cost?
- What is every owned item's acquisition value and current value?
- What has been earned, spent, sold, lost, stolen, donated, destroyed, crafted, repaired, or invested?
- Which NPC/faction received or paid the money?
- What economic consequences did the party create?

## Currency
Track canonical denominations separately rather than flattening the ledger:
CP = copper pieces
SP = silver pieces
EP = electrum pieces when used
GP = gold pieces
PP = platinum pieces

Also store a normalized GP-equivalent field for analytics. Never discard original denominations.

## Required item-price fields
Every item ID (ITM/LEG/COR/REL/OBJ etc.) receives:
- item_id
- name
- category
- rarity/status
- source/canon/homebrew status
- seller/origin
- location
- listed_price
- negotiated_price
- acquisition_method
- acquisition_cost
- crafting_material_cost
- labor_cost
- repair_cost
- identification/appraisal cost
- attunement or special-use cost if applicable
- sale_value
- current_estimated_value
- replacement_cost
- quantity
- owner
- acquisition dungeon/quest
- transaction IDs
- notes/price justification

For priceless, unique, quest-bound, illegal, cursed, artifact, or nonmarket objects, record MARKET_STATUS rather than inventing an ordinary shop price. Costs to transport, secure, research, repair, purify, insure, or politically obtain them can still be tracked.

## Transaction IDs
All monetary movement uses `TXN-######`.
Fields:
transaction_id, campaign_id, dungeon_id, quest_id, timestamp/sequence, payer, payee, transaction_type, item/service IDs, quantities, CP/SP/EP/GP/PP amounts, normalized_gp, price_before_negotiation, final_price, discount/markup reason, skill/check ID if negotiated, faction/reputation modifier, location, receipt/evidence, notes.

Transaction types:
LOOT, QUEST_REWARD, PURCHASE, SALE, WAGE, HIRE, LODGING, FOOD, TRAVEL, TOLL, BRIBE, DONATION, TAX/FEE, CRAFT, MATERIAL, REPAIR, APPRAISAL, SPELL_SERVICE, MEDICAL, RESEARCH, TRAINING, INVESTMENT, LOSS, THEFT, RECOVERY, DEBT, LOAN, INTEREST, TRADE/BARTER, OTHER.

## Wallets and treasury
Each PC gets `WALLET-PC-###`.
Each party gets a treasury, e.g. `TREASURY-SC5`.
NPC businesses/factions can receive ECON IDs when recurring.
After each transaction store before/after balances so arithmetic can be audited.

## Economy by dungeon
Every dungeon report adds:
starting party wealth;
cash loot;
item loot and estimated value;
quest payments;
purchases;
consumables used;
repairs;
services;
travel/lodging/food;
crafting costs;
tolls/fees;
sales;
donations/bribes;
losses/theft;
ending liquid wealth;
ending item wealth;
net wealth change.

## Profession/economy interaction
Professions must affect the economy when logical:
merchant/appraiser -> prices and provenance;
smith/carpenter/mason/engineer -> labor/material/repair costs;
healer/herbalist -> treatment and supplies;
cook -> food/supply efficiency;
navigator/cartographer -> travel/time cost;
entertainer/musician -> income, access, reputation;
investigator/scholar -> research/appraisal costs;
thief/security specialist -> loss prevention/recovery;
diplomat -> contracts/tolls/negotiation;
artisan -> crafting and resale value.

Record the actual check and resulting discount, markup, saved time, avoided loss, or added value. Do not award arbitrary money just because a profession was mentioned.

## Dynamic local economy
Prices may vary by:
settlement/region;
scarcity;
danger;
war/disaster;
supply routes;
faction standing;
legal status;
merchant attitude;
party decisions;
repaired/destroyed infrastructure;
trade-road control;
availability.

Always preserve BASE/REFERENCE price separately from LOCAL price and FINAL paid price so we can see why a price changed.

## MEGA-002 economic callbacks
SC-SQ-001 civic trust can alter Baldur's Gate services/access.
SC-SQ-002 beacon control changes coastal navigation/shipping costs.
SC-SQ-003 rescued professions alter repair, healing, navigation, and conservation costs.
SC-SQ-004 road governance directly changes tolls, merchant prices, security and trade volume.
SC-SQ-005 provenance ruling changes relic legality, market access, faction prices, and vault rewards.
Aveline Rook, Vhaera Nhal, Brikk Fen, Tavia Bronzethread and other recurring economic NPCs receive transaction/faction ledgers.

## Treasure rule
Treasure has both **game utility** and **economic history**.
Finding a 500 GP object does not automatically add 500 GP cash. It becomes an owned asset until sold/traded/spent.
Quest relics can have MARKET_STATUS=QUEST_BOUND or PRICELESS.
Selling an important artifact can permanently alter later quests, NPCs, faction standing and endings.

## Master-sheet columns
ECON summary per character:
PC_ID | Cash CP | SP | EP | GP | PP | GP Equivalent | Owned Item Value | Debt | Receivables | Net Worth | Lifetime Earned | Lifetime Spent | Lifetime Loot Value | Lifetime Donations | Lifetime Losses

Item economy:
ITEM_ID | Owner | Qty | Base/Reference Price | Local Price | Final Cost | Sale Value | Current Value | Acquisition | TXN_ID | Location | Status

Dungeon economy:
DNG_ID | Starting Cash | Cash Earned | Loot Value | Purchases | Services | Travel | Craft/Repair | Fees/Tolls | Donations | Losses | Sales | Ending Cash | Ending Asset Value | Net Change

## Audit gates
A dungeon cannot be economically CANONIZED if:
- treasure has no owner/status;
- a purchase/sale lacks a transaction;
- cash changes without a TXN ID;
- an item with market value has no price/value field;
- a unique/priceless item lacks a market-status explanation;
- beginning balance + inflows - outflows does not reconcile to ending balance.

The final campaign report must reconcile every wallet and treasury and show total money created, removed, transferred, invested, lost, and held as assets.
