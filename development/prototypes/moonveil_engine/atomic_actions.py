"""Single-transaction scene + city + trade + rumor resolution, demo only.
Requires engine.py, living_city.py, city_network.py from the downloadable v3 package.
Those modules must use nullcontext() instead of nested 'with db' when db.in_transaction.
"""
from engine import view
from living_city import city_choice, city_view
from city_network import apply_committed_choice, network_view

def resolve_action(db, choice, command_id, expected_revision):
    """Apply every world consequence atomically; duplicate commands return stored state."""
    if db.in_transaction:
        raise RuntimeError('resolve_action requires an idle database transaction')
    db.execute('BEGIN IMMEDIATE')
    with db:
        result = city_choice(db, choice, command_id, expected_revision)
        reaction = apply_committed_choice(db, command_id)
    return {'schemaVersion': 'Omni-Engine V8.0', 'prototype': True,
            'duplicate': result['duplicate'], 'reaction': reaction,
            'player': view(db), 'city': city_view(db), 'network': network_view(db)}
