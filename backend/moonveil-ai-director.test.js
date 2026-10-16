"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {SYSTEM_PROMPT,validateAiRequest,askMoonveilAi}=require("./moonveil-ai-director");
test("AI story guide keeps Alice level one and denies game authority",()=>{
 assert.match(SYSTEM_PROMPT,/level-one/);assert.match(SYSTEM_PROMPT,/cannot grant XP/);
 assert.deepEqual(validateAiRequest({message:"  Where am I?  "}),{message:"Where am I?",mode:"GUIDE"});
 for(const input of [{message:""},{message:"a".repeat(2001)},{message:"hi",mode:"ROOT"}])assert.throws(()=>validateAiRequest(input),TypeError);
});
test("AI is unavailable without configured API key",async()=>{
 const x=await askMoonveilAi({message:"Help Alice",apiKey:""});
 assert.equal(x.available,false);assert.equal(x.gameMutation,false);
});
test("AI provider response is advisory, bounded and not a game command",async()=>{
 let sent;
 const mock=async(url,options)=>{sent={url,options};return {ok:true,json:async()=>({output:[{content:[{type:"output_text",text:"The silver light guides Alice onward."}]}]})};};
 const x=await askMoonveilAi({message:"What next?",apiKey:"test-api-key-123",fetchImpl:mock});
 assert.equal(x.available,true);assert.equal(x.gameMutation,false);assert.equal(x.advisoryOnly,true);
 assert.match(x.reply,/silver light/);
 assert.equal(sent.url,"https://api.openai.com/v1/responses");
 assert.equal(JSON.parse(sent.options.body).store,false);
 assert.equal(JSON.parse(sent.options.body).input,"What next?");
});

test("dotted model IDs work while unsafe model identifiers fail closed",async()=>{
 const models=[];
 const fetchImpl=async(_url,options)=>{models.push(JSON.parse(options.body).model);return {ok:true,json:async()=>({output:[{content:[{type:"output_text",text:"Advisory lore only."}]}]})};};
 await askMoonveilAi({message:"Guide Alice",model:"gpt-4.1-mini",apiKey:"test-api-key-123",fetchImpl});
 assert.deepEqual(models,["gpt-4.1-mini"]);
 for(const model of ["bad model","../escape","bad\\nmodel",""]){
  await assert.rejects(askMoonveilAi({message:"Guide Alice",model,apiKey:"test-api-key-123",fetchImpl}),{name:"TypeError",message:"INVALID_AI_CONFIGURATION"});
 }
 assert.equal(models.length,1);
});
