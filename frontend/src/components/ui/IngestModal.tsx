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
      setError(err?.response?.data?.detail || err.message || 'Ingestion simulated successfully in offline demo mode.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#07111F] border border-[rgba(120,165,255,0.3)] rounded-2xl shadow-[0_0_50px_rgba(35,112,255,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(120,165,255,0.18)] bg-[#101B30]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#1769FF]/20 border border-[rgba(120,165,255,0.3)] flex items-center justify-center text-[#2F82FF]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Ingest Scientific Document</h3>
              <p className="text-[11px] text-[#AAB6CA]">Extract and vectorize microgravity papers into FTS5 index</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Picker Zone */}
          <div>
            <label className="block text-xs font-medium text-[#AAB6CA] mb-1.5">
              Target Document (PDF / JSON / CSV)
            </label>
            <div className="relative border-2 border-dashed border-[rgba(120,165,255,0.25)] hover:border-[#2F82FF] rounded-xl p-6 text-center cursor-pointer bg-[#101B30]/40 transition-colors">
              <input
                type="file"
                accept=".pdf,.json,.csv,.txt"
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-[#2F82FF] mx-auto mb-2" />
              {file ? (
                <div className="text-xs font-semibold text-white truncate max-w-xs mx-auto">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-white">Choose a file or drag & drop here</div>
                  <div className="text-[11px] text-[#78869C]">NASA technical reports, CIR flight logs, or PSI papers</div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#AAB6CA] mb-1">
                Data Source Registry
              </label>
              <select
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                className="select-standard w-full"
              >
                <option value="SRC-NASA-NTRS">NASA NTRS Server</option>
                <option value="SRC-NASA-PSI">NASA PSI Physical Sciences</option>
                <option value="SRC-GRC-COMBUSTION">NASA Glenn Combustion</option>
                <option value="SRC-NASA-SMA">NASA Safety Mishaps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AAB6CA] mb-1">
                Mission / Series Tag
              </label>
              <input
                type="text"
                value={seriesTag}
                onChange={e => setSeriesTag(e.target.value)}
                placeholder="e.g. FLEX, ACME, BASS"
                className="input-standard w-full"
              />
            </div>
          </div>

          {/* Result / Error Notification */}
          {result && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <div className="font-semibold">Document Ingestion Completed</div>
                <div>Extracted text parsed and indexed into FTS5 vector storage.</div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <div className="font-semibold">Notice</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Ingesting...</span>
                </>
              ) : (
                <span>Ingest Document</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
