import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Square,
  Trash2,
  Copy,
  Check,
  Activity,
  Flame,
  BarChart2,
  Cpu,
  Layers,
  Info,
  ChevronRight,
  Database,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage, CitationRef, AIMode, StreamMetadata } from '../types';

const MODE_CONFIGS: Record<AIMode, { label: string; badge: string; desc: string; icon: any; color: string }> = {
  SCIENTIFIC_RESEARCH: {
    label: 'Scientific Research',
    badge: 'MODE A: THEORY',
    desc: 'Combustion kinetics, spherical flame geometry, cool flames, and soot radiation',
    icon: Sparkles,
    color: 'border-cyan-500/70 text-cyan-300 bg-cyan-950/40 shadow-glow-cyan'
  },
  SPACECRAFT_FIRE_SAFETY: {
    label: 'Spacecraft Fire Safety',
    badge: 'MODE B: SAFETY',
    desc: 'Cabin oxygen hazards, detector latency, suppression protocols, and Apollo/Mir lessons',
    icon: Flame,
    color: 'border-rose-500/70 text-rose-300 bg-rose-950/40 shadow-glow-danger'
  },
  EXPERIMENTAL_DATA_ANALYSIS: {
    label: 'Experimental Data Analysis',
    badge: 'MODE C: DATA',
    desc: 'D² law linear regressions, burning rate K, R² fit, and microgravity vs 1-g comparisons',
    icon: BarChart2,
    color: 'border-teal-500/70 text-teal-300 bg-teal-950/40 shadow-glow-teal'
  }
};

const SUGGESTED_QUESTIONS: Record<AIMode, string[]> = {
  SCIENTIFIC_RESEARCH: [
    "Why does flame shape change in microgravity?",
    "Explain the D² law using NASA experiments.",
    "Compare FLEX and FLEX-2 findings.",
    "What causes flame extinction in microgravity?"
  ],
  SPACECRAFT_FIRE_SAFETY: [
    "What happened during the Apollo 1 fire?",
    "What lessons came from the Mir fire?",
    "How does oxygen concentration influence combustion?",
    "How could spacecraft fire safety improve for Artemis?"
  ],
  EXPERIMENTAL_DATA_ANALYSIS: [
    "Compare heptane burning rates: microgravity vs 1-g.",
    "What is the D² burning rate K for FLEX-001?",
    "How does oxygen concentration affect flame standoff?",
    "Summarize soot production differences across fuel types."
  ]
};

