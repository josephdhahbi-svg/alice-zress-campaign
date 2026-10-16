"use strict";
/**
 * Moonveil player-session tokens. Standalone security primitive; NOT wired into
 * server.js yet. Existing loopback-only development behavior is unchanged.
 */
const crypto = require("node:crypto");
const ID = /^[A-Za-z0-9:_-]{1,100}$/;
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
function assertSecret(secret) {
  if (typeof secret !== "string" || Buffer.byteLength(secret) < 32)
    throw new Error("Session signing secret must be at least 32 bytes");
}
function sign(secret, body) {
  return crypto.createHmac("sha256", secret).update(body).digest("base64url");
}
function issueSession({ secret, actorId, campaignId, role, now = Date.now(), ttlMs = 15 * 60 * 1000 }) {
  assertSecret(secret);
  if (!ID.test(actorId || "") || !ID.test(campaignId || "") ||
      !["DM", "PLAYER", "OBSERVER"].includes(role) ||
      !Number.isSafeInteger(now) || !Number.isSafeInteger(ttlMs) ||
      ttlMs < 1000 || ttlMs > 60 * 60 * 1000)
    throw new Error("Invalid session claims");
  const claims = { v: 1, actorId, campaignId, role, iat: now, exp: now + ttlMs };
  const body = encode(claims);
  return body + "." + sign(secret, body);
}
function verifySession({ secret, token, campaignId, now = Date.now() }) {
  assertSecret(secret);
  if (typeof token !== "string" || token.length > 2048 ||
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return null;
  const [body, signature] = token.split(".");
  const expected = sign(secret, body);
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let claims;
  try { claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); }
  catch { return null; }
  if (!claims || claims.v !== 1 || !ID.test(claims.actorId || "") ||
      !ID.test(claims.campaignId || "") ||
      !["DM", "PLAYER", "OBSERVER"].includes(claims.role) ||
      !Number.isSafeInteger(claims.iat) || !Number.isSafeInteger(claims.exp) ||
      !Number.isSafeInteger(now) || claims.iat > now ||
      claims.exp <= now || claims.exp - claims.iat > 60 * 60 * 1000 ||
      (campaignId !== undefined && claims.campaignId !== campaignId)) return null;
  return claims;
}
module.exports = { issueSession, verifySession };
