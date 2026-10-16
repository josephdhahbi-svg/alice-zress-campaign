"use strict";
/**
 * Asset registry validation, independent of image hosting.
 * Never assume an artwork record means an image is installed.
 */
const VALID_STATUS=new Set(["INTAKE","NEEDS_REVISION","APPROVED","INTEGRATED","VERIFIED"]);
const ID=/^ART-[A-Z0-9-]{3,48}$/;
function validateAssetRecord(asset){
 if(!asset||typeof asset!=="object"||Array.isArray(asset))return ["INVALID_RECORD"];
 const errors=[];
 if(typeof asset.id!=="string"||!ID.test(asset.id))errors.push("INVALID_ID");
 if(typeof asset.title!=="string"||!asset.title.trim())errors.push("MISSING_TITLE");
 if(typeof asset.source!=="string"||!asset.source.trim())errors.push("MISSING_SOURCE");
 if(!VALID_STATUS.has(asset.status))errors.push("INVALID_STATUS");
 if(["INTEGRATED","VERIFIED"].includes(asset.status)&&
   (typeof asset.repoPath!=="string"||!/^assets\/[a-zA-Z0-9_./-]+$/.test(asset.repoPath)||asset.repoPath.includes("..")))
  errors.push("MISSING_SAFE_REPO_PATH");
 if(asset.status==="VERIFIED"&&(!asset.sha256||!/^[a-f0-9]{64}$/i.test(asset.sha256)||!asset.renderEvidence))
  errors.push("MISSING_VERIFICATION_EVIDENCE");
 if(asset.status==="VERIFIED"&&asset.approved!==true)errors.push("NOT_APPROVED");
 return errors;
}
function auditAssetRegistry(records){
 if(!Array.isArray(records))throw new TypeError("ASSET_LIST_REQUIRED");
 const ids=new Set(),errors=[];
 for(const asset of records){
  const issues=validateAssetRecord(asset);
  if(asset&&typeof asset.id==="string"){
   if(ids.has(asset.id))issues.push("DUPLICATE_ID");
   ids.add(asset.id);
  }
  if(issues.length)errors.push({id:asset?.id||null,issues});
 }
 return {valid:errors.length===0,total:records.length,errors};
}
module.exports={validateAssetRecord,auditAssetRegistry};
