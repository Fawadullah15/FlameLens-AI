import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Loader2,
  Printer,
  ChevronRight,
  Database,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { Experiment } from '../types';
import { STATIC_EXPERIMENTS } from '../data/staticData';

export const ReportsFindings: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>(STATIC_EXPERIMENTS as Experiment[]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['FLEX-001', 'CFI-001', 'ACME-001']);
  const [reportTitle, setReportTitle] = useState('FlameLens AI Fire Safety & Combustion Mission Briefing');
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => setExperiments(res.experiments))
      .catch(err => console.error('Failed to load experiments:', err));
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
    } catch (e) {
      console.error(e);
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

  const handlePrintPDF = () => {
    window.print();
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3442]">
        <div className="flex items-center gap-4">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens Emblem"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
                MISSION DOCUMENTATION ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">
                STANDARDIZED NASA SCIENTIFIC BRIEFINGS & PDF EXPORTS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Reports & Scientific Findings
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-0.5">
              Compile empirical NASA microgravity combustion measurements, D² kinetics, and flammability risk rankings into standardized scientific reports.
            </p>
          </div>
        </div>
      </div>

      {/* ── Generator Form & Output Split ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Parameter Config (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0E1821] border border-[#1E3442] space-y-4">
          <h3 className="font-display font-semibold text-sm text-slate-100 border-b border-[#1E3442] pb-2">
            Report Parameters
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              REPORT TITLE:
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-[#0A1118] border border-[#1E3442] rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-1 font-mono text-xs text-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRisk}
                onChange={(e) => setIncludeRisk(e.target.checked)}
                className="rounded bg-[#0A1118] border-[#1E3442] text-cyan-500 focus:ring-0"
              />
              <span>Include Fire Safety Risk Audit</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTelemetry}
                onChange={(e) => setIncludeTelemetry(e.target.checked)}
                className="rounded bg-[#0A1118] border-[#1E3442] text-cyan-500 focus:ring-0"
              />
              <span>Include Detailed Sensor Telemetry</span>
            </label>
          </div>

          {/* Select Experiments */}
          <div className="space-y-2 pt-2 border-t border-[#1E3442]">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">INCLUDE EXPERIMENTS ({selectedIds.length}):</span>
              <button
                onClick={() => setSelectedIds(experiments.slice(0, 6).map(e => e.experiment_id))}
                className="text-cyan-400 hover:text-cyan-300 text-[10px]"
              >
                Top 6
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {experiments.map(exp => {
                const isSelected = selectedIds.includes(exp.experiment_id);
                return (
                  <button
                    key={exp.experiment_id}
                    onClick={() => toggleSelect(exp.experiment_id)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#13212C] border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-[#0A1118] border-[#1E3442] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{exp.experiment_id} — {exp.fuel_type}</span>
                    <span className="text-[10px] text-slate-500">{exp.gravity_level === 0 ? 'μg' : '1-g'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedIds.length === 0}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 shadow-glow-cyan transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>COMPILING REPORT...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE REPORT</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Document View (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#0E1821] border border-[#1E3442] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3442] pb-3">
              <div>
                <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Report Output Document</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {generatedReport ? `DOCUMENT ID: ${generatedReport.report_id}` : 'READY TO COMPILE'}
                </span>
              </div>

              {generatedReport && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-[#0A1118] hover:bg-[#13212C] border border-[#1E3442] text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy MD'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-[#0A1118] hover:bg-[#13212C] border border-[#1E3442] text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>

                  <button
                    onClick={handlePrintPDF}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 text-xs font-mono text-cyan-300 flex items-center space-x-1 transition-colors shadow-glow-cyan"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Document Content Box */}
            <div className="mt-4 p-5 rounded-lg bg-[#05090D] border border-[#1E3442] max-h-[550px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-text">
              {generatedReport ? (
                generatedReport.markdown_content
              ) : (
                <div className="py-24 text-center text-slate-500 font-mono text-xs space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Configure parameters on the left and click "GENERATE REPORT".</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E3442] text-[10px] font-mono text-slate-500 flex justify-between">
            <span>NASA SPACE APPS 2026 STANDARDS</span>
            <span>STRUCTURED MARKDOWN & PRINT-READY FORMAT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
