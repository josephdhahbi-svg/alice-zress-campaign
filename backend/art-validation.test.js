"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {validateArt}=require("../scripts/validate-art");
test("current concept-only manifest validates without pretending images exist",()=>{
 const m=require("../assets/manifest.json");assert.deepEqual(validateArt(m),[]);
});
test("ready art requires a tracked file and matching SHA-256",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-art-"));
 try{
  const asset={id:"ENV999",path:"assets/environments/ENV999_Test.png",status:"ready"};
  assert.match(validateArt({assets:[asset]},dir).join(" "),/file missing/);
  const file=path.join(dir,asset.path);fs.mkdirSync(path.dirname(file),{recursive:true});
  const png=Buffer.concat([Buffer.from("89504e470d0a1a0a","hex"),Buffer.alloc(24)]);
  fs.writeFileSync(file,png);
  assert.match(validateArt({assets:[asset]},dir).join(" "),/SHA-256/);
  asset.sha256=crypto.createHash("sha256").update(png).digest("hex");
  assert.deepEqual(validateArt({assets:[asset]},dir),[]);
  fs.writeFileSync(file,Buffer.from("not a png"));
  assert.match(validateArt({assets:[asset]},dir).join(" "),/invalid PNG/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test("rejects duplicate IDs and unsafe paths",()=>{
 const a={id:"C001",path:"assets/characters/C001_Alice.png",status:"pending"};
 const errors=validateArt({assets:[a,a,{id:"C002",path:"assets/../secret.png",status:"ready"}]});
 assert.ok(errors.some(x=>x.includes("duplicate")));
 assert.ok(errors.some(x=>x.includes("unsafe path")));
});
