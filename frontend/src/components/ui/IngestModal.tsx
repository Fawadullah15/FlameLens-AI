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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white border border-[#E5E5E5] rounded-[12px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F8]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white border border-[#E5E5E5] rounded-[8px]">
              <UploadCloud className="w-5 h-5 text-[#B86B39]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#272727]">Ingest Research Data</h3>
              <p className="text-xs text-[#6B6B6B]">Add NASA technical reports (PDF) or PSI CSV datasets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[#8A8A8A] hover:text-[#272727] hover:bg-[#EAEAEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[8px] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[8px] text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">Document Ingested Successfully</p>
                <p className="text-[11px] text-emerald-700">Document ID: {result.doc_id || result.id || 'NTRS-NEW'}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#272727] mb-1.5">
              Source Repository
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-[8px] text-xs text-[#272727] focus:outline-none focus:ring-1 focus:ring-[#242424]"
            >
              <option value="SRC-NASA-NTRS">NASA Technical Reports Server (NTRS)</option>
              <option value="SRC-NASA-PSI">NASA Physical Sciences Informatics (PSI)</option>
              <option value="SRC-ESA-ERASMUS">ESA Erasmus Experiment Archive</option>
              <option value="SRC-JAXA-KIBO">JAXA Kibo ISS Utilization Archive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#272727] mb-1.5">
              Investigation Tag (Optional)
            </label>
            <input
              type="text"
              value={seriesTag}
              onChange={(e) => setSeriesTag(e.target.value)}
              placeholder="e.g. FLEX, ACME, BASS-II, CIR-MDCA"
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-[8px] text-xs text-[#272727] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#242424]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#272727] mb-1.5">
              Document or Dataset File (.pdf, .csv, .txt)
            </label>
            <div className="border-2 border-dashed border-[#E5E5E5] rounded-[10px] p-6 text-center hover:border-[#D4D4D4] bg-[#F7F7F8] cursor-pointer">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.csv,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div className="flex items-center justify-center space-x-2 text-xs text-[#272727]">
                    <FileText className="w-4 h-4 text-[#B86B39]" />
                    <span className="font-semibold">{file.name}</span>
                    <span className="text-[#8A8A8A]">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-[#8A8A8A] mx-auto mb-2" />
                    <p className="text-xs font-medium text-[#272727]">Click to select a scientific file</p>
                    <p className="text-[11px] text-[#8A8A8A] mt-1">PDF papers or CSV experiment records</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E5E5]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#272727] bg-white border border-[#E5E5E5] rounded-[6px] hover:bg-[#F7F7F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#242424] hover:bg-[#383838] disabled:opacity-50 rounded-[6px] flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Ingesting...' : 'Ingest Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
