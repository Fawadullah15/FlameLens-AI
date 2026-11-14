import sys
sys.path.insert(0, 'E:/pip-libs')
sys.path.insert(0, '.')

print('=== FlameLens Backend Validation ===')

from models.database import init_db
init_db()
print('[1/5] DB schema OK')

from data.db_seeder import seed_all
seed_all()
print('[2/5] Seed OK')

from models.database import get_connection
conn = get_connection()
n_exp  = conn.execute('SELECT COUNT(*) FROM experiments').fetchone()[0]
n_risk = conn.execute('SELECT COUNT(*) FROM risk_scores').fetchone()[0]
n_docs = conn.execute('SELECT COUNT(*) FROM knowledge_docs').fetchone()[0]
print(f'[3/5] DB: {n_exp} experiments | {n_risk} risk scores | {n_docs} docs')

from services.risk_engine import compute_risk_score
row = dict(conn.execute('SELECT * FROM experiments LIMIT 1').fetchone())
risk = compute_risk_score(row)
eid = row['experiment_id']
score = risk['risk_score']
level = risk['risk_level']
print(f'[4/5] Risk engine: {eid} => score={score} | level={level}')

from services.analysis_engine import burning_rate_comparison, get_dashboard_stats
br = burning_rate_comparison()
stats = get_dashboard_stats()
n_br = len(br['data'])
n_total = stats['total_experiments']
print(f'[5/5] Analysis: {n_br} burn-rate pts | {n_total} experiments in dashboard')
conn.close()
print()
print('=== ALL CHECKS PASSED ===')
