"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
test("Alice UI exposes optional signed AI Story Guide without unsafe DOM insertion",()=>{
 const html=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.html"),"utf8");
 const js=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.js"),"utf8");
 assert.match(html,/id="ai-guide-form"/);
 assert.match(html,/id="ai-guide-question"/);
 assert.match(html,/id="ai-guide-reply"/);
 assert.match(js,/\/ai\/chat/);
 assert.match(js,/Authorization.*Bearer/);
 assert.match(js,/ai-guide-reply"\)\.textContent=data\.reply/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage/);
});

test("AI UI checks signed availability and guards against stale disconnected responses",()=>{
 const js=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.js"),"utf8");
 assert.match(js,/async function refreshAiStatus\(\)/);
 assert.match(js,/\/ai\/status/);
 assert.match(js,/!data\.configured/);
 assert.match(js,/sessionEpoch\+\+/);
 assert.match(js,/epoch!==sessionEpoch/);
 assert.match(js,/AI offline: server key not configured/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage/);
});

test("DM UI exposes review, attestation, and safe DOM-only rendering",()=>{
 const html=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.html"),"utf8");
 const js=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.js"),"utf8");
 assert.match(html,/id="dm-refresh"/);
 assert.match(html,/id="dm-queue"/);
 assert.match(js,/async function refreshDmQueue\(\)/);
 assert.match(js,/\/quests\/objectives\/attest-journal/);
 assert.match(js,/ACKNOWLEDGED/);
 assert.match(js,/DECLINED/);
 assert.match(js,/Session changed/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage/);
});

test("multiverse quest atlas uses signed read-only previews and safe rendering",()=>{
 const html=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.html"),"utf8");
 const js=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.js"),"utf8");
 assert.match(html,/id="quest-chains-refresh"/);
 assert.match(html,/id="quest-chains-list"/);
 assert.match(js,/async function refreshMultiverseQuestAtlas\(\)/);
 assert.match(js,/\/quests\/multiverse-chains/);
 assert.match(js,/epoch!==sessionEpoch/);
 assert.match(js,/document\.createElement\("ol"\)/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage/);
});

test("scene action UI is connected and uses safe read-only preview controls",()=>{
 const html=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.html"),"utf8");
 const js=fs.readFileSync(path.join(__dirname,"../prototype/alice-room-atlas.js"),"utf8");
 assert.match(html,/id="scene-actions-refresh"/);
 assert.match(html,/id="scene-actions-list"/);
 assert.match(js,/async function refreshSceneActions\(\)/);
 assert.match(js,/\/scenes\/pit_ghaunadaur\/actions/);
 assert.match(js,/result\.preview\.action\.result/);
 assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage/);
});
