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
    if not isinstance(payload, dict):
        raise ValueError("Event payload must be an object")
    serialized = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    # Acquire the writer lock before checking revision to serialize competing writers.
    conn.execute("BEGIN IMMEDIATE")
    try:
        existing = conn.execute(
            "SELECT id, revision FROM campaign_events WHERE campaign_id=? AND idempotency_key=?",
            (campaign_id, key)).fetchone()
        if existing:
            conn.commit()
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
        conn.commit()
        return {"event_id": event_id, "revision": revision, "replayed": False}
    except BaseException:
        conn.rollback()
        raise

def create_campaign(conn, campaign_id):
    """Create a campaign without replacing an existing save."""
    if not isinstance(campaign_id, str) or not campaign_id.strip():
        raise ValueError("Campaign ID required")
    with conn:
        conn.execute("INSERT INTO campaigns(id) VALUES(?)", (campaign_id,))


def campaign_snapshot(conn, campaign_id, after_revision=0):
    """Read committed campaign revision and ordered event history.

    after_revision is an exclusive cursor; this is not a projected character
    sheet and does not perform authorization. Only call after access checks.
    """
    if not isinstance(campaign_id, str) or not campaign_id.strip():
        raise ValueError("Campaign ID required")
    if type(after_revision) is not int or after_revision < 0:
        raise ValueError("Invalid event cursor")
    row = conn.execute("SELECT revision FROM campaigns WHERE id=?", (campaign_id,)).fetchone()
    if row is None:
        raise KeyError("Unknown campaign")
    events = conn.execute(
        "SELECT id,revision,event_type,payload_json,created_at FROM campaign_events "
        "WHERE campaign_id=? AND revision>? ORDER BY revision",
        (campaign_id, after_revision)).fetchall()
    return {
        "campaign_id": campaign_id,
        "revision": row[0],
        "events": [
            {"event_id": event_id, "revision": revision, "type": event_type,
             "payload": json.loads(payload), "created_at": created_at}
            for event_id, revision, event_type, payload, created_at in events
        ],
    }
