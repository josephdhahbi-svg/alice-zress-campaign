"""Read-only Book 1 snapshot adapter. No public network endpoint or auth bypass.

Use only after the caller's campaign access has been authorized.
"""
from book1_projection import project_book1
from campaign_store import campaign_snapshot


def book1_state(conn, campaign_id):
    """Return the complete deterministic Book 1 projection and event revision.

    Full replay is required: projecting a cursor-only delta would omit
    earlier decisions and produce an incomplete character history.
    """
    snapshot = campaign_snapshot(conn, campaign_id)
    return project_book1(snapshot)
