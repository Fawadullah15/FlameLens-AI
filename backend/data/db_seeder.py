"""
FlameLens AI — Database Seeder
Populates experiments, risk_scores, and knowledge_docs tables from seed_data.py.
Idempotent — safe to run multiple times.
"""
import sys
sys.path.insert(0, "E:/pip-libs")
sys.path.insert(0, ".")

from models.database import get_connection
from data.seed_data import NASA_EXPERIMENTS, KNOWLEDGE_DOCUMENTS
from services.risk_engine import compute_risk_score


def seed_experiments(conn) -> int:
    inserted = 0
    for exp in NASA_EXPERIMENTS:
        existing = conn.execute(
            "SELECT id FROM experiments WHERE experiment_id = ?",
            (exp["experiment_id"],)
        ).fetchone()
        if existing:
            continue

        columns = ", ".join(exp.keys())
        placeholders = ", ".join(["?"] * len(exp))
        conn.execute(
            f"INSERT INTO experiments ({columns}) VALUES ({placeholders})",
            list(exp.values())
        )
        inserted += 1
    conn.commit()
    print(f"[Seeder] Inserted {inserted} new experiments ({len(NASA_EXPERIMENTS)} total in seed).")
    return inserted


def seed_risk_scores(conn) -> int:
    all_exps = conn.execute("SELECT * FROM experiments").fetchall()
    inserted = 0
    for row in all_exps:
        exp = dict(row)
        existing = conn.execute(
            "SELECT id FROM risk_scores WHERE experiment_id = ?",
            (exp["experiment_id"],)
        ).fetchone()
        if existing:
            continue
        risk = compute_risk_score(exp)
        conn.execute(
            """INSERT INTO risk_scores
               (experiment_id, risk_score, risk_level, flammability_factor, thermal_factor,
                burning_rate_factor, soot_factor, suppression_factor, methodology_notes,
                confidence_level, uncertainty_pct, formula)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                risk["experiment_id"], risk["risk_score"], risk["risk_level"],
                risk["flammability_factor"], risk["thermal_factor"],
                risk["burning_rate_factor"], risk["soot_factor"],
                risk["suppression_factor"], risk["methodology_notes"],
                risk["confidence_level"], risk["uncertainty_pct"], risk["formula"],
            )
        )
        inserted += 1
    conn.commit()
    print(f"[Seeder] Computed {inserted} new risk scores.")
    return inserted


def seed_knowledge_docs(conn) -> int:
    inserted = 0
    for doc in KNOWLEDGE_DOCUMENTS:
        existing = conn.execute(
            "SELECT id FROM knowledge_docs WHERE doc_id = ?", (doc["doc_id"],)
        ).fetchone()
        if existing:
            continue
        conn.execute(
            """INSERT INTO knowledge_docs
               (doc_id, title, authors, year, source, content, keywords, citation, url)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (
                doc["doc_id"], doc["title"], doc.get("authors"), doc.get("year"),
                doc.get("source"), doc["content"], doc.get("keywords"),
                doc.get("citation"), doc.get("url"),
            )
        )
        inserted += 1
    conn.commit()
    print(f"[Seeder] Inserted {inserted} new knowledge documents.")
    return inserted


def seed_all():
    conn = get_connection()
    seed_experiments(conn)
    seed_risk_scores(conn)
    seed_knowledge_docs(conn)
    conn.close()
    print("[Seeder] Database seeding complete.")


if __name__ == "__main__":
    from models.database import init_db
    init_db()
    seed_all()
