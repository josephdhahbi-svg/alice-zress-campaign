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
