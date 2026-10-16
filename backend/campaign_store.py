"""Minimal transactional SQLite campaign event ledger (Python standard library).

This is a tested foundation, not a deployed game server or ChatGPT bridge.
"""
import json
import sqlite3

SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS campaigns (
 id TEXT PRIMARY KEY,
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0)
);
CREATE TABLE IF NOT EXISTS campaign_events (
 id TEXT PRIMARY KEY,
 campaign_id TEXT NOT NULL REFERENCES campaigns(id),
 revision INTEGER NOT NULL CHECK(revision>0),
 idempotency_key TEXT NOT NULL,
 event_type TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(campaign_id, revision),
 UNIQUE(campaign_id, idempotency_key)
);
"""

def initialize(conn):
    conn.execute("PRAGMA foreign_keys=ON")
    conn.executescript(SCHEMA)

def append_event(conn, campaign_id, event_id, key, event_type, payload, expected_revision):
    if not all(isinstance(x, str) and x.strip() for x in (campaign_id, event_id, key, event_type)):
        raise ValueError("Identifiers and event type are required")
    if type(expected_revision) is not int or expected_revision < 0:
        raise ValueError("Invalid expected revision")
    serialized = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    with conn:
        existing = conn.execute(
            "SELECT id, revision FROM campaign_events WHERE campaign_id=? AND idempotency_key=?",
            (campaign_id, key)).fetchone()
        if existing:
            return {"event_id": existing[0], "revision": existing[1], "replayed": True}
        current = conn.execute("SELECT revision FROM campaigns WHERE id=?", (campaign_id,)).fetchone()
        if current is None:
            raise KeyError("Unknown campaign")
        if current[0] != expected_revision:
            raise RuntimeError("REVISION_CONFLICT")
        revision = current[0] + 1
        conn.execute(
            "INSERT INTO campaign_events(id,campaign_id,revision,idempotency_key,event_type,payload_json) VALUES(?,?,?,?,?,?)",
            (event_id, campaign_id, revision, key, event_type, serialized))
        conn.execute("UPDATE campaigns SET revision=? WHERE id=? AND revision=?",
                     (revision, campaign_id, expected_revision))
        return {"event_id": event_id, "revision": revision, "replayed": False}
