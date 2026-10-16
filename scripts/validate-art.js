"use strict";
/** Validate tracked Moonveil art before GitHub Pages deployment. No network or image generation. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"..");
function validateArt(manifest,base=root){
 const errors=[],seen=new Set();
 if(!manifest||!Array.isArray(manifest.assets))return ["Invalid art manifest"];
 for(const asset of manifest.assets){
  if(!asset||typeof asset.id!=="string"||!/^[A-Z]+[0-9]{3}$/.test(asset.id)){errors.push("Invalid asset ID");continue;}
  if(seen.has(asset.id))errors.push(asset.id+": duplicate ID");seen.add(asset.id);
  if(!["pending","ready"].includes(asset.status))errors.push(asset.id+": invalid status");
  if(typeof asset.path!=="string"||!/^assets\/[a-z0-9_/-]+\.png$/.test(asset.path)||asset.path.includes("..")){errors.push(asset.id+": unsafe path");continue;}
  const full=path.resolve(base,asset.path);
  if(!full.startsWith(path.resolve(base)+path.sep)){errors.push(asset.id+": path escape");continue;}
  const exists=fs.existsSync(full);
  if(asset.status==="ready"){
   if(!exists){errors.push(asset.id+": ready file missing");continue;}
   const data=fs.readFileSync(full);
   if(data.length<24||!data.subarray(0,8).equals(Buffer.from("89504e470d0a1a0a","hex")))errors.push(asset.id+": invalid PNG signature");
   if(typeof asset.sha256!=="string"||!(/^[a-f0-9]{64}$/.test(asset.sha256))||crypto.createHash("sha256").update(data).digest("hex")!==asset.sha256)errors.push(asset.id+": missing or mismatched SHA-256");
  }else if(exists)errors.push(asset.id+": file exists but status is pending; review provenance before enabling");
 }
 return errors;
}
if(require.main===module){
 const errors=validateArt(require("../assets/manifest.json"));
 if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}
 else console.log("Moonveil art catalog validated; pending images remain unavailable.");
}
module.exports={validateArt};
