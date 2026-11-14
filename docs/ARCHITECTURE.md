# FLAMELENS AI — SYSTEM ARCHITECTURE SPECIFICATION (PHASE 03)
**NASA Space Apps Challenge 2026 | Challenge 08: Flame in Freefall**  
**Classification:** Scientific Intelligence Platform & Mission Safety Audit System  
**Repository Location:** `E:\Flamelense`

---

## 1. System Topology Overview

```
                               ┌─────────────────────────────────────────────────────────────┐
                               │                    FLAMELENS AI PLATFORM                    │
                               └──────────────────────────────┬──────────────────────────────┘
                                                              │
                    ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                    ▼                                                                                   ▼
      ┌───────────────────────────┐                                                       ┌───────────────────────────┐
      │   REACT 19 + VITE + TS    │                                                       │      FASTAPI BACKEND      │
      │   TAILWIND CSS + RECHARTS │                                                       │    PYTHON 3.12 + NUMPY    │
      └─────────────┬─────────────┘                                                       └─────────────┬─────────────┘
                    │                                                                                   │
  ┌─────────────────┼───────────────────┐                                               ┌───────────────┼───────────────┐
  │                 │                   │                                               │               │               │
  ▼                 ▼                   ▼                                               ▼               ▼               ▼
Mission         Combustion          Spacecraft                                      Empirical       Regression      RAG Search
Dashboard       Physics & D²        Fire Incidents                                  Catalog         & Atmosphere    & Grounded AI
(Telemetry)     (Regression & Sim)  (Safety Dossiers)                               Engine          Sim Engines     (FTS5 + Gemini)
```

---

## 2. Core Architectural Pillars

### Pillar A: Empirical Fidelity & Separation of Anomalies
1. **Microgravity Combustion Datasets (ISS CIR & Drop Towers):**
   - 29 empirical experiment runs across 6 official NASA flight series (FLEX, FLEX-2, ACME, CFI, BASS, SoFIE).
   - Variables: burning rate constant $K$, peak radiometric temperature, flame standoff ratio, flame geometry, soot yield ppm, limiting oxygen index (LOI), and extinction mechanisms.
2. **Droplet Combustion Time-Series Data:**
   - 35 empirical measurements across multiple droplet runs (FLEX Heptane µg, Earth 1-g reference, Methanol, and Helium diluent).
   - Regression engine calculates $K$, $R^2$, RMSE, and uncertainty $\pm \Delta K$.
3. **Spacecraft Fire Incident Isolation:**
   - Apollo 1, Apollo 13, and Mir Space Station fire dossiers are strictly quarantined in a separate schema (`historical_incidents`) to ensure accident conditions do not pollute controlled microgravity kinetics formulas.

### Pillar B: Deterministic Risk Scoring
- All risk rankings are computed deterministically via validated formulas:
  $$\text{Risk Score} = (0.25 \times S_{\text{flam}} + 0.20 \times S_{\text{thermal}} + 0.20 \times S_{\text{rate}} + 0.20 \times S_{\text{soot}} + 0.15 \times S_{\text{suppress}}) \times 100$$
- AI models are never allowed to fabricate or hallucinate numeric risk metrics.

### Pillar C: Grounded Gemini RAG Copilot & Streaming Intelligence
- **Live Google Gen AI SDK Integration:** Powered by `google-genai` Python SDK using `GEMINI_MODEL` (e.g. `gemini-2.5-flash`), with automated fallback cascade across supported models.
- **Server-Sent Events (SSE) Streaming:** Real-time token streaming via `POST /api/chat/stream` with typing indicators, stop controls, and copy actions in the React UI.
- **Three Specialized Research Modes:**
  1. *Mode A (Scientific Research):* Combustion theory, isotropic diffusion, cool flame kinetics ($<750$ K), radiative soot shells.
  2. *Mode B (Spacecraft Fire Safety):* Cabin oxygen hazards ($P_{O_2}$), detector delay, suppression doctrine, and Apollo/Mir lessons.
  3. *Mode C (Experimental Data Analysis):* Droplet $D^2$ regression, burning rate $K$, $R^2$ linearity, and quantitative flight telemetry.
- **SQLite FTS5 + BM25 Hybrid Retrieval:** Ultra-fast ranking over 26 papers, 29 experiments, and 3 mission incidents.
- **Strict Citation Grounding:** Every claim cites `[DOC-ID]`, `[EXP-ID]`, or `[INC-ID]` with clickable links to NASA archives. Never invents flight data. Graceful offline synthesis fallback.

---

## 3. Database Schema Layout (`flamelens.db`)

1. `sources`: 28 verified NASA repositories and knowledge centers.
2. `research_documents`: 26 peer-reviewed flight papers, TM reports, and Spinoff summaries with structured sections and DOI references.
3. `experiments`: 29 flight and ground-reference combustion runs with platform and environmental parameters.
4. `measurements`: Empirical sensor telemetry, burning rates, flame geometry, and extinction modes.
5. `analysis_results`: Deterministic risk scores, sub-factors, confidence ratings, and audit trails.
6. `historical_incidents`: Detailed dossiers on Apollo 1, Apollo 13, and Mir fires.
7. `time_series_measurements`: Droplet diameter squared ($D^2$) time-series points.
8. `atmosphere_scenarios`: NASA exploration cabin atmosphere presets.
9. `chat_history`: Multi-turn conversational research sessions.
10. `research_fts`: SQLite FTS5 virtual table for BM25 retrieval.

---

## 4. Frontend Route Architecture

| Route | View Component | Key Capabilities |
| :--- | :--- | :--- |
| `/` | `Dashboard.tsx` | High-level telemetry, flame shapes, burning rate benchmarks, flight discoveries, incident alerts |
| `/analysis` | `FlameAnalysis.tsx` | Interactive D² regression tabs, Atmospheric Flammability Simulator, and single-run telemetry |
| `/incidents` | `HistoricalIncidents.tsx` | Spacecraft fire accident dossiers, environmental hazards, lessons learned, modern spacecraft relevance |
| `/comparison`| `ExperimentComparison.tsx` | Side-by-side run comparisons across 13 physical variables with delta calculations |
| `/risk` | `FireSafetyIntelligence.tsx` | Evidence-based risk ranking, multi-factor breakdowns, and transparent formulas |
| `/assistant` | `AIChat.tsx` | RAG-grounded conversational assistant with direct NASA citations and repository links |
| `/library` | `ResearchLibrary.tsx` | Multi-faceted literature search with 10 scientific categories, institutions, and structured sections |
| `/reports` | `Reports.tsx` | Custom mission audit report generation with Markdown export |
