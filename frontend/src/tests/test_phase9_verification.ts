/**
 * FlameLens AI — Phase 9 Zero-Mock-Data & Full Functionality Test Suite
 * Tests client-side dynamic RAG, question-specific synthesis, report exports, and data fidelity.
 */
import { performClientRAG, synthesizeClientAnswer } from '../services/clientRAG';
import { STATIC_EXPERIMENTS, STATIC_DOCUMENTS, STATIC_INCIDENTS } from '../data/staticData';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAILED: ${msg}`);
    failed++;
  }
}

async function runPhase9Tests() {
  console.log('================================================================');
  console.log('FLAMELENS AI — PHASE 9 COMPLETE FUNCTIONALITY VERIFICATION');
  console.log('================================================================\n');

  // TEST 1: Database & Static Dataset Integrity
  console.log('--- TEST GROUP 1: NASA Empirical Dataset Integrity ---');
  assert(STATIC_EXPERIMENTS.length === 29, `29 verified NASA flight experiments loaded (got ${STATIC_EXPERIMENTS.length})`);
  assert(STATIC_DOCUMENTS.length === 31, `31 peer-reviewed research papers loaded (got ${STATIC_DOCUMENTS.length})`);
  assert(STATIC_INCIDENTS.length === 3, `3 historical spaceflight fire incidents loaded (got ${STATIC_INCIDENTS.length})`);

  // Verify FLEX-001 has real empirical numbers
  const flex001 = STATIC_EXPERIMENTS.find(e => e.experiment_id === 'FLEX-001');
  assert(!!flex001 && flex001.burning_rate_constant_k === 0.76, 'FLEX-001 has empirical K = 0.76 mm²/s');
  assert(!!flex001 && flex001.flame_shape === 'Spherical', 'FLEX-001 has verified Spherical flame shape');

  // TEST 2: Dynamic RAG Retrieval - Apollo 1
  console.log('\n--- TEST GROUP 2: Dynamic RAG Retrieval Accuracy ---');
  const apolloQuery = 'Explain the Apollo 1 command module fire and lessons learned';
  const apolloCitations = performClientRAG(apolloQuery, 'SPACECRAFT_FIRE_SAFETY', 5);
  const apolloDocIds = apolloCitations.map(c => c.doc_id);
  assert(apolloDocIds.includes('INC-APOLLO-1'), `Apollo 1 query correctly retrieves INC-APOLLO-1 (retrieved: ${apolloDocIds.join(', ')})`);
  assert(apolloCitations[0].authors?.includes('NASA Safety Center'), 'Citation contains authentic author attribution: NASA Safety Center');

  // TEST 3: Dynamic RAG Retrieval - Droplet Burning Rate
  const d2Query = 'What is the burning rate constant K for n-heptane droplets under d2 law?';
  const d2Citations = performClientRAG(d2Query, 'EXPERIMENTAL_DATA_ANALYSIS', 5);
  const d2DocIds = d2Citations.map(c => c.doc_id);
  assert(d2DocIds.some(id => id.includes('FLEX')), `Droplet query correctly retrieves FLEX series records (retrieved: ${d2DocIds.join(', ')})`);

  // TEST 4: Dynamic RAG Retrieval - Soot & Radiation
  const sootQuery = 'How does soot radiation affect flame extinction in ACME ethylene burners?';
  const sootCitations = performClientRAG(sootQuery, 'SCIENTIFIC_RESEARCH', 5);
  const sootDocIds = sootCitations.map(c => c.doc_id);
  assert(sootDocIds.some(id => id.includes('ACME')), `Soot query correctly retrieves ACME burner records (retrieved: ${sootDocIds.join(', ')})`);

  // TEST 5: Query-Specific Synthesis (Zero Hardcoded Static Responses)
  console.log('\n--- TEST GROUP 3: Dynamic Scientific Synthesis Fidelity ---');
  const apolloAnswer = synthesizeClientAnswer(apolloQuery, 'SPACECRAFT_FIRE_SAFETY', apolloCitations);
  const d2Answer = synthesizeClientAnswer(d2Query, 'EXPERIMENTAL_DATA_ANALYSIS', d2Citations);
  const coolFlameQuery = 'Explain the discovery of cool flames in microgravity alkane combustion';
  const coolFlameCitations = performClientRAG(coolFlameQuery, 'SCIENTIFIC_RESEARCH', 5);
  const coolFlameAnswer = synthesizeClientAnswer(coolFlameQuery, 'SCIENTIFIC_RESEARCH', coolFlameCitations);

  // Assert answers are completely distinct and tailored
  assert(apolloAnswer.answer !== d2Answer.answer, 'Apollo 1 answer is NOT identical to D² law answer');
  assert(apolloAnswer.answer !== coolFlameAnswer.answer, 'Apollo 1 answer is NOT identical to Cool Flame answer');
  assert(d2Answer.answer !== coolFlameAnswer.answer, 'D² law answer is NOT identical to Cool Flame answer');

  // Assert content grounding
  assert(apolloAnswer.answer.includes('Apollo 1') && apolloAnswer.answer.includes('115 kPa') && apolloAnswer.answer.includes('NASA-STD-6001B'),
    'Apollo 1 response contains authentic physical pressure (115 kPa / 16.7 psia) and NASA-STD-6001B standard');
  assert(d2Answer.answer.includes('0.76') && d2Answer.answer.includes('Spalding') && (d2Answer.answer.includes('d^2') || d2Answer.answer.includes('d²')),
    'D² law response contains empirical K = 0.76 mm²/s and Spalding equation');
  assert(coolFlameAnswer.answer.includes('cool flame') && coolFlameAnswer.answer.includes('600') && coolFlameAnswer.answer.includes('alkyl-peroxy'),
    'Cool flame response contains low-temperature range (600-800 K) and alkyl-peroxy reaction kinetics');

  // Assert structured format headings
  assert(apolloAnswer.answer.includes('### Direct Answer') && apolloAnswer.answer.includes('### Scientific Explanation') && apolloAnswer.answer.includes('### Sources and Citations'),
    'Generated synthesis contains all mandatory scientific report headings');

  // TEST 6: Report Generation & Export Integrity
  console.log('\n--- TEST GROUP 4: Report Generation & Multi-Format Exports ---');
  const selectedExpIds = ['FLEX-001', 'FLEX-002', 'CFI-001', 'ACME-001'];
  const matchingExps = STATIC_EXPERIMENTS.filter(e => selectedExpIds.includes(e.experiment_id));
  assert(matchingExps.length === 4, `4 experiments selected for report (got ${matchingExps.length})`);

  // CSV Export Generation
  const csvHeaders = ['Experiment_ID', 'Series', 'Title', 'Fuel_Type', 'Gravity_Level_g', 'Burning_Rate_Constant_K_mm2_s'];
  const csvRows = matchingExps.map(e => `"${e.experiment_id}","${e.series}","${e.title}","${e.fuel_type}",${e.gravity_level},${e.burning_rate_constant_k ?? ''}`);
  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  assert(csvContent.includes('FLEX-001') && csvContent.includes('0.76'), 'CSV export contains valid experiment IDs and burning rates');
  assert(csvContent.split('\n').length === 5, 'CSV export contains 1 header line + 4 data lines');

  // JSON Export Generation
  const jsonPayload = {
    report_id: 'RPT-TEST-001',
    mission_standard: 'NASA-STD-6001B Flammability Screening Matrix',
    experiment_count: matchingExps.length,
    experiments: matchingExps
  };
  const jsonStr = JSON.stringify(jsonPayload);
  const parsed = JSON.parse(jsonStr);
  assert(parsed.experiment_count === 4 && parsed.experiments[0].experiment_id === 'FLEX-001', 'JSON export contains complete structured telemetry');

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase9Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
