"""
FlameLens AI — Spacecraft Fire Incidents Router
NASA Historical Spaceflight Fire Incidents (Apollo 1, Apollo 13, Mir 1997)
Sourced from NASA Safety Center (SMA), NASA History Office, and Mishap Investigation Boards.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/incidents", tags=["Spacecraft Fire Incidents"])


@router.get("", response_model=List[Dict[str, Any]])
def list_incidents():
    """List all historical spacecraft fire incidents with flight environment and outcomes."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            i.id,
            i.incident_id,
            i.mission_name,
            i.date,
            i.spacecraft,
            i.location,
            i.summary,
            i.fire_environment,
            i.ignition_source,
            i.materials_involved,
            i.consequences,
            i.documented_lessons_learned,
            i.relevance_to_modern_spacecraft,
            i.nasa_reference_url,
            i.category,
            s.name as source_name,
            s.organization as source_organization
        FROM historical_incidents i
        LEFT JOIN sources s ON i.source_id = s.source_id
        ORDER BY i.date ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.get("/{incident_id}", response_model=Dict[str, Any])
def get_incident_detail(incident_id: str):
    """Retrieve full incident dossier, environmental conditions, and lessons learned."""
    conn = get_connection()
    row = conn.execute("""
        SELECT 
            i.*,
            s.name as source_name,
            s.organization as source_organization,
            s.repository as source_repository,
            s.verification_status
        FROM historical_incidents i
        LEFT JOIN sources s ON i.source_id = s.source_id
        WHERE i.incident_id = ?
    """, (incident_id,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"Spacecraft incident '{incident_id}' not found in NASA historical records."
        )

    return dict(row)
