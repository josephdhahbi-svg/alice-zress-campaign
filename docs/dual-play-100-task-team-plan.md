# Moonveil Dual-Play — 100-Task Team Plan
Status: PLANNED. No implementation claimed by this document.
Goal: Website and ChatGPT use one authorized server-authoritative campaign state. ChatGPT connection requires a supported integration and user consent. Google work is proposed and not assigned to a connected Google agent.
Task IDs DP001–DP100 avoid conflicts with administration IDs 001–200.

## CHATGPT — Architecture and governance
- [ ] **DP001** Define dual-play product scope and non-goals.
- [ ] **DP002** Map existing browser game features and missing dual-play capabilities.
- [ ] **DP003** Define authoritative ownership of every campaign-state field.
- [ ] **DP004** Specify account linking and explicit player authorization.
- [ ] **DP005** Design session identifiers and campaign identifiers.
- [ ] **DP006** Define save revision and event sequence contracts.
- [ ] **DP007** Specify command/event schemas shared by both play modes.
- [ ] **DP008** Define idempotency keys and duplicate-command handling.
- [ ] **DP009** Define conflict resolution for simultaneous play.
- [ ] **DP010** Specify offline and reconnection behavior.

## CHATGPT — Narrative and gameplay
- [ ] **DP011** Lock Alice Z'ress level-one canonical sheet.
- [ ] **DP012** Document the five-choice narrative contract.
- [ ] **DP013** Map Book 1 scenes to stable scene IDs.
- [ ] **DP014** Specify choice prerequisites and consequence rules.
- [ ] **DP015** Design chat-based dice and skill-check procedures.
- [ ] **DP016** Define turn order and combat action contract.
- [ ] **DP017** Specify inventory and spell resource mutations.
- [ ] **DP018** Create NPC memory and relationship event schemas.
- [ ] **DP019** Design cross-mode quest journal and clue tracking.
- [ ] **DP020** Specify how chat and website share story narration.

## CHATGPT — Continuity and QA
- [ ] **DP021** Define official-versus-homebrew source labels.
- [ ] **DP022** Build DR chronology and planar-location validation rules.
- [ ] **DP023** Preserve ten trilogies thirty books seven traversals.
- [ ] **DP024** Audit hero villain neutral color semantics.
- [ ] **DP025** Specify redemption and romance consent rules.
- [ ] **DP026** Design character progression and ascension gates.
- [ ] **DP027** Define visual asset IDs and accessibility requirements.
- [ ] **DP028** Create cross-mode gameplay acceptance scenarios.
- [ ] **DP029** Create data privacy and retention acceptance checklist.
- [ ] **DP030** Review every milestone against canon and code evidence.

## CHATGPT — Project management and rollout
- [ ] **DP031** Create a unified dual-play dependency board.
- [ ] **DP032** Assign ownership and acceptance criteria to all tasks.
- [ ] **DP033** Separate proposed components from deployed features.
- [ ] **DP034** Coordinate Google and Copilot handoffs.
- [ ] **DP035** Define first Book 1 playable vertical slice.
- [ ] **DP036** Specify phased release gates and rollback plans.
- [ ] **DP037** Write player onboarding and account-linking guide.
- [ ] **DP038** Create defect triage and regression review cadence.
- [ ] **DP039** Verify real website and chat progress reconciliation.
- [ ] **DP040** Publish tested dual-play release and handoff report.

## GOOGLE — Workspace and documentation
- [ ] **DP041** Design optional Google Docs project index.
- [ ] **DP042** Prepare Google Sheets task tracking schema.
- [ ] **DP043** Prepare Google Sheets test case matrix.
- [ ] **DP044** Define optional Google Drive artifact organization.
- [ ] **DP045** Create cross-team change request template.
- [ ] **DP046** Create source-of-truth documentation links.
- [ ] **DP047** Draft Book 1 playtest feedback form.
- [ ] **DP048** Draft accessibility feedback form.
- [ ] **DP049** Draft bug reporting form.
- [ ] **DP050** Prepare milestone review dashboard.

