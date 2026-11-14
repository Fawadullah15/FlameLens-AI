import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess?: () => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({ isOpen, onClose, onIngestSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceId, setSourceId] = useState('SRC-NASA-NTRS');
  const [seriesTag, setSeriesTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_id', sourceId);
    if (seriesTag) formData.append('series_tag', seriesTag);

    try {
      const res = await api.uploadFile(formData);
      setResult(res);
      setLoading(false);
      if (onIngestSuccess) onIngestSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Ingestion failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-space-900 border border-space-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-space-700 bg-space-850">
          <div className="flex items-center space-x-3">
            <img
              src="/flamelens-logo.png"
              alt="FlameLens Emblem"
              className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            />
            <div className="flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-teal-400" />
              <h3 className="font-display font-semibold text-slate-100 text-sm tracking-wide">
                NASA DATA INGESTION ENGINE (PyMuPDF)
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-300 mb-1">{result.message}</p>
                  <p className="font-mono text-[11px] text-emerald-400">
                    DOC ID: {result.doc_id} • Pages: {result.page_count || 1} • FTS5: Indexed
                  </p>
                </div>
              </div>

              {result.detected_keywords && result.detected_keywords.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-2">DETECTED COMBUSTION KEYWORDS:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detected_keywords.map((kw: string) => (
                      <span key={kw} className="px-2 py-0.5 rounded bg-space-800 border border-space-700 text-cyan-300 text-[11px] font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => { setResult(null); setFile(null); onClose(); }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium font-mono"
                >
                  DONE
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  SELECT NASA RESEARCH PDF OR JSON DATASET:
                </label>
                <input
                  type="file"
                  accept=".pdf,.json,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-space-800 file:text-cyan-300 hover:file:bg-space-700 border border-space-700 rounded-lg p-2 bg-space-950 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    SOURCE REPOSITORY:
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
                  >
                    <option value="SRC-NASA-NTRS">NASA NTRS Archive</option>
                    <option value="SRC-NASA-PSI">NASA PSI Database</option>
                    <option value="SRC-PECS-DIETRICH">Dietrich et al. (FLEX)</option>
                    <option value="SRC-COMBFLAME-NAYAGAM">Nayagam et al. (CFI)</option>
                    <option value="SRC-NASA-TM-URBAN">Urban et al. (ACME)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    SERIES TAG (OPTIONAL):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FLEX, ACME, SoFIE"
                    value={seriesTag}
                    onChange={(e) => setSeriesTag(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 rounded-lg p-2 text-xs text-slate-200 font-mono placeholder:text-slate-600"
                  />
                </div>
              </div>

              <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                PyMuPDF extracts page text, detects combustion parameters (LOI, droplet diameter, burning rate), and builds full-text FTS5 BM25 search indices immediately.
              </p>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-space-800 hover:bg-space-700 text-slate-300 rounded-lg text-xs font-mono"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium font-mono tracking-wider shadow-glow-teal"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>PARSING VIA PYMUPDF...</span>
                    </>
                  ) : (
                    <span>START INGESTION</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
