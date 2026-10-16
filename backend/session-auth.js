"use strict";
const crypto = require("node:crypto");
const id = value => typeof value === "string" && /^[a-zA-Z0-9:_-]{1,100}$/.test(value);
function createSessionAuth(secret, { clock = () => Date.now() } = {}) {
  if(typeof secret!=="string" || secret.length<24)throw new TypeError("Strong local secret required");
  const mac = message => crypto.createHmac("sha256",secret).update(message).digest("base64url");
  function issue(actorId, ttlSeconds = 3600) {
    if(!id(actorId)||!Number.isSafeInteger(ttlSeconds)||ttlSeconds<60||ttlSeconds>86400)
      throw new TypeError("Invalid session parameters");
    const claims={actorId,exp:Math.floor(clock()/1000)+ttlSeconds,nonce:crypto.randomBytes(12).toString("hex")};
    const body=Buffer.from(JSON.stringify(claims)).toString("base64url");
    return body+"."+mac(body);
  }
  function verify(token) {
    if(typeof token!=="string"||token.length>2048)return null;
    const parts=token.split(".");
    if(parts.length!==2||!parts[0]||!parts[1])return null;
    const expected=Buffer.from(mac(parts[0]));
    const supplied=Buffer.from(parts[1]);
    if(expected.length!==supplied.length||!crypto.timingSafeEqual(expected,supplied))return null;
    try{
      const claims=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8"));
      if(!id(claims.actorId)||!Number.isSafeInteger(claims.exp)||claims.exp<=Math.floor(clock()/1000))return null;
      return {actorId:claims.actorId,expiresAt:claims.exp};
    }catch{return null;}
  }
  return {issue,verify};
}
module.exports={createSessionAuth};
