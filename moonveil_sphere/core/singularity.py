"""Descriptive metadata for the proposed Pitch of Ganador cosmology.

This module makes no canon assertion and has no gameplay side effects.
"""
from copy import deepcopy


def get_singularity_metadata():
    return deepcopy({
        "schema_version": "1.0",
        "entity_id": "COSMO_PITCH_OF_GANADOR",
        "name": "Pitch of Ganador",
        "canon_status": "unverified",
        "workflow_status": "proposed",
        "radius": 0.0,
        "radius_semantics": "symbolic_origin_not_physical_measurement",
        "associated_entities": [
            {"name": "Ganador", "canon_status": "unverified"},
            {"name": "Mystra", "canon_status": "official_entity_identity_requires_campaign_date_review"},
            {"name": "Selune", "canon_status": "official_entity_identity_requires_campaign_date_review"},
            {"name": "Eilistraee", "canon_status": "official_entity_identity_requires_campaign_date_review"},
            {"name": "Lathander", "canon_status": "official_entity_identity_requires_campaign_date_review"}
        ],
        "timeline_type": "proposed_closed_loop",
        "historical_date": None,
        "state_effect": "none"
    })
