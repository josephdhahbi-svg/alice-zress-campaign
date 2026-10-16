"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { issueSession, verifySession } = require("./player-session");
const secret = "test-only-session-signing-secret-at-least-32-bytes";
test("signed player session is bound to identity, role and campaign", () => {
  const now = 1700000000000;
  const token = issueSession({ secret, actorId: "alice", campaignId: "book01", role: "PLAYER", now });
  assert.equal(verifySession({ secret, token, campaignId: "book01", now: now + 1 }).actorId, "alice");
  assert.equal(verifySession({ secret, token, campaignId: "book02", now: now + 1 }), null);
  assert.equal(verifySession({ secret, token, now: now + 15 * 60 * 1000 }), null);
  assert.equal(verifySession({ secret: secret + "x", token, now: now + 1 }), null);
  assert.equal(verifySession({ secret, token: token.slice(0, -1) + (token.endsWith("a") ? "b" : "a"), now: now + 1 }), null);
});
test("reject malformed claims and unsafe session parameters", () => {
  assert.throws(() => issueSession({ secret: "short", actorId: "alice", campaignId: "book01", role: "DM" }));
  assert.throws(() => issueSession({ secret, actorId: "../alice", campaignId: "book01", role: "DM" }));
  assert.throws(() => issueSession({ secret, actorId: "alice", campaignId: "book01", role: "ADMIN" }));
  assert.equal(verifySession({ secret, token: "not-a-token" }), null);
  assert.equal(verifySession({ secret, token: "" }), null);
});
