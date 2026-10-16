# Moonveil — Administration Master 100-Task Order

Status: ACTIVE BACKLOG; unchecked tasks are not claimed complete. This list supersedes neither prior evidence nor the separate historical task numbering.

## Operating contract
- Preserve canonical records; use change logs and explicit decisions.
- Every task requires an artifact, test, or cited evidence before DONE.
- Execute dependencies first; never equate planning with implementation.
- Maintain the five-choice interface, cinematic realistic art, and historical continuity.

## Administration and governance

- [ ] **001** Inventory every repository folder and file.
- [ ] **002** Define the single source of truth for each record type.
- [ ] **003** Assign stable IDs to all administrative records.
- [ ] **004** Separate locked canon, working canon, homebrew, and proposals.
- [ ] **005** Create a decision log with owners and rationale.
- [ ] **006** Define P0–P3 priorities and escalation rules.
- [ ] **007** Track dependencies, blockers, and acceptance criteria.
- [ ] **008** Create a weekly change log and milestone register.
- [ ] **009** Define evidence required before marking DONE.
- [ ] **010** Audit conflicting task lists without renumbering history.

## Repository and quality control

- [ ] **011** Inspect all existing GitHub workflows.
- [ ] **012** Audit README and navigation links.
- [ ] **013** Audit Book 1 game source and event wiring.
- [ ] **014** Audit Living World Engine browser interactions.
- [ ] **015** Review Automaton FSM transition code and tests.
- [ ] **016** Run Python data and story validators.
- [ ] **017** Run Node FSM regression tests.
- [ ] **018** Add real-browser interaction tests.
- [ ] **019** Document reproducible defects and fixes.
- [ ] **020** Require green CI and reviewed changes for releases.

## Data architecture and persistence

- [ ] **021** Document canonical JSON schemas and relationships.
- [ ] **022** Validate character, item, spell, and location IDs.
- [ ] **023** Define versioned WorldState and Entity contracts.
- [ ] **024** Add safe save import and migration tests.
- [ ] **025** Define campaign event and journal schemas.
- [ ] **026** Design SQLite migrations and rollback strategy.
- [ ] **027** Implement database WAL with verified durability.
- [ ] **028** Create transactional campaign-state operations.
- [ ] **029** Add backup and restore verification.
- [ ] **030** Document privacy, retention, and recovery policies.

## Backend and networking

- [ ] **031** Create isolated Node backend service scaffold.
- [ ] **032** Define REST health and version endpoints.
- [ ] **033** Implement strict command payload validation.
- [ ] **034** Add authentication and authorization contracts.
- [ ] **035** Design raw WebSocket endpoint and event protocol.
- [ ] **036** Implement authenticated command routing.
- [ ] **037** Persist successful FSM transitions as events.
- [ ] **038** Add telemetry subscriptions and rate limiting.
- [ ] **039** Test reconnect, concurrency, and conflict handling.
- [ ] **040** Document server security and operational boundaries.

## Flutter and user experience

- [ ] **041** Create Flutter client skeleton without replacing browser prototype.
- [ ] **042** Define provider-based client state boundaries.
- [ ] **043** Build connection manager with correct lifecycle.
- [ ] **044** Build accessible telemetry and command cards.
- [ ] **045** Create character sheets and inventory panels.
- [ ] **046** Implement five ordered narrative choice buttons.
- [ ] **047** Build responsive map and entity selection interface.
- [ ] **048** Support mouse, touch, keyboard, and reduced motion.
- [ ] **049** Add local error recovery and offline messaging.
- [ ] **050** Run Flutter unit, widget, and browser tests.

## D&D mechanics and gameplay

- [ ] **051** Verify Alice's canonical level-one character build.
- [ ] **052** Separate official 2024 rules from custom origin gifts.
- [ ] **053** Define deterministic and auditable dice outcomes.
- [ ] **054** Implement ability and skill check resolution.
- [ ] **055** Model action economy and initiative.
- [ ] **056** Implement HP, conditions, and resource changes.
- [ ] **057** Define equipment and inventory transaction rules.
- [ ] **058** Implement spellcasting prerequisites and effects.
- [ ] **059** Add tactical grid, range, and movement validation.
- [ ] **060** Connect choices and combat to persistent consequences.

## Story and lore continuity

- [ ] **061** Audit the ten-trilogy and thirty-book catalog.
- [ ] **062** Preserve seven circular traversals as established structure.
- [ ] **063** Build chronology and plane-location validators.
- [ ] **064** Record source provenance and canon status.
- [ ] **065** Audit Eilistraee, Ghaunadaur, and Lolth roles.
- [ ] **066** Track Infinite Hallway clues and payoff references.
- [ ] **067** Link Underdark, Abyss, Avernus, and Ravenloft arcs.
- [ ] **068** Design earned villain-redemption quest gates.
- [ ] **069** Check every named NPC against era and availability.
- [ ] **070** Verify Book 1 opening-to-save narrative continuity.

## Living world simulation

- [ ] **071** Define faction influence and relationship variables.
- [ ] **072** Define settlement supply, safety, and morale.
- [ ] **073** Add world-time advancement and scheduling.
- [ ] **074** Implement deterministic NPC patrol schedules.
- [ ] **075** Implement obstacle-aware pathfinding.
- [ ] **076** Model scene lighting, mist, and hazards.
- [ ] **077** Add portals and cross-scene travel validation.
- [ ] **078** Create persistent quest and clue triggers.
- [ ] **079** Add debugging tools for causal world-state changes.
- [ ] **080** Simulate a complete save/reload world cycle.

## Visual art and asset operations

- [ ] **081** Audit asset manifest and missing binaries.
- [ ] **082** Enforce realistic cinematic fantasy art style.
- [ ] **083** Verify Alice portrait against approved references.
- [ ] **084** Prepare individual images rather than production sprite sheets.
- [ ] **085** Check alpha channels and transparent edges.
- [ ] **086** Normalize filenames and asset IDs.
- [ ] **087** Commit approved binaries and update manifest status.
- [ ] **088** Integrate environment plates and character portraits.
- [ ] **089** Test mobile layout, contrast, and fallback imagery.
- [ ] **090** Create searchable asset catalog and visual QA checklist.

## Deployment and release administration

- [ ] **091** Audit Docker and hosting prerequisites.
- [ ] **092** Create backend Dockerfile with complete runtime files.
- [ ] **093** Create Flutter build and Nginx container.
- [ ] **094** Configure persistent Docker Compose volumes.
- [ ] **095** Define TLS and WebSocket reverse proxy settings.
- [ ] **096** Keep secrets out of Git and validate permissions.
- [ ] **097** Build CI tests and image publishing with scoped tokens.
- [ ] **098** Add metrics, health checks, and backup verification.
- [ ] **099** Run end-to-end security and gameplay release checks.
- [ ] **100** Publish milestone report, remaining risks, and next handoff.

## Tracking fields
Task ID | Priority | Status | Owner | Dependencies | Artifact | Test evidence | Canon impact | Next action.

## Session cycle
Inspect -> Select -> Build -> Test -> Commit -> Update board -> Handoff.