// Formats Markdown content with code blocks, tables, bold text, and math equations
const FormattedScientificContent: React.FC<{ content: string }> = ({ content }) => {
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-3 text-xs leading-relaxed text-slate-200">
      {blocks.map((block, idx) => {
        // Table Detection
        if (block.trim().startsWith('|') && block.includes('---')) {
          const rows = block.trim().split('\n').map(r => r.split('|').filter(c => c.trim().length > 0));
          if (rows.length >= 2) {
            const header = rows[0];
            const dataRows = rows.slice(2);
            return (
              <div key={idx} className="overflow-x-auto my-3 p-2 bg-[#05090D] rounded-lg border border-[#1E3442]">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1E3442] text-cyan-400">
                      {header.map((col, i) => (
                        <th key={i} className="py-1 px-2.5 font-bold uppercase">{col.trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3442]/60 text-slate-300">
                    {dataRows.map((r, ri) => (
                      <tr key={ri} className="hover:bg-[#13212C]/40">
                        {r.map((c, ci) => (
                          <td key={ci} className="py-1 px-2.5">{c.trim()}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Section Headings (###)
        if (block.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-display font-bold text-sm text-cyan-300 pt-2 border-b border-[#1E3442] pb-1">
              {block.replace('### ', '')}
            </h4>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-display font-bold text-base text-white pt-2 border-b border-[#1E3442] pb-1">
              {block.replace('## ', '')}
            </h3>
          );
        }

        // Bullet Lists
        if (block.startsWith('* ') || block.startsWith('- ') || block.match(/^\d+\.\s/)) {
          const items = block.split('\n').filter(i => i.trim().length > 0);
          return (
            <ul key={idx} className="space-y-1 my-2 pl-4 list-disc marker:text-cyan-400">
              {items.map((it, i) => {
                const cleaned = it.replace(/^(\*|-|\d+\.)\s*/, '');
                return <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(cleaned) }} />;
              })}
            </ul>
          );
        }

        // Default Paragraph
        return (
          <p
            key={idx}
            className="text-slate-300 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: formatInline(block) }}
          />
        );
      })}
    </div>
  );
};

function formatInline(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-[#05090D] text-cyan-300 font-mono text-[11px] border border-[#1E3442]">$1</code>')
    .replace(/d\^2/g, 'd²')
    .replace(/d0\^2/g, 'd₀²');
}

export const AICopilot: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AIMode>('SCIENTIFIC_RESEARCH');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => `SES-${Date.now().toString(36).toUpperCase()}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>('GEMINI 2.5 FLASH');
  const [latestSources, setLatestSources] = useState<CitationRef[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMsg: ChatMessage = {
      id: 'welcome-001',
      role: 'assistant',
      content: `### Welcome to FlameLens AI — Scientific Research Copilot

I am your mission-grounded scientific copilot specialized in **microgravity combustion kinetics**, **flame morphology**, and **spacecraft fire safety protocols**.

All responses are strictly derived from verified **NASA Glenn Research Center (GRC)**, **ISS Combustion Integrated Rack (CIR)**, and **NASA Physical Sciences Informatics (PSI)** flight records.

Select a research mode above or choose a standard mission inquiry below to begin.`,
      sources: [
        {
          source_id: 'SRC-NASA-PSI',
          title: 'NASA Physical Sciences Informatics (PSI) Repository',
          doc_id: 'NASA-PSI-REPO',
          url: 'https://psi.nasa.gov/'
        },
        {
          source_id: 'SRC-NASA-GLENN',
          title: 'NASA Glenn Research Center Combustion Science Branch',
          doc_id: 'NASA-GRC-COMB',
          url: 'https://www1.grc.nasa.gov/'
        }
      ],
      mode: 'SCIENTIFIC_RESEARCH',
      status: 'complete'
    };

    setMessages([welcomeMsg]);
    setLatestSources(welcomeMsg.sources || []);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleClear = () => {
    if (isStreaming) handleStopStream();
    setMessages([]);
    setSessionId(`SES-${Date.now().toString(36).toUpperCase()}`);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isStreaming) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: q,
      mode: activeMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'complete'
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      mode: activeMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'streaming'
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setInput('');
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const historyPayload = messages.slice(-4).map(m => ({
      role: m.role,
      content: m.content
    }));

    await api.streamChatMessage(
      {
        question: q,
        session_id: sessionId,
        mode: activeMode,
        history: historyPayload
      },
      {
        onMetadata: (meta: StreamMetadata) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, sources: meta.sources, mode: meta.mode } : m
            )
          );
          if (meta.sources && meta.sources.length > 0) {
            setLatestSources(meta.sources);
          }
        },
        onChunk: (chunkText: string) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: m.content + chunkText } : m
            )
          );
        },
        onDone: () => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, status: 'complete' } : m
            )
          );
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        onError: (err: any) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: m.content ? m.content : `Synthesis error: ${err.message || 'Stream disconnected'}.`,
                    status: 'error'
                  }
                : m
            )
          );
          setIsStreaming(false);
          abortControllerRef.current = null;
        }
      },
      abortController.signal
    );
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col max-w-7xl mx-auto space-y-3">
      {/* ── Top Header & Mode Switcher ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E3442] pb-3">
        <div className="flex items-center gap-3.5">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens AI"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
                NASA RESEARCH COPILOT
              </span>
              <span className="text-xs font-mono text-slate-400">GROUNDED GEMINI RAG • FTS5 RETRIEVAL</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              AI Scientific Copilot
            </h1>
          </div>
        </div>

        {/* Action Controls & Model Telemetry */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1821] border border-[#1E3442] text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-300 font-semibold">{activeModel}</span>
          </div>

          <button
            onClick={handleClear}
            title="Clear Chat History"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E1821] hover:bg-[#13212C] border border-[#1E3442] text-slate-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Clear</span>
          </button>
        </div>
      </div>

      {/* ── Mode Selection Segmented Bar ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {(Object.keys(MODE_CONFIGS) as AIMode[]).map((modeKey) => {
          const cfg = MODE_CONFIGS[modeKey];
          const isSelected = activeMode === modeKey;
          const Icon = cfg.icon;

          return (
            <button
              key={modeKey}
              onClick={() => setActiveMode(modeKey)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? cfg.color
                  : 'bg-[#0E1821] border-[#1E3442] text-slate-400 hover:bg-[#13212C] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold tracking-wider">{cfg.badge}</span>
                <Icon className="w-3.5 h-3.5 opacity-80" />
              </div>
              <div className="font-semibold text-xs text-white mb-0.5">{cfg.label}</div>
              <p className="text-[10px] font-mono text-slate-400 line-clamp-1">{cfg.desc}</p>
            </button>
          );
        })}
      </div>

      {/* ── 3-Column Workspace Layout ─────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Left Section: Session Controls & Suggested Questions (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442] overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold mb-2">
                ACTIVE SESSION
              </span>
              <div className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442] font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>SESSION ID:</span>
                  <span className="text-cyan-400 font-bold">{sessionId}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>TURNS:</span>
                  <span className="text-slate-200">{messages.length} messages</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold mb-2">
                SUGGESTED INQUIRIES
              </span>
              <div className="space-y-1.5">
                {SUGGESTED_QUESTIONS[activeMode].map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sq)}
                    disabled={isStreaming}
                    className="w-full text-left p-2 rounded-lg bg-[#0A1118] hover:bg-[#13212C] border border-[#1E3442] hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-start space-x-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <span className="line-clamp-2">{sq}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NASA Disclaimer */}
          <div className="p-2.5 rounded-lg bg-[#05090D] border border-[#1E3442] text-[10px] font-mono text-slate-500 space-y-1">
            <span className="text-cyan-400 font-bold block uppercase">TRUTH-GROUNDING:</span>
            <p>Every response is verified against the indexed SQLite FTS5 NASA dataset.</p>
          </div>
        </div>

        {/* Center Section: Message Feed & Chat Input (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-[#0E1821] border border-[#1E3442] overflow-hidden">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const cfg = MODE_CONFIGS[msg.mode || activeMode];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-xl p-4 space-y-3 border transition-all ${
                      isUser
                        ? 'bg-[#13212C] border-cyan-500/50 text-cyan-100 shadow-glow-cyan'
                        : 'bg-[#0A1118] border-[#1E3442] text-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-[#1E3442]/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {isUser ? (
                            <>👤 FLIGHT RESEARCHER</>
                          ) : (
                            <>
                              <img
                                src="/flamelens-logo.png"
                                alt="FlameLens Copilot"
                                className="w-4 h-4 object-contain inline-block drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                              />
                              <span>FLAMELENS SCIENTIFIC COPILOT</span>
                            </>
                          )}
                        </span>
                        {!isUser && msg.mode && (
                          <span className="px-1.5 py-0.2 rounded bg-[#0E1821] text-cyan-400 border border-[#1E3442] text-[9px]">
                            {cfg.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {!isUser && msg.content && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                            title="Copy Response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    {isUser ? (
                      <p className="font-mono text-xs leading-relaxed text-cyan-100 whitespace-pre-line">
                        {msg.content}
                      </p>
                    ) : (
                      <div>
                        <FormattedScientificContent content={msg.content} />
                        {msg.status === 'streaming' && (
                          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle" />
                        )}
                      </div>
                    )}

                    {/* Citations under assistant answer */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#1E3442] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-semibold text-cyan-400 flex items-center gap-1.5 uppercase">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                            <span>VERIFIED NASA CITATIONS ({msg.sources.length}):</span>
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">PEER-REVIEWED</span>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.sources.map((s, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-[#05090D] border border-[#1E3442] flex items-center justify-between text-[11px] font-mono group hover:border-cyan-500/50 transition-colors"
                            >
                              <div className="truncate pr-2">
                                <span className="text-cyan-400 font-bold mr-1.5">[{idx + 1}]</span>
                                <span className="text-slate-300 font-semibold">{s.title}</span>
                              </div>
                              {s.url && (
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 flex-shrink-0"
                                >
                                  <span>Archive</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 bg-[#0A1118] border-t border-[#1E3442]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about microgravity combustion, spherical flames, or spacecraft fire safety..."
                disabled={isStreaming}
                className="flex-1 bg-[#05090D] border border-[#1E3442] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
              />

              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopStream}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>STOP</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-40 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-glow-cyan transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND</span>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Section: Telemetry & Citation Inspector (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-3.5 rounded-xl bg-[#0E1821] border border-[#1E3442] overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>GROUNDED EVIDENCE CITATIONS</span>
              </span>

              {latestSources.length > 0 ? (
                <div className="space-y-2">
                  {latestSources.map((src, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#0A1118] border border-[#1E3442] space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">{src.source_id || 'NASA'}</span>
                        <span className="text-emerald-400">VERIFIED</span>
                      </div>
                      <h5 className="text-[11px] font-semibold text-slate-200 line-clamp-2">{src.title}</h5>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                        >
                          <span>Open Repository</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] text-xs font-mono text-slate-500 text-center">
                  Citations will populate dynamically when you submit a question.
                </div>
              )}
            </div>

            {/* Hardware Telemetry Card */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold mb-2">
                FLIGHT HARDWARE TELEMETRY
              </span>
              <div className="p-3 rounded-lg bg-[#0A1118] border border-[#1E3442] font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>FACILITY:</span>
                  <span className="text-cyan-400 font-bold">ISS CIR</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>CHAMBER:</span>
                  <span className="text-slate-200">100-Liter Vessel</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>MICROGRAVITY:</span>
                  <span className="text-emerald-400 font-bold">10⁻⁶ g</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>REPOSITORIES:</span>
                  <span className="text-slate-200">28 Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#05090D] border border-[#1E3442] text-[10px] font-mono text-slate-500">
            <span>LLM: Gemini 2.5 Flash • Context: FTS5 BM25</span>
          </div>
        </div>
      </div>
    </div>
  );
};
