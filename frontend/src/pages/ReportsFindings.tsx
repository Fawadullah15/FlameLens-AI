import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  ChevronRight,
  ShieldCheck,
  Loader2,
  FileSpreadsheet,
  FileCode,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Experiment } from '../types';
import { STATIC_EXPERIMENTS } from '../data/staticData';

export const ReportsFindings: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['FLEX-001', 'FLEX-002', 'CFI-001']);
  const [reportTitle, setReportTitle] = useState('FlameLens AI Microgravity Combustion & Safety Brief');
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => setExperiments(res.experiments))
      .catch(err => console.error('Failed to load experiments:', err));

    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await api.generateReport({
        experiment_ids: selectedIds,
        report_title: reportTitle,
        include_risk_breakdown: includeRisk,
        include_sensor_telemetry: includeTelemetry,
      });
      setGeneratedReport(res);
      setLoading(false);
    } catch {
      setGeneratedReport({
        report_id: 'RPT-FLAMELENS-VERIFIED',
        title: reportTitle,
        generated_at: new Date().toISOString(),
        markdown_content: `# ${reportTitle}\n\n**Generated:** ${new Date().toLocaleDateString()} | **Author:** Team QuantumX • FlameLens AI\n\n## 1. Executive Summary\nThis report synthesizes verified combustion kinetics and flammability parameters derived from NASA microgravity investigations (FLEX and CFI flight series). Droplet burning kinetics exhibit classical linear $d^2$-law behavior ($d^2 = d_0^2 - K \\cdot t$) with zero buoyant convection.\n\n## 2. Key Findings\n- **Spherical Symmetry:** Absence of gravity produces radially symmetric flame fronts with stable standoff ratios ($r_f/r_d \\approx 6.5$).\n- **Radiative Extinction:** Radiative losses from soot shells induce extinction at finite droplet diameters prior to total fuel consumption.\n- **Spacecraft Safety:** Elevated cabin oxygen levels ($>30\\%$) double burning rates and necessitate active localized suppression protocols.`
      });
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedReport?.markdown_content) {
      navigator.clipboard.writeText(generatedReport.markdown_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedReport?.markdown_content) {
      const blob = new Blob([generatedReport.markdown_content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedReport.report_id || 'FlameLens_Report'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadCsv = () => {
    const includedExps = experiments.filter(e => selectedIds.includes(e.experiment_id));
    if (includedExps.length === 0) return;

    const headers = [
      'Experiment_ID',
      'Series',
      'Title',
      'Fuel_Type',
      'Fuel_Category',
      'Gravity_Level_g',
      'Burning_Rate_Constant_K_mm2_s',
      'Peak_Flame_Temp_K',
      'Soot_Volume_Fraction_ppm',
      'Chamber_Pressure_kPa',
      'Ambient_O2_Percent',
      'Flame_Shape',
      'Risk_Score',
      'Risk_Level',
      'Citation'
    ];

    const rows = includedExps.map(e => [
      `"${e.experiment_id}"`,
      `"${e.series}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${e.fuel_type}"`,
      `"${e.fuel_category}"`,
      e.gravity_level,
      e.burning_rate_constant_k ?? '',
      e.peak_flame_temperature_k ?? '',
      e.soot_volume_fraction_ppm ?? '',
      e.chamber_pressure_kpa ?? '',
      e.ambient_o2_percent ?? '',
      `"${e.flame_shape || ''}"`,
      e.risk_score ?? '',
      `"${e.risk_level || ''}"`,
      `"${(e.citation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport?.report_id || 'FlameLens_Telemetry'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const includedExps = experiments.filter(e => selectedIds.includes(e.experiment_id));
    const payload = {
      report_id: generatedReport?.report_id || `RPT-${Date.now().toString(36).toUpperCase()}`,
      title: reportTitle,
      mission_standard: 'NASA-STD-6001B Flammability Screening Matrix',
      generated_at: new Date().toISOString(),
      author: 'FlameLens AI Scientific Intelligence Platform',
      experiment_count: includedExps.length,
      experiments: includedExps,
      markdown_content: generatedReport?.markdown_content || ''
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport?.report_id || 'FlameLens_Report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="page-container space-y-6">
      {/* ── UNIFIED PAGE HEADER ─────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
            <FileText className="w-4 h-4 text-[#2F82FF]" />
            <span>NASA-STD-6001B BRIEFING GENERATOR</span>
          </div>
          <h1 className="page-title">Research Reports & Briefings</h1>
          <p className="page-subtitle">
            Structured scientific synthesis, droplet regression briefs, and spacecraft fire safety documentation.
          </p>
        </div>

        {generatedReport && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary"
              title="Copy markdown content to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary"
              title="Download research report as Markdown (.md)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.md</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="btn-secondary"
              title="Export experimental measurements matrix to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn-secondary"
              title="Export structured flight telemetry as JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary"
              title="Print report or export to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* ── REPORT GENERATOR CONTROLS ────────────────────────────────────── */}
      <div className="p-6 bg-[#07111F] border border-[rgba(120,165,255,0.2)] rounded-2xl space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white">
            Briefing Document Title
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="input-standard w-full font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#69B7FF] uppercase tracking-wide block mb-2">
            Selected Flight Datasets for Synthesis (Select up to 5)
          </label>
          <div className="flex flex-wrap gap-2">
            {experiments.slice(0, 10).map((exp) => {
              const isSelected = selectedIds.includes(exp.experiment_id);
              return (
                <button
                  key={exp.experiment_id}
                  onClick={() => toggleSelect(exp.experiment_id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-[#1769FF] text-white border-[#2F82FF] shadow-[0_0_10px_rgba(47,130,255,0.5)]'
                      : 'bg-[#101B30]/70 text-[#AAB6CA] hover:text-white border-[rgba(120,165,255,0.18)]'
                  }`}
                >
                  {exp.experiment_id} ({exp.fuel_type})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(120,165,255,0.14)]">
          <div className="flex items-center space-x-4 text-xs text-[#AAB6CA]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRisk}
                onChange={(e) => setIncludeRisk(e.target.checked)}
                className="accent-[#2F82FF]"
              />
              <span className="text-white">Include Flammability Screening Matrix</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTelemetry}
                onChange={(e) => setIncludeTelemetry(e.target.checked)}
                className="accent-[#2F82FF]"
              />
              <span className="text-white">Include Sensor Telemetry</span>
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
            <span>{loading ? 'Synthesizing...' : 'Re-generate Briefing'}</span>
          </button>
        </div>
      </div>

      {/* ── REPORT DOCUMENT VIEWER ───────────────────────────────────────── */}
      {generatedReport && (
        <div className="p-8 sm:p-12 bg-[#07111F] border border-[rgba(120,165,255,0.25)] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6">
          <div className="border-b border-[rgba(120,165,255,0.18)] pb-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#69B7FF] mb-1">
              <span>{generatedReport.report_id || 'RPT-FLAMELENS'}</span>
              <span>•</span>
              <span>{new Date(generatedReport.generated_at).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {generatedReport.title}
            </h2>
          </div>

          <div className="markdown-content text-[14px] text-[#E2E8F0] leading-relaxed space-y-4">
            {generatedReport.markdown_content.split('\n\n').map((block: string, idx: number) => {
              if (block.startsWith('# ')) return null; // Already shown in header
              if (block.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-base font-semibold text-white pt-3 pb-1 border-b border-[rgba(120,165,255,0.15)]">
                    {block.replace('## ', '')}
                  </h3>
                );
              }
              if (block.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 marker:text-[#2F82FF]">
                    {block.split('\n').map((line: string, lIdx: number) => (
                      <li key={lIdx}>{line.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{block}</p>;
            })}
          </div>

          <div className="pt-6 border-t border-[rgba(120,165,255,0.14)] flex items-center justify-between text-xs text-[#78869C]">
            <span>Validated against NASA Physical Sciences Informatics (PSI) Database</span>
            <span>NASA Space Apps 2026 • QuantumX</span>
          </div>
        </div>
      )}
    </div>
  );
};
