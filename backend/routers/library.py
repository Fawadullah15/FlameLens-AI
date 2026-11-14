"""
FlameLens AI — NASA Research Library Router
Access full flight papers, abstracts, DOIs, and page-level citations.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import json
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from models.database import get_connection

router = APIRouter(prefix="/library", tags=["NASA Research Library"])


@router.get("/categories", response_model=Dict[str, Any])
def get_library_taxonomy():
    """Return scientific categories, institutions, and source types with document counts."""
    conn = get_connection()
    cat_rows = conn.execute("""
        SELECT category, COUNT(*) as count 
        FROM research_documents 
        WHERE category IS NOT NULL 
        GROUP BY category 
        ORDER BY count DESC
    """).fetchall()

    inst_rows = conn.execute("""
        SELECT institution, COUNT(*) as count 
        FROM research_documents 
        WHERE institution IS NOT NULL 
        GROUP BY institution 
        ORDER BY count DESC
    """).fetchall()

    type_rows = conn.execute("""
        SELECT source_type, COUNT(*) as count 
        FROM research_documents 
        WHERE source_type IS NOT NULL 
        GROUP BY source_type 
        ORDER BY count DESC
    """).fetchall()
    conn.close()

    return {
        "categories": [dict(r) for r in cat_rows],
        "institutions": [dict(r) for r in inst_rows],
        "source_types": [dict(r) for r in type_rows]
    }


@router.get("/papers", response_model=Dict[str, Any])
def list_research_papers(
    category: Optional[str] = Query(None, description="Filter by scientific category"),
    institution: Optional[str] = Query(None, description="Filter by NASA institution/center"),
    source_type: Optional[str] = Query(None, description="Filter by source type"),
    series: Optional[str] = Query(None, description="Filter by series tag (FLEX, ACME, CFI, BASS, SoFIE)"),
    search: Optional[str] = Query(None, description="Search by title, author, or keyword"),
    limit: int = Query(50, ge=1, le=100),
):
    """List peer-reviewed research papers and NASA technical memoranda with multi-faceted filtering."""
    conn = get_connection()
    clauses = []
    params = []

    if category:
        clauses.append("d.category = ?")
        params.append(category)
    if institution:
        clauses.append("d.institution LIKE ?")
        params.append(f"%{institution}%")
    if source_type:
        clauses.append("d.source_type LIKE ?")
        params.append(f"%{source_type}%")
    if series:
        clauses.append("d.series_tags LIKE ?")
        params.append(f"%{series}%")
    if search:
        clauses.append("(d.title LIKE ? OR d.authors LIKE ? OR d.abstract LIKE ? OR d.full_text LIKE ?)")
        term = f"%{search}%"
        params.extend([term, term, term, term])

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    query = f"""
        SELECT 
            d.id,
            d.doc_id,
            d.source_id,
            d.title,
            d.authors,
            d.publication_year,
            d.publication_venue,
            d.doi_or_report_num,
            d.url,
            d.original_url,
            d.abstract,
            d.page_count,
            d.series_tags,
            d.extraction_method,
            d.category,
            d.institution,
            d.source_type,
            d.ingestion_status,
            s.name as source_name,
            s.repository as source_repository,
            s.verification_status
        FROM research_documents d
        LEFT JOIN sources s ON d.source_id = s.source_id
        {where_sql}
        ORDER BY d.publication_year DESC, d.id DESC
        LIMIT ?
    """
    rows = conn.execute(query, params + [limit]).fetchall()
    conn.close()

    return {
        "total": len(rows),
        "papers": [dict(r) for r in rows]
    }


@router.get("/papers/{doc_id}")
def get_paper_detail(doc_id: str):
    """Retrieve full text, structured sections, DOI links, and linked flight experiments."""
    conn = get_connection()
    doc_row = conn.execute("""
        SELECT 
            d.*,
            s.name as source_name,
            s.url as source_url,
            s.repository as source_repository,
            s.verification_status
        FROM research_documents d
        LEFT JOIN sources s ON d.source_id = s.source_id
        WHERE d.doc_id = ?
    """, (doc_id,)).fetchone()

    if not doc_row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")

    doc_dict = dict(doc_row)
    if doc_dict.get("structured_sections_json"):
        try:
            doc_dict["structured_sections"] = json.loads(doc_dict["structured_sections_json"])
        except Exception:
            doc_dict["structured_sections"] = []
    else:
        doc_dict["structured_sections"] = []

    if doc_dict.get("doi_references_json"):
        try:
            doc_dict["doi_references"] = json.loads(doc_dict["doi_references_json"])
        except Exception:
            doc_dict["doi_references"] = []
    else:
        doc_dict["doi_references"] = []

    linked_experiments = conn.execute("""
        SELECT experiment_id, title, series, fuel_type, mission_platform, gravity_level, key_finding
        FROM experiments
        WHERE document_id = ?
    """, (doc_id,)).fetchall()

    conn.close()
    return {
        "document": doc_dict,
        "linked_experiments": [dict(e) for e in linked_experiments]
    }


@router.get("/search")
def search_library(q: str = Query(..., min_length=2)):
    """Full-text search in NASA literature via SQLite FTS5."""
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT 
                doc_id,
                title,
                snippet(research_fts, 2, '<b>', '</b>', '...', 32) as match_snippet,
                citation,
                bm25(research_fts) as rank
            FROM research_fts
            WHERE research_fts MATCH ?
            ORDER BY rank ASC
            LIMIT 15
        """, (q,)).fetchall()
        conn.close()
        return {
            "query": q,
            "results_count": len(rows),
            "results": [dict(r) for r in rows]
        }
    except Exception as e:
        # Fallback to simple query
        rows = conn.execute("""
            SELECT doc_id, title, substr(content, 1, 200) as match_snippet, citation, 1.0 as rank
            FROM research_fts
            WHERE content LIKE ? OR title LIKE ?
            LIMIT 15
        """, (f"%{q}%", f"%{q}%")).fetchall()
        conn.close()
        return {
            "query": q,
            "results_count": len(rows),
            "results": [dict(r) for r in rows]
        }
