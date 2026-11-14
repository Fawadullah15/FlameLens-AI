"""
FlameLens AI — NASA PDF Extraction Engine
Powered by PyMuPDF (fitz) for page-accurate scientific document parsing.
Extracts metadata, page-level text, combustion variables, and citation anchors.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")

from pathlib import Path
from typing import Dict, Any, List, Optional
import re
import pymupdf as fitz


class PDFExtractionResult:
    def __init__(
        self,
        filepath: str,
        title: str,
        authors: str,
        page_count: int,
        pages_content: List[Dict[str, Any]],
        full_text: str,
        detected_keywords: List[str],
        identified_series: List[str],
        metadata: Dict[str, Any]
    ):
        self.filepath = filepath
        self.title = title
        self.authors = authors
        self.page_count = page_count
        self.pages_content = pages_content
        self.full_text = full_text
        self.detected_keywords = detected_keywords
        self.identified_series = identified_series
        self.metadata = metadata

    def to_dict(self) -> Dict[str, Any]:
        return {
            "filepath": self.filepath,
            "title": self.title,
            "authors": self.authors,
            "page_count": self.page_count,
            "detected_keywords": self.detected_keywords,
            "identified_series": self.identified_series,
            "metadata": self.metadata,
            "pages_summary": [
                {"page": p["page_number"], "char_count": len(p["text"]), "preview": p["text"][:150]}
                for p in self.pages_content
            ],
        }


def extract_pdf_document(pdf_path: str) -> PDFExtractionResult:
    """
    Extracts text, metadata, page citations, and combustion terms from a PDF file.
    """
    path = Path(pdf_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    doc = fitz.open(str(path))
    meta = doc.metadata or {}
    title = meta.get("title") or path.stem.replace("_", " ").title()
    authors = meta.get("author") or "NASA Research Team"

    pages_content: List[Dict[str, Any]] = []
    full_text_parts: List[str] = []
    all_keywords_found = set()
    series_detected = set()

    combustion_keywords = [
        "microgravity", "combustion", "droplet", "spherical flame", "burning rate",
        "limiting oxygen index", "cool flame", "soot", "extinction", "quenched",
        "cir", "iss", "buoyancy", "stagnation", "radiative", "flammability"
    ]

    nasa_series_terms = {
        "FLEX": ["FLEX", "Flame Extinguishment Experiment"],
        "FLEX-2": ["FLEX-2", "FLEX 2"],
        "ACME": ["ACME", "Advanced Combustion via Microgravity"],
        "BASS": ["BASS", "Burning and Suppression of Solids"],
        "SoFIE": ["SoFIE", "Solid Fuel Ignition and Extinction"],
        "CFI": ["CFI", "Cool Flames Investigation"],
        "BRE": ["BRE", "Burning Rate Emulator"]
    }

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_num = page_idx + 1
        text = page.get_text("text")
        full_text_parts.append(f"\n--- [PAGE {page_num}] ---\n" + text)

        # Detect keywords in page
        text_lower = text.lower()
        page_keywords = [kw for kw in combustion_keywords if kw in text_lower]
        all_keywords_found.update(page_keywords)

        for series_name, terms in nasa_series_terms.items():
            for t in terms:
                if t.lower() in text_lower:
                    series_detected.add(series_name)
                    break

        pages_content.append({
            "page_number": page_num,
            "text": text,
            "keywords": page_keywords,
            "char_count": len(text)
        })

    doc.close()
    full_text = "\n".join(full_text_parts)

    return PDFExtractionResult(
        filepath=str(path),
        title=title,
        authors=authors,
        page_count=len(pages_content),
        pages_content=pages_content,
        full_text=full_text,
        detected_keywords=sorted(list(all_keywords_found)),
        identified_series=sorted(list(series_detected)),
        metadata=meta
    )
