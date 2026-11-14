"""
FlameLens AI — Grounded RAG Retrieval Service
Multi-Modal NASA Research Engine:
  1. SQLite FTS5 with BM25 Ranking across 26 research docs, 29 flight runs, and 3 mission incidents.
  2. Mode-Aware Context Expansion (Scientific Research, Spacecraft Safety, Data Analysis).
  3. Structured Provenance & NASA Citation Resolution.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import re
from typing import List, Dict, Any, Optional
from models.database import get_connection


def retrieve_fts5(query: str, top_k: int = 5, mode: str = "SCIENTIFIC_RESEARCH") -> List[Dict[str, Any]]:
    """
    Retrieves ranked NASA research documents, historical incidents, and experiment records
    using SQLite FTS5 with BM25 ranking and mode-specific semantic emphasis.
    """
    conn = get_connection()

    # Clean query to prevent syntax issues with FTS5 special characters
    clean_query = re.sub(r'[^\w\s]', ' ', query).strip()
    words = [w for w in clean_query.split() if len(w) > 2]

    # Mode-based query enrichment for higher retrieval recall
    mode_enrichment: List[str] = []
    if mode == "SPACECRAFT_FIRE_SAFETY":
        mode_enrichment = ["safety", "hazard", "oxygen", "suppression", "fire", "incident", "Apollo", "Mir"]
    elif mode == "EXPERIMENTAL_DATA_ANALYSIS":
        mode_enrichment = ["burning", "rate", "droplet", "regression", "constant", "measurement", "kinetics", "FLEX"]
    elif mode == "SCIENTIFIC_RESEARCH":
        mode_enrichment = ["microgravity", "combustion", "flame", "spherical", "diffusion", "soot", "cool"]

    combined_terms = list(dict.fromkeys(words + [w for w in mode_enrichment if w.lower() in query.lower()]))
    if not combined_terms:
        combined_terms = words if words else ["combustion"]

    # Construct MATCH expression with OR operators
    match_expr = " OR ".join(combined_terms[:8])

    try:
        rows = conn.execute("""
            SELECT 
                doc_id,
                title,
                snippet(research_fts, 2, '<b>', '</b>', '...', 32) as match_snippet,
                content,
                citation,
                bm25(research_fts) as rank_score
            FROM research_fts
            WHERE research_fts MATCH ?
            ORDER BY rank_score ASC
            LIMIT ?
        """, (match_expr, top_k * 2)).fetchall()

        results: List[Dict[str, Any]] = []
        seen_ids = set()

        for r in rows:
            doc_id = r["doc_id"]
            if doc_id in seen_ids:
                continue
            seen_ids.add(doc_id)

            # 1. Check if it's an incident in historical_incidents
            inc_meta = conn.execute("""
                SELECT 
                    incident_id, mission_name, date, spacecraft, location, summary,
                    fire_environment, ignition_source, materials_involved, consequences,
                    documented_lessons_learned, relevance_to_modern_spacecraft, nasa_reference_url, category
                FROM historical_incidents
                WHERE incident_id = ?
            """, (doc_id,)).fetchone()

            # 2. Check if it's in research_documents
            doc_meta = conn.execute("""
                SELECT 
                    doc_id, title, authors, publication_year, publication_venue, doi_or_report_num,
                    url, original_url, abstract, category, institution, source_type
                FROM research_documents
                WHERE doc_id = ?
            """, (doc_id,)).fetchone()

            # 3. Check if it's in experiments
            exp_meta = conn.execute("""
                SELECT 
                    experiment_id, series, title, mission_platform, fuel_type, fuel_category,
                    gravity_level, ambient_o2_percent, chamber_pressure_kpa, key_finding, citation
                FROM experiments
                WHERE experiment_id = ?
            """, (doc_id,)).fetchone()

            if inc_meta:
                authors = f"NASA Safety Center (SMA) • {inc_meta['mission_name']} Mishap Board"
                year = int(inc_meta["date"][:4]) if inc_meta["date"] else 1967
                url = inc_meta["nasa_reference_url"]
                category = inc_meta["category"] or "Spacecraft Fire Incidents"
                institution = "NASA Safety Center (SMA)"
                content_text = (
                    f"HISTORICAL SPACECRAFT FIRE DOSSIER: {inc_meta['mission_name']} ({inc_meta['date']})\n"
                    f"Spacecraft: {inc_meta['spacecraft']} | Location: {inc_meta['location']}\n"
                    f"Fire Environment: {inc_meta['fire_environment']}\n"
                    f"Ignition Source: {inc_meta['ignition_source']}\n"
                    f"Materials Involved: {inc_meta['materials_involved']}\n"
                    f"Consequences: {inc_meta['consequences']}\n"
                    f"Documented NASA Lessons Learned:\n{inc_meta['documented_lessons_learned']}\n"
                    f"Modern Relevance: {inc_meta['relevance_to_modern_spacecraft']}\n"
                    f"Reference: {inc_meta['nasa_reference_url']}"
                )
            elif doc_meta:
                authors = doc_meta["authors"] or "NASA Biological and Physical Sciences"
                year = doc_meta["publication_year"] or 2024
                url = doc_meta["original_url"] or doc_meta["url"] or "https://psi.nasa.gov/"
                category = doc_meta["category"] or "Microgravity Combustion Experiments"
                institution = doc_meta["institution"] or "NASA"
                content_text = r["content"]
            elif exp_meta:
                authors = f"NASA {exp_meta['series']} Science Team • {exp_meta['citation']}"
                year = 2024
                url = "https://psi.nasa.gov/"
                category = "Microgravity Combustion Experiments"
                institution = "NASA Glenn Research Center"
                content_text = (
                    f"NASA FLIGHT COMBUSTION EXPERIMENT: {exp_meta['experiment_id']} ({exp_meta['series']})\n"
                    f"Title: {exp_meta['title']}\n"
                    f"Platform: {exp_meta['mission_platform']} | Gravity: {exp_meta['gravity_level']} g\n"
                    f"Fuel: {exp_meta['fuel_type']} ({exp_meta['fuel_category']})\n"
                    f"Atmosphere: {exp_meta['ambient_o2_percent']}% O2 at {exp_meta['chamber_pressure_kpa']} kPa\n"
                    f"Key Finding: {exp_meta['key_finding']}\n"
                    f"Citation: {exp_meta['citation']}"
                )
            else:
                authors = "NASA Physical Sciences Informatics"
                year = 2024
                url = "https://psi.nasa.gov/"
                category = "Combustion Science"
                institution = "NASA"
                content_text = r["content"]

            results.append({
                "doc_id": doc_id,
                "title": r["title"],
                "snippet": r["match_snippet"],
                "content": content_text,
                "citation": r["citation"],
                "authors": authors,
                "year": year,
                "url": url,
                "category": category,
                "institution": institution,
                "relevance_score": round(abs(1.0 / (1.0 + abs(r["rank_score"]))), 3)
            })

            if len(results) >= top_k:
                break

        conn.close()
        return results

    except Exception as e:
        print(f"[RAG Service] FTS5 search error: {e}. Falling back to LIKE query.")
        conn.close()
        return _fallback_like_search(words, top_k)


def _fallback_like_search(words: List[str], top_k: int = 4) -> List[Dict[str, Any]]:
    conn = get_connection()
    like_clauses = " OR ".join(["content LIKE ?"] * len(words)) if words else "content LIKE '%combustion%'"
    params = [f"%{w}%" for w in words] if words else ["%combustion%"]
    rows = conn.execute(f"""
        SELECT doc_id, title, content, citation
        FROM research_fts
        WHERE {like_clauses}
        LIMIT ?
    """, params + [top_k]).fetchall()
    conn.close()

    return [
        {
            "doc_id": r["doc_id"],
            "title": r["title"],
            "snippet": r["content"][:200] + "...",
            "content": r["content"],
            "citation": r["citation"],
            "authors": "NASA Flight Science Team",
            "year": 2024,
            "url": "https://psi.nasa.gov/",
            "category": "Microgravity Combustion",
            "institution": "NASA",
            "relevance_score": 0.85
        }
        for r in rows
    ]


def retrieve(query: str, top_k: int = 5, mode: str = "SCIENTIFIC_RESEARCH") -> List[Dict[str, Any]]:
    """Primary retrieval function called by AI Chat router."""
    return retrieve_fts5(query, top_k=top_k, mode=mode)
