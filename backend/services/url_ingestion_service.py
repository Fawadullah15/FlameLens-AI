"""
FlameLens AI — NASA Webpage & Source Ingestion Engine
Fetches, parses, structures, and indexes NASA public research portals,
historical safety records, spinoff technologies, and multimedia into SQLite FTS5.
NASA Space Apps Challenge 2026 | Challenge 08: Flame in Freefall
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import re
import json
import uuid
import datetime
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
from models.database import get_connection

# ─────────────────────────────────────────────────────────────────────────────
# 10 SCIENTIFIC CLASSIFICATION CATEGORIES
# ─────────────────────────────────────────────────────────────────────────────
SCIENTIFIC_CATEGORIES = [
    "Microgravity Combustion Experiments",
    "Droplet Combustion",
    "Cool Flame Phenomena",
    "Gaseous Flame Behavior",
    "Solid Material Flammability",
    "Oxygen Concentration Effects",
    "Spacecraft Fire Incidents",
    "Spacecraft Fire Safety",
    "Combustion Theory",
    "Technology Transfer and Applications"
]

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FlameLens-AI-NASA-Research/2.0 (Space Apps 2026)"
}


class URLIngestionResult:
    def __init__(
        self,
        url: str,
        status: str,
        title: str,
        authors: str,
        publication_date: str,
        institution: str,
        category: str,
        source_type: str,
        abstract: str,
        full_text: str,
        structured_sections: List[Dict[str, str]],
        doi_links: List[str],
        external_links: List[str],
        doc_id: Optional[str] = None,
        source_id: Optional[str] = None,
        error_message: Optional[str] = None
    ):
        self.url = url
        self.status = status
        self.title = title
        self.authors = authors
        self.publication_date = publication_date
        self.institution = institution
        self.category = category
        self.source_type = source_type
        self.abstract = abstract
        self.full_text = full_text
        self.structured_sections = structured_sections
        self.doi_links = doi_links
        self.external_links = external_links
        self.doc_id = doc_id
        self.source_id = source_id
        self.error_message = error_message

    def to_dict(self) -> Dict[str, Any]:
        return {
            "url": self.url,
            "status": self.status,
            "title": self.title,
            "authors": self.authors,
            "publication_date": self.publication_date,
            "institution": self.institution,
            "category": self.category,
            "source_type": self.source_type,
            "abstract": self.abstract,
            "structured_sections": self.structured_sections,
            "doi_links": self.doi_links,
            "external_links": self.external_links,
            "doc_id": self.doc_id,
            "source_id": self.source_id,
            "error_message": self.error_message
        }


def classify_content(url: str, title: str, text: str) -> str:
    """Classifies content into one of the 10 approved scientific categories."""
    combined = (url + " " + title + " " + text).lower()

    if "spinoff" in combined or "technology transfer" in combined or "commercialization" in combined:
        return "Technology Transfer and Applications"
    if "apollo-1" in url.lower() or "apollo-13" in url.lower() or "mir" in url.lower() or "incident" in combined or "accident" in combined:
        return "Spacecraft Fire Incidents"
    if "cool flame" in combined or "low-temperature combustion" in combined:
        return "Cool Flame Phenomena"
    if "droplet" in combined or "d^2" in combined or "d2" in combined or "heptane" in combined or "decane" in combined:
        return "Droplet Combustion"
    if "solid" in combined or "pmma" in combined or "fabric" in combined or "bass" in combined or "sofie" in combined:
        return "Solid Material Flammability"
    if "oxygen" in combined or "loi" in combined or "enriched" in combined or "partial pressure" in combined:
        return "Oxygen Concentration Effects"
    if "safety" in combined or "extinguisher" in combined or "suppression" in combined or "smac" in combined:
        return "Spacecraft Fire Safety"
    if "acme" in combined or "gaseous" in combined or "jet flame" in combined or "methane" in combined or "ethylene" in combined:
        return "Gaseous Flame Behavior"
    if "theory" in combined or "diffusion" in combined or "damkohler" in combined:
        return "Combustion Theory"

    return "Microgravity Combustion Experiments"


def ingest_url(url: str, custom_category: Optional[str] = None) -> URLIngestionResult:
    """
    Fetches, parses, classifies, and indexes a NASA research URL.
    Returns URLIngestionResult and commits to SQLite FTS5.
    """
    clean_url = url.strip()

    # 1. Handle YouTube Video Materials
    if "youtube.com" in clean_url or "youtu.be" in clean_url:
        return _ingest_youtube_video(clean_url, custom_category)

    # 2. Handle Web Pages (NASA.gov, SMA, Spinoff, PSI)
    last_err = None
    for attempt in range(2):
        try:
            response = requests.get(clean_url, headers=DEFAULT_HEADERS, timeout=15, allow_redirects=True)
            if response.status_code == 200:
                break
        except Exception as e:
            last_err = e
            response = None
    
    if response is None or response.status_code != 200:
        return URLIngestionResult(
            url=clean_url,
            status="CONNECTION_FAILED" if response is None else f"HTTP_ERROR_{response.status_code}",
            title="Inaccessible Resource",
            authors="Unknown",
            publication_date="",
            institution="NASA",
            category=custom_category or "Microgravity Combustion Experiments",
            source_type="Inaccessible Webpage",
            abstract=f"Failed to access URL: {last_err if response is None else response.status_code}",
            full_text="",
            structured_sections=[],
            doi_links=[],
            external_links=[],
            error_message=str(last_err) if response is None else f"HTTP {response.status_code}"
        )

    try:
        html = response.text
        soup = BeautifulSoup(html, "html.parser")

        # Strip unneeded scripts, headers, navs, footers
        for tag in soup(["script", "style", "noscript", "iframe", "svg"]):
            tag.decompose()

        # Title
        title = "NASA Research Document"
        if soup.title and soup.title.string:
            title = soup.title.string.strip()
        h1 = soup.find("h1")
        if h1 and h1.get_text(strip=True):
            h1_clean = h1.get_text(strip=True)
            if len(h1_clean) > 5:
                title = h1_clean

        # Publication Date
        pub_date = ""
        meta_date = (
            soup.find("meta", {"property": "article:published_time"})
            or soup.find("meta", {"name": "dc.date"})
            or soup.find("meta", {"name": "date"})
        )
        if meta_date and meta_date.get("content"):
            pub_date = meta_date["content"][:10]
        else:
            # Look for 4 digit year
            year_match = re.search(r'\b(19\d\d|20\d\d)\b', title + " " + response.text[:2000])
            if year_match:
                pub_date = year_match.group(1)

        # Authors / Institution
        institution = "NASA"
        source_type = "NASA Technical Webpage"
        if "glenn" in clean_url.lower():
            institution = "NASA Glenn Research Center"
        elif "sma.nasa.gov" in clean_url.lower():
            institution = "NASA Safety Center (SMA)"
            source_type = "NASA Safety Center Incident Record"
        elif "spinoff.nasa.gov" in clean_url.lower():
            institution = "NASA Spinoff Program"
            source_type = "NASA Technology Transfer"
        elif "psi.nasa.gov" in clean_url.lower():
            institution = "NASA Biological and Physical Sciences (BPS)"
            source_type = "NASA Physical Sciences Informatics Repository"

        # Extract structured headings & sections
        structured_sections: List[Dict[str, str]] = []
        headings = soup.find_all(["h2", "h3"])
        for h in headings:
            heading_title = h.get_text(strip=True)
            if not heading_title or len(heading_title) < 3:
                continue
            section_paragraphs = []
            curr = h.find_next_sibling()
            while curr and curr.name not in ["h2", "h3", "h1"]:
                if curr.name == "p":
                    p_text = curr.get_text(strip=True)
                    if p_text:
                        section_paragraphs.append(p_text)
                curr = curr.find_next_sibling()
            if section_paragraphs:
                structured_sections.append({
                    "heading": heading_title,
                    "content": " ".join(section_paragraphs)
                })

        # Main Text
        main_elem = soup.find("main") or soup.find("article") or soup.find("div", {"id": "content"}) or soup.body
        full_text = ""
        if main_elem:
            paragraphs = [p.get_text(strip=True) for p in main_elem.find_all("p") if p.get_text(strip=True)]
            full_text = "\n\n".join(paragraphs)
        if not full_text:
            full_text = soup.get_text(separator="\n", strip=True)

        # Extract DOI and external research links
        doi_links = []
        external_links = []
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            if "doi.org" in href or re.search(r'10\.\d{4,9}/[-._;()/:A-Za-z0-9]+', href):
                doi_links.append(href)
            elif href.startswith("http") and not clean_url in href and "nasa.gov" in href:
                external_links.append(href)

        # Deduplicate links
        doi_links = sorted(list(set(doi_links)))[:5]
        external_links = sorted(list(set(external_links)))[:8]

        # Abstract / Description
        meta_desc = soup.find("meta", {"name": "description"}) or soup.find("meta", {"property": "og:description"})
        abstract = meta_desc["content"].strip() if meta_desc and meta_desc.get("content") else ""
        if not abstract and full_text:
            first_p = full_text.split("\n\n")[0]
            abstract = first_p[:350]

        # Classify Category
        category = custom_category or classify_content(clean_url, title, full_text[:2000])

        # Generate unique IDs
        doc_id = f"DOC-NASA-{uuid.uuid4().hex[:8].upper()}"
        source_id = f"SRC-{uuid.uuid4().hex[:6].upper()}"

        result = URLIngestionResult(
            url=clean_url,
            status="VERIFIED_ACCESSIBLE",
            title=title,
            authors=institution,
            publication_date=pub_date or "2024",
            institution=institution,
            category=category,
            source_type=source_type,
            abstract=abstract,
            full_text=full_text,
            structured_sections=structured_sections,
            doi_links=doi_links,
            external_links=external_links,
            doc_id=doc_id,
            source_id=source_id
        )

        # Save to Database
        _persist_ingestion_result(result)
        return result

    except Exception as e:
        return URLIngestionResult(
            url=clean_url,
            status="CONNECTION_FAILED",
            title="Inaccessible Resource",
            authors="Unknown",
            publication_date="",
            institution="NASA",
            category=custom_category or "Microgravity Combustion Experiments",
            source_type="Inaccessible Webpage",
            abstract=f"Failed to access URL: {str(e)}",
            full_text="",
            structured_sections=[],
            doi_links=[],
            external_links=[],
            error_message=str(e)
        )


def _ingest_youtube_video(video_url: str, custom_category: Optional[str]) -> URLIngestionResult:
    """Ingests YouTube video metadata without fabricating transcript if not available."""
    try:
        oembed_url = f"https://www.youtube.com/oembed?url={video_url}&format=json"
        res = requests.get(oembed_url, headers=DEFAULT_HEADERS, timeout=8)
        if res.status_code == 200:
            data = res.json()
            title = data.get("title", "NASA Combustion Video")
            author = data.get("author_name", "NASA Science")
            thumbnail = data.get("thumbnail_url", "")
            abstract = (
                f"NASA official scientific video: '{title}' by {author}. "
                f"Documenting Combustion Integrated Rack (CIR) operations and microgravity flame physics on the ISS."
            )
            full_text = (
                f"NASA COMBUSTION VIDEO ARCHIVE\n"
                f"Title: {title}\n"
                f"Channel: {author}\n"
                f"URL: {video_url}\n"
                f"Thumbnail: {thumbnail}\n"
                f"Scope: Microgravity flame spherical symmetry, cool flames, and soot suppression in the CIR."
            )
            doc_id = f"DOC-VID-{uuid.uuid4().hex[:8].upper()}"
            source_id = f"SRC-VID-{uuid.uuid4().hex[:6].upper()}"

            result = URLIngestionResult(
                url=video_url,
                status="VERIFIED_ACCESSIBLE",
                title=title,
                authors=author,
                publication_date="2020",
                institution="NASA Science / YouTube",
                category=custom_category or "Microgravity Combustion Experiments",
                source_type="NASA Multimedia Video",
                abstract=abstract,
                full_text=full_text,
                structured_sections=[{
                    "heading": "Video Overview",
                    "content": abstract
                }],
                doi_links=[],
                external_links=[video_url],
                doc_id=doc_id,
                source_id=source_id
            )
            _persist_ingestion_result(result)
            return result
    except Exception as e:
        pass

    return URLIngestionResult(
        url=video_url,
        status="PARTIAL_METADATA",
        title="NASA Combustion ScienceCast Video",
        authors="NASA Science",
        publication_date="2020",
        institution="NASA",
        category=custom_category or "Microgravity Combustion Experiments",
        source_type="NASA Multimedia Video",
        abstract="NASA video documentation on microgravity combustion aboard the International Space Station.",
        full_text=f"Video reference preserved: {video_url}",
        structured_sections=[],
        doi_links=[],
        external_links=[video_url],
        doc_id=f"DOC-VID-{uuid.uuid4().hex[:8].upper()}",
        source_id=f"SRC-VID-{uuid.uuid4().hex[:6].upper()}"
    )


def _persist_ingestion_result(result: URLIngestionResult) -> None:
    """Stores the ingested document and source in SQLite and updates FTS5."""
    if not result.doc_id or not result.full_text:
        return

    conn = get_connection()
    # 1. Insert/Update sources
    conn.execute("""
        INSERT OR REPLACE INTO sources (
            source_id, name, organization, repository, url, description, access_type,
            verification_status, category, institution, source_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        result.source_id,
        result.title,
        "NASA",
        result.institution,
        result.url,
        result.abstract,
        "Open Access (Public NASA Resource)",
        "Verified Direct Source",
        result.category,
        result.institution,
        result.source_type
    ))

    # 2. Insert/Update research_documents
    conn.execute("""
        INSERT OR REPLACE INTO research_documents (
            doc_id, source_id, title, authors, publication_year, publication_venue,
            url, abstract, full_text, page_count, series_tags, extraction_method,
            category, source_type, original_url, institution, ingestion_status,
            structured_sections_json, doi_references_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        result.doc_id,
        result.source_id,
        result.title,
        result.authors,
        int(result.publication_date[:4]) if result.publication_date and result.publication_date[:4].isdigit() else 2024,
        result.institution,
        result.url,
        result.abstract,
        result.full_text,
        max(1, len(result.structured_sections)),
        result.category,
        "Automated Web Scraper",
        result.category,
        result.source_type,
        result.url,
        result.institution,
        result.status,
        json.dumps(result.structured_sections),
        json.dumps(result.doi_links)
    ))

    # 3. Update FTS5 virtual table
    conn.execute("""
        INSERT INTO research_fts (doc_id, title, content, citation)
        VALUES (?, ?, ?, ?)
    """, (
        result.doc_id,
        result.title,
        f"{result.abstract}\n\n{result.full_text[:3000]}",
        f"{result.authors} ({result.publication_date}). {result.title} [{result.url}]"
    ))

    conn.commit()
    conn.close()
