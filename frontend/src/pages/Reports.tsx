import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Experiment } from '../types';

export const Reports: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['FLEX-001', 'CFI-001', 'ACME-001']);
  const [reportTitle, setReportTitle] = useState('FlameLens AI Fire Safety Mission Briefing');
  const [includeRisk, setIncludeRisk] = useState(true);
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getExperiments({ limit: 100 })
      .then(res => setExperiments(res.experiments));
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

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src="/flamelens-logo.png"
          alt="FlameLens Insignia"
          className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] flex-shrink-0"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
              MISSION DOCUMENTATION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">PUBLICATION-GRADE RESEARCH SUMMARIES</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight mt-1">
            Research Reports Generator
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Compile empirical NASA microgravity combustion measurements, sensor parameter tables, and flammability risk rankings into standardized scientific Markdown reports.
          </p>
        </div>
      </div>

      {/* Report Generator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Options Card */}
        <div className="p-5 rounded-xl nasa-card border border-space-700 space-y-4">
          <h3 className="font-display font-semibold text-sm text-slate-100">
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
              className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRisk}
                onChange={(e) => setIncludeRisk(e.target.checked)}
                className="rounded bg-space-950 border-space-700 text-cyan-500 focus:ring-0"
              />
              <span>Include Fire Safety Risk Audit</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTelemetry}
                onChange={(e) => setIncludeTelemetry(e.target.checked)}
                className="rounded bg-space-950 border-space-700 text-cyan-500 focus:ring-0"
              />
              <span>Include Detailed Sensor Telemetry</span>
            </label>
          </div>

          {/* Select Experiments */}
          <div className="space-y-2 pt-2 border-t border-space-800">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">INCLUDE EXPERIMENTS:</span>
              <span className="text-cyan-400 font-semibold">{selectedIds.length} SELECTED</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {experiments.map((exp) => {
                const checked = selectedIds.includes(exp.experiment_id);
                return (
                  <div
                    key={exp.experiment_id}
                    onClick={() => toggleSelect(exp.experiment_id)}
                    className={`p-2 rounded-lg text-xs font-mono cursor-pointer flex items-center justify-between border ${
                      checked
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                        : 'bg-space-950 text-slate-400 border-space-800'
                    }`}
                  >
                    <span>{exp.experiment_id}</span>
                    <span className="text-[10px] text-slate-500">{exp.fuel_type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={selectedIds.length === 0 || loading}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono font-medium tracking-wider flex items-center justify-center space-x-2 shadow-glow-cyan"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>COMPILING REPORT...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>GENERATE RESEARCH REPORT</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-2 p-5 rounded-xl nasa-card border border-space-700 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-space-700 pb-3">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-100">
                Generated Report Output
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {generatedReport ? `Report ID: ${generatedReport.report_id} • ${generatedReport.experiment_count} Experiments` : 'Configure parameters and click Generate'}
              </p>
            </div>

            {generatedReport && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-xs font-mono text-slate-300 flex items-center space-x-1.5 border border-space-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY MD'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-xs font-mono text-cyan-300 flex items-center space-x-1.5 border border-cyan-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[400px]">
            {generatedReport ? (
              <pre className="text-xs font-mono text-slate-200 bg-space-950 p-4 rounded-xl border border-space-800 h-[480px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {generatedReport.markdown_content}
              </pre>
            ) : (
              <div className="h-[480px] flex flex-col items-center justify-center font-mono text-xs text-slate-500 space-y-2">
                <FileText className="w-10 h-10 text-space-700" />
                <p>Click 'Generate Research Report' to assemble the publication document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
