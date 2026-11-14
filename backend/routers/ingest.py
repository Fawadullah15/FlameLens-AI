"""
FlameLens AI — Ingestion Router
Accepts PDF research papers or structured experiment datasets.
Extracts text via PyMuPDF, extracts metadata, verifies provenance, and indexes in SQLite FTS5.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import os
import json
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Body
from typing import Dict, Any, Optional, List
from models.database import get_connection
from services.pdf_extractor import extract_pdf_document

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & PDF Extraction Engine"])

TEMP_UPLOAD_DIR = Path("E:/Flamelense/data/uploads")
TEMP_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("", response_model=Dict[str, Any])
async def ingest_file_or_data(
    file: Optional[UploadFile] = File(None),
    source_id: str = Form("SRC-NASA-NTRS"),
    series_tag: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    authors: Optional[str] = Form(None)
):
    """
    Ingest a research document (PDF) or dataset.
    Extracts text using PyMuPDF, computes metadata, stores in research_documents and updates FTS5 index.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided for ingestion.")

    filename = file.filename or "uploaded_doc.pdf"
    file_ext = Path(filename).suffix.lower()

    if file_ext == ".pdf":
        temp_path = TEMP_UPLOAD_DIR / f"{uuid.uuid4().hex}_{filename}"
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)

        try:
            # Extract via PyMuPDF
            result = extract_pdf_document(str(temp_path))

            doc_title = title or result.title
            doc_authors = authors or result.authors
            doc_id = f"DOC-INGEST-{uuid.uuid4().hex[:8].upper()}"
            detected_series = series_tag or (",".join(result.identified_series) if result.identified_series else "General Microgravity")

            conn = get_connection()
            conn.execute("""
                INSERT INTO research_documents (
                    doc_id, source_id, title, authors, publication_year,
                    publication_venue, doi_or_report_num, url, abstract,
                    full_text, page_count, series_tags, extraction_method
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                doc_id, source_id, doc_title, doc_authors, 2026,
                "NASA Space Apps 2026 Challenge 08 Ingestion", filename, None,
                f"Ingested PDF: {filename} containing {result.page_count} pages with keywords: {', '.join(result.detected_keywords[:10])}",
                result.full_text, result.page_count, detected_series, "PyMuPDF Automated Extraction"
            ))

            # FTS5 indexing
            conn.execute("""
                INSERT INTO research_fts (doc_id, title, content, citation)
                VALUES (?, ?, ?, ?)
            """, (
                doc_id, doc_title, result.full_text, f"{doc_authors} (2026). {filename}"
            ))

            conn.commit()
            conn.close()

            # Clean up temp file
            if temp_path.exists():
                temp_path.unlink()

            return {
                "status": "success",
                "message": f"Successfully ingested and indexed PDF '{filename}'",
                "doc_id": doc_id,
                "title": doc_title,
                "page_count": result.page_count,
                "detected_keywords": result.detected_keywords,
                "identified_series": result.identified_series,
                "indexed_in_fts": True
            }

        except Exception as e:
            if temp_path.exists():
                temp_path.unlink()
            raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")

    elif file_ext in [".json", ".txt"]:
        content = await file.read()
        try:
            text_str = content.decode("utf-8")
        except UnicodeDecodeError:
            text_str = content.decode("latin-1")

        doc_id = f"DOC-DATA-{uuid.uuid4().hex[:8].upper()}"
        doc_title = title or filename
        doc_authors = authors or "NASA Science Team"

        conn = get_connection()
        conn.execute("""
            INSERT INTO research_documents (
                doc_id, source_id, title, authors, publication_year,
                publication_venue, full_text, page_count, series_tags, extraction_method
            ) VALUES (?, ?, ?, ?, 2026, 'Dataset File Ingest', ?, 1, ?, 'Direct Text Ingestion')
        """, (doc_id, source_id, doc_title, doc_authors, text_str, series_tag or "Dataset"))

        conn.execute("""
            INSERT INTO research_fts (doc_id, title, content, citation)
            VALUES (?, ?, ?, ?)
        """, (doc_id, doc_title, text_str, f"{doc_authors} (2026). {filename}"))

        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Successfully ingested structured dataset '{filename}'",
            "doc_id": doc_id,
            "title": doc_title,
            "indexed_in_fts": True
        }

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Please upload .pdf, .json, or .txt"
        )