## GOOGLE — Cloud and integration research
- [ ] **DP051** Evaluate Google Cloud hosting options and costs.
- [ ] **DP052** Evaluate managed secrets and access controls.
- [ ] **DP053** Document service account least privilege.
- [ ] **DP054** Plan HTTPS domain and certificate management.
- [ ] **DP055** Evaluate Cloud Run WebSocket constraints.
- [ ] **DP056** Design centralized logs and monitoring dashboards.
- [ ] **DP057** Evaluate backups and recovery storage.
- [ ] **DP058** Define privacy controls for connected accounts.
- [ ] **DP059** Assess quota rate limits and budget alerts.
- [ ] **DP060** Write a Google infrastructure decision memo.

## GOOGLE — QA and player experience
- [ ] **DP061** Create website and mobile browser test matrix.
- [ ] **DP062** Create test accounts and authorization scenarios plan.
- [ ] **DP063** Define save sync smoke-test script.
- [ ] **DP064** Create offline and reconnect test scenarios.
- [ ] **DP065** Design simultaneous chat-and-web conflict tests.
- [ ] **DP066** Prepare screen-reader and keyboard checklist.
- [ ] **DP067** Create latency and load-test plan.
- [ ] **DP068** Design player tutorial and help-center outline.
- [ ] **DP069** Define playtest feedback analysis method.
- [ ] **DP070** Produce evidence-based Google team signoff.

## COPILOT — Shared backend foundation
- [ ] **DP071** Inspect current repository and run baseline tests.
- [ ] **DP072** Implement versioned shared state schema.
- [ ] **DP073** Add database migrations and seed fixtures.
- [ ] **DP074** Implement authenticated player and campaign endpoints.
- [ ] **DP075** Implement campaign event ledger transactions.
- [ ] **DP076** Implement idempotent mutation API.
- [ ] **DP077** Implement revision conflict detection.
- [ ] **DP078** Implement REST snapshot and event history endpoints.
- [ ] **DP079** Implement WebSocket event broadcast after commit.
- [ ] **DP080** Add backend integration tests and CI.

## COPILOT — Website and ChatGPT bridge
- [ ] **DP081** Preserve existing HTML browser game and saves.
- [ ] **DP082** Add safe browser save migration/import flow.
- [ ] **DP083** Connect Book 1 website to shared API.
- [ ] **DP084** Connect Living World Engine to shared API.
- [ ] **DP085** Build secure account linking workflow.
- [ ] **DP086** Implement a supported ChatGPT integration adapter.
- [ ] **DP087** Implement read-only chat campaign snapshot action.
- [ ] **DP088** Implement authorized chat game command action.
- [ ] **DP089** Handle reconnect and stale client revisions.
- [ ] **DP090** Test two-way chat and website state synchronization.

## COPILOT — Gameplay and release
- [ ] **DP091** Implement five-choice decision command handlers.
- [ ] **DP092** Implement auditable dice rolls and skill checks.
- [ ] **DP093** Implement combat and turn transaction rules.
- [ ] **DP094** Implement inventory and spell resource ledger.
- [ ] **DP095** Implement quests NPC memory and consequences.
- [ ] **DP096** Build visible sync status and conflict UI.
- [ ] **DP097** Add responsive map and accessibility regression tests.
- [ ] **DP098** Add backup restore and security checks.
- [ ] **DP099** Create reproducible local Docker deployment.
- [ ] **DP100** Deliver tested Book 1 dual-play vertical slice.

## Release criteria
- An authenticated player can play Book 1 in the website, then resume the same revision in ChatGPT using a supported connector.
- A choice made in either mode produces one durable event and the same visible outcome in the other.
- Conflicting concurrent commands are rejected or reconciled deterministically; no silent overwrites.
- Tests and commit hashes support every DONE status.
- Do not claim Google integrations, ChatGPT tool access, or production deployment before verified.