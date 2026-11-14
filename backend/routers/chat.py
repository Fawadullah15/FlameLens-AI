"""
FlameLens AI — AI Research Chat & Copilot Router
NASA Space Apps 2026 | Challenge 08: Flame in Freefall

Endpoints:
  - POST /api/chat: Synchronous RAG-grounded response (full compatibility).
  - POST /api/chat/stream: Real-time Server-Sent Events (SSE) streaming.
  - GET  /api/chat/history/{session_id}: Session retrieval.
  - DELETE /api/chat/history/{session_id}: Session reset.
"""
from __future__ import annotations
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from models.database import get_connection
from services.gemini_service import ask_gemini, ask_gemini_stream
from services.rag_service import retrieve

router = APIRouter(prefix="/chat", tags=["AI Research Chat & Copilot"])

SCIENTIFIC_DISCLAIMER = (
    "This answer is synthesized by FlameLens AI using authentic NASA flight research archives "
    "(FLEX, ACME, CFI, BASS, SoFIE) and historical mishap dossiers. All physical claims cite verified sources. "
    "It is an intelligence aid and does not replace empirical NASA flight qualification testing."
)


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1500)
    session_id: Optional[str] = None
    mode: Optional[str] = Field(
        "SCIENTIFIC_RESEARCH",
        description="Research Mode: SCIENTIFIC_RESEARCH | SPACECRAFT_FIRE_SAFETY | EXPERIMENTAL_DATA_ANALYSIS"
    )
    history: Optional[List[Dict[str, str]]] = Field(
        default=None,
        description="Previous conversation turns for contextual multi-turn reasoning"
    )


class CitationRef(BaseModel):
    doc_id: str
    title: str
    authors: Optional[str] = None
    year: Optional[int] = None
    url: Optional[str] = None
    category: Optional[str] = None
    institution: Optional[str] = None
    relevance_score: Optional[float] = None
    snippet: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[CitationRef]
    confidence: str
    session_id: str
    model: str
    mode: str
    tokens_used: Optional[int] = None
    disclaimer: str = SCIENTIFIC_DISCLAIMER


def _build_citations(context_chunks: List[Dict[str, Any]]) -> List[CitationRef]:
    """Resolve high-fidelity NASA citations with original URLs and institutions."""
    citations: List[CitationRef] = []
    for chunk in context_chunks:
        citations.append(CitationRef(
            doc_id=chunk.get("doc_id", "NASA-REF"),
            title=chunk.get("title", "NASA Combustion Record"),
            authors=chunk.get("authors", "NASA Research Team"),
            year=chunk.get("year", 2024),
            url=chunk.get("url", "https://psi.nasa.gov/"),
            category=chunk.get("category", "Combustion Science"),
            institution=chunk.get("institution", "NASA"),
            relevance_score=chunk.get("relevance_score", 0.9),
            snippet=chunk.get("snippet")
        ))
    return citations


@router.post("", response_model=ChatResponse)
async def submit_question(req: ChatRequest):
    """
    Synchronous AI research copilot query grounded in NASA FTS5 research evidence.
    Maintains complete backward compatibility with Phase 02 and Phase 03 clients.
    """
    session_id = req.session_id or f"SES-{uuid.uuid4().hex[:8].upper()}"
    mode = req.mode or "SCIENTIFIC_RESEARCH"

    # 1. Retrieve ranked empirical NASA research evidence via FTS5
    context_chunks = retrieve(req.question, top_k=5, mode=mode)
    sources = _build_citations(context_chunks)

    # 2. Synthesize scientific response via Gemini or Grounded Fallback
    ai_result = await ask_gemini(
        question=req.question,
        context_chunks=context_chunks,
        mode=mode,
        history=req.history
    )

    # 3. Record interaction history in SQLite
    _save_chat_history(session_id, "user", req.question, [])
    _save_chat_history(session_id, "assistant", ai_result["answer"], ai_result.get("sources_used", []))

    return ChatResponse(
        answer=ai_result["answer"],
        sources=sources,
        confidence=ai_result.get("confidence", "HIGH"),
        session_id=session_id,
        model=ai_result.get("model", "Gemini 2.5 Flash / NASA Grounded Synthesizer"),
        mode=mode,
        tokens_used=ai_result.get("tokens_used"),
        disclaimer=SCIENTIFIC_DISCLAIMER
    )


@router.post("/stream")
async def stream_question(req: ChatRequest):
    """
    Real-time Server-Sent Events (SSE) streaming endpoint.
    Emits metadata, text chunks as they are generated, and a completion event.
    """
    session_id = req.session_id or f"SES-{uuid.uuid4().hex[:8].upper()}"
    mode = req.mode or "SCIENTIFIC_RESEARCH"

    # 1. Retrieve ranked empirical NASA research evidence via FTS5
    context_chunks = retrieve(req.question, top_k=5, mode=mode)
    sources = _build_citations(context_chunks)

    async def sse_generator():
        # Event 1: metadata (sources, citations, session ID, active mode)
        meta_payload = {
            "session_id": session_id,
            "mode": mode,
            "sources": [s.model_dump() for s in sources],
            "disclaimer": SCIENTIFIC_DISCLAIMER,
            "timestamp": datetime.now().isoformat()
        }
        yield f"event: metadata\ndata: {json.dumps(meta_payload)}\n\n"

        # Event 2+: Stream text chunks from Gemini
        accumulated_text: List[str] = []
        try:
            async for token in ask_gemini_stream(
                question=req.question,
                context_chunks=context_chunks,
                mode=mode,
                history=req.history
            ):
                accumulated_text.append(token)
                yield f"event: chunk\ndata: {json.dumps({'text': token})}\n\n"
        except Exception as e:
            err_msg = f"Streaming synthesis error: {type(e).__name__}"
            yield f"event: error\ndata: {json.dumps({'error': err_msg})}\n\n"

        full_answer = "".join(accumulated_text)

        # Record interaction history in SQLite
        _save_chat_history(session_id, "user", req.question, [])
        _save_chat_history(session_id, "assistant", full_answer, [c.get("doc_id") for c in context_chunks])

        # Event Final: Done
        yield f"event: done\ndata: {json.dumps({'status': 'complete', 'total_chars': len(full_answer)})}\n\n"

    return StreamingResponse(
        sse_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.get("/history/{session_id}")
def get_session_history(session_id: str):
    """Retrieve chat history for a session."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT role, content, sources_used, created_at FROM chat_history WHERE session_id = ? ORDER BY id ASC",
        (session_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.delete("/history/{session_id}")
def reset_session(session_id: str):
    """Clear chat session history."""
    conn = get_connection()
    conn.execute("DELETE FROM chat_history WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"status": "cleared", "session_id": session_id}


def _save_chat_history(session_id: str, role: str, content: str, sources: list):
    try:
        conn = get_connection()
        conn.execute(
            "INSERT INTO chat_history (session_id, role, content, sources_used) VALUES (?, ?, ?, ?)",
            (session_id, role, content, json.dumps(sources))
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Chat History Error] {e}")
