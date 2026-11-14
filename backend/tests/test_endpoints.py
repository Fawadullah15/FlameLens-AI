"""
FlameLens AI — Comprehensive End-to-End API Test Suite
Validates all required endpoints:
  - GET /api/health
  - GET /api/experiments
  - GET /api/experiments/{id}
  - GET /api/sources
  - GET /api/dashboard
  - POST /api/ingest
  - GET /api/analysis/extinction-curve
  - POST /api/compare
  - GET /api/rank/all
  - POST /api/chat
  - GET /api/library/papers
  - POST /api/reports/generate
"""
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, "E:/Flamelense/backend")

import io
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_all_tests():
    print("=" * 60)
    print("FLAMELENS AI — BACKEND ENDPOINT VALIDATION SUITE")
    print("=" * 60)

    # 1. Health
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    health_data = res.json()
    assert health_data["status"] == "operational"
    print(f"✅ GET /api/health: OK (Experiments: {health_data['verified_experiments_count']}, Sources: {health_data['sources_count']})")

    # 2. Experiments List
    res = client.get("/api/experiments?limit=10")
    assert res.status_code == 200, f"Experiments list failed: {res.status_code}"
    exp_data = res.json()
    assert exp_data["total"] >= 20, f"Expected >= 20 experiments, found {exp_data['total']}"
    assert len(exp_data["experiments"]) > 0
    sample_id = exp_data["experiments"][0]["experiment_id"]
    print(f"✅ GET /api/experiments: OK ({exp_data['total']} experiments available)")

    # 3. Single Experiment Detail
    res = client.get(f"/api/experiments/{sample_id}")
    assert res.status_code == 200, f"Experiment detail failed: {res.status_code}"
    detail = res.json()
    assert "experiment" in detail
    assert detail["experiment"]["experiment_id"] == sample_id
    assert "burning_rate_constant_k" in detail["experiment"]
    print(f"✅ GET /api/experiments/{sample_id}: OK (Fuel: {detail['experiment']['fuel_type']}, Shape: {detail['experiment']['flame_shape']})")

    # 4. Sources List
    res = client.get("/api/sources")
    assert res.status_code == 200, f"Sources list failed: {res.status_code}"
    sources = res.json()
    assert len(sources) >= 5, f"Expected >= 5 sources, found {len(sources)}"
    print(f"✅ GET /api/sources: OK ({len(sources)} verified NASA repositories)")

    # 5. Dashboard Summary
    res = client.get("/api/dashboard")
    assert res.status_code == 200, f"Dashboard failed: {res.status_code}"
    dash = res.json()
    assert "telemetry" in dash
    assert "flame_shapes" in dash
    assert "key_insights" in dash
    print(f"✅ GET /api/dashboard: OK (Telemetry total: {dash['telemetry']['total_experiments']}, Shapes: {len(dash['flame_shapes'])})")

    # 6. Ingest endpoint (test with a mock research dataset)
    test_json_content = b'{"dataset": "NASA_CIR_TEST_RUN", "variable": "soot_fraction", "value": 3.2}'
    res = client.post(
        "/api/ingest",
        files={"file": ("test_research_payload.json", io.BytesIO(test_json_content), "application/json")},
        data={"source_id": "SRC-NASA-PSI", "series_tag": "TEST-CIR", "title": "Automated Ingestion Test Run"}
    )
    assert res.status_code == 200, f"Ingest failed: {res.status_code} - {res.text}"
    ingest_res = res.json()
    assert ingest_res["status"] == "success"
    print(f"✅ POST /api/ingest: OK (Doc ID: {ingest_res['doc_id']})")

    # 7. Analysis Extinction Curve
    res = client.get("/api/analysis/extinction-curve?fuel=n-heptane")
    assert res.status_code == 200, f"Extinction curve failed: {res.status_code}"
    ext = res.json()
    assert "data" in ext
    print(f"✅ GET /api/analysis/extinction-curve: OK ({len(ext['data'])} curve points for n-heptane)")

    # 8. Experiment Comparison
    res = client.post("/api/compare", json={"ids": ["FLEX-001", "REF-1G-HEPTANE"]})
    assert res.status_code == 200, f"Comparison failed: {res.status_code}"
    comp = res.json()
    assert "variables" in comp
    assert len(comp["experiments"]) == 2
    print(f"✅ POST /api/compare: OK (Comparing µg vs 1-g across {len(comp['variables'])} physical variables)")

    # 9. Risk Ranking
    res = client.get("/api/rank/all?limit=5")
    assert res.status_code == 200, f"Risk ranking failed: {res.status_code}"
    rank = res.json()
    assert "rankings" in rank
    assert len(rank["rankings"]) > 0
    top_risk = rank["rankings"][0]
    print(f"✅ GET /api/rank/all: OK (Top risk: {top_risk['experiment_id']} - {top_risk['risk_score']}/100 [{top_risk['risk_level']}])")

    # 10. AI Research Chat
    res = client.post("/api/chat", json={"question": "Why do flames become spherical in microgravity and how does cool flame burning occur?"})
    assert res.status_code == 200, f"Chat failed: {res.status_code}"
    chat_res = res.json()
    assert "answer" in chat_res
    assert len(chat_res["sources"]) > 0
    print(f"✅ POST /api/chat: OK (Citations used: {len(chat_res['sources'])}, Model: {chat_res['model']})")

    # 11. Research Library Papers
    res = client.get("/api/library/papers")
    assert res.status_code == 200, f"Library failed: {res.status_code}"
    lib = res.json()
    assert lib["total"] >= 5
    print(f"✅ GET /api/library/papers: OK ({lib['total']} papers in NASA library)")

    # 12. Report Generation
    res = client.post("/api/reports/generate", json={"experiment_ids": ["FLEX-001", "CFI-001", "ACME-001"]})
    assert res.status_code == 200, f"Reports failed: {res.status_code}"
    rep = res.json()
    assert "markdown_content" in rep
    print(f"✅ POST /api/reports/generate: OK (Report ID: {rep['report_id']}, Characters: {len(rep['markdown_content'])})")

    # 13. Historical Spacecraft Fire Incidents
    res = client.get("/api/incidents")
    assert res.status_code == 200, f"Incidents list failed: {res.status_code}"
    incidents = res.json()
    assert len(incidents) >= 3, f"Expected >= 3 incidents, got {len(incidents)}"
    sample_inc = incidents[0]["incident_id"]
    print(f"✅ GET /api/incidents: OK ({len(incidents)} historical spaceflight fire incidents)")

    res = client.get(f"/api/incidents/{sample_inc}")
    assert res.status_code == 200, f"Incident detail failed: {res.status_code}"
    inc_detail = res.json()
    assert "documented_lessons_learned" in inc_detail
    print(f"✅ GET /api/incidents/{sample_inc}: OK ({inc_detail['mission_name']})")

    # 14. D² Law Time-Series & Linear Regression
    res = client.get("/api/analysis/d2-series-list")
    assert res.status_code == 200, f"D2 series list failed: {res.status_code}"
    d2_list = res.json()
    assert len(d2_list) >= 4, f"Expected >= 4 D2 datasets, got {len(d2_list)}"
    print(f"✅ GET /api/analysis/d2-series-list: OK ({len(d2_list)} droplet combustion runs)")

    res = client.get("/api/analysis/d2-regression?series_id=TS-FLEX-001")
    assert res.status_code == 200, f"D2 regression failed: {res.status_code}"
    d2_reg = res.json()
    assert "calculated_burning_rate_k" in d2_reg
    assert d2_reg["r_squared"] > 0.95
    print(f"✅ GET /api/analysis/d2-regression: OK (K = {d2_reg['calculated_burning_rate_k']} mm²/s, R² = {d2_reg['r_squared']})")

    # 15. Atmospheric Flammability Presets & Simulation
    res = client.get("/api/analysis/atmosphere-presets")
    assert res.status_code == 200, f"Atmosphere presets failed: {res.status_code}"
    presets = res.json()
    assert len(presets) >= 4, f"Expected >= 4 presets, got {len(presets)}"
    print(f"✅ GET /api/analysis/atmosphere-presets: OK ({len(presets)} standard exploration scenarios)")

    res = client.post("/api/analysis/atmosphere-simulation", json={"oxygen_percentage": 34.0, "chamber_pressure_kpa": 56.0})
    assert res.status_code == 200, f"Atmosphere simulation failed: {res.status_code}"
    sim = res.json()
    assert "calculated_metrics" in sim
    assert sim["calculated_metrics"]["oxygen_partial_pressure_kpa"] > 0
    print(f"✅ POST /api/analysis/atmosphere-simulation: OK (PO2: {sim['calculated_metrics']['oxygen_partial_pressure_kpa']} kPa, Risk: {sim['calculated_metrics']['risk_level']})")

    # 16. Research Library Taxonomy
    res = client.get("/api/library/categories")
    assert res.status_code == 200, f"Library categories failed: {res.status_code}"
    cats = res.json()
    assert "categories" in cats
    assert len(cats["categories"]) >= 3
    print(f"✅ GET /api/library/categories: OK ({len(cats['categories'])} categories, {len(cats['institutions'])} institutions)")

    print("=" * 60)
    print("ALL 16 BACKEND API ENDPOINTS VERIFIED & PASSING WITH FLYING COLORS!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
