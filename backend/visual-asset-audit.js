"use strict";
/** Static local asset audit. Does not open files or mutate gameplay. */
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"../prototype");
const assets=["alice-room-atlas.html","moonveil-theme.css","alice-cinematic-ui.html"];
function auditLocalVisualAssets(){
 return assets.map(name=>{
  const full=path.join(root,name);
  if(!fs.existsSync(full))return {name,exists:false};
  const bytes=fs.readFileSync(full);
  return {name,exists:true,bytes:bytes.length,sha256:require("node:crypto").createHash("sha256").update(bytes).digest("hex")};
 });
}
module.exports={auditLocalVisualAssets};
