"""
FlameLens AI — Sources Router
Authoritative NASA repository tracking and provenance verification.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/sources", tags=["NASA Sources & Repositories"])


@router.get("", response_model=List[Dict[str, Any]])
def get_sources():
    """Retrieve all authoritative NASA repositories and flight literature sources."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            s.*,
            (SELECT COUNT(*) FROM experiments e WHERE e.source_id = s.source_id) as linked_experiments_count,
            (SELECT COUNT(*) FROM research_documents d WHERE d.source_id = s.source_id) as linked_documents_count
        FROM sources s
        ORDER BY s.id ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.get("/{source_id}")
def get_source_details(source_id: str):
    """Retrieve single source provenance details and associated flight experiments."""
    conn = get_connection()
    source_row = conn.execute("SELECT * FROM sources WHERE source_id = ?", (source_id,)).fetchone()
    if not source_row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")

    experiments = conn.execute(
        "SELECT experiment_id, title, series, fuel_type, mission_platform, gravity_level FROM experiments WHERE source_id = ?",
        (source_id,)
    ).fetchall()

    documents = conn.execute(
        "SELECT doc_id, title, authors, publication_year, url, page_count FROM research_documents WHERE source_id = ?",
        (source_id,)
    ).fetchall()

    conn.close()
    return {
        "source": dict(source_row),
        "experiments": [dict(e) for e in experiments],
        "documents": [dict(d) for d in documents]
    }
