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
  Info
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
    color: 'border-rose-500/70 text-rose-300 bg-rose-950/40 shadow-glow-rose'
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
    "Why does combustion behave differently in microgravity?",
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
    "Explain the D² law using NASA experiments.",
    "Compare FLEX and FLEX-2 findings.",
    "Which experimental evidence supports a particular conclusion?",
    "What causes flame extinction?"
  ]
};

// ── Scientific Content Formatter (Zero-Dependency Parser) ─────────────────────
const FormattedScientificContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Heading Level 3 (### Heading)
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace('### ', '');
          const isSafety = headingText.toLowerCase().includes('safety') || headingText.toLowerCase().includes('incident');
          const isEvidence = headingText.toLowerCase().includes('evidence') || headingText.toLowerCase().includes('experiment');
          const isDirect = headingText.toLowerCase().includes('direct answer');

          return (
            <div key={idx} className="pt-3 pb-1 border-b border-space-800/80 mb-2 first:pt-0">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDirect
                  ? 'text-cyan-300'
                  : isSafety
                  ? 'text-rose-400'
                  : isEvidence
                  ? 'text-teal-300'
                  : 'text-indigo-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                {headingText}
              </span>
            </div>
          );
        }

        // 2. Bullet point line (- or * or •)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const itemText = trimmed.replace(/^[-*•]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
              <span className="flex-1">{renderFormattedText(itemText)}</span>
            </div>
          );
        }

        // 3. Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // 4. Regular Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Helper: Formats bolding, bracketed citation tags, math equations, and status chips
function renderFormattedText(text: string): React.ReactNode[] {
  // Regex pattern matching:
  // - [Measured Flight Data] / [Theoretical Model] / [Published Research] / [AI Explanation]
  // - Citations: [DOC-...] / [FLEX-...] / [INC-...] / [ACME-...] / [CFI-...]
  // - Math/Latex: $...$
  // - Bold: **...**
  const tokenRegex = /(\[(?:Measured Flight Data|Theoretical Model|Published Research|AI Explanation)\]|\[(?:DOC|EXP|INC|FLEX|ACME|CFI|BASS|SoFIE)[^\]]*\]|\$[^$]+\$|\*\*[^*]+\*\*)/g;

  const parts = text.split(tokenRegex);
  return parts.map((part, i) => {
    if (!part) return null;

    // Callout chips
    if (part === '[Measured Flight Data]') {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono mx-1">
          ✓ Flight Telemetry
        </span>
      );
    }
    if (part === '[Published Research]') {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono mx-1">
          📄 NASA Literature
        </span>
      );
    }
    if (part === '[Theoretical Model]') {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono mx-1">
          📐 Theoretical Model
        </span>
      );
    }
    if (part === '[AI Explanation]') {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono mx-1">
          🤖 AI Synthesis
        </span>
      );
    }

    // Bracketed Citation Tag e.g. [DOC-FLEX-PECS]
    if (part.startsWith('[') && part.endsWith(']')) {
      const tagContent = part.slice(1, -1);
      return (
        <span key={i} className="px-1 py-0.2 rounded bg-space-800 text-cyan-400 border border-cyan-800/80 font-mono text-[10px] mx-0.5">
          {tagContent}
        </span>
      );
    }

    // Mathematical formula $...$
    if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1);
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-space-950 text-amber-300 font-mono text-[11px] border border-space-800 mx-0.5 tracking-wide">
          {formula}
        </span>
      );
    }

    // Bold text **...**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: (
        "### Direct Answer\n" +
        "Welcome to the FlameLens AI Scientific Research Copilot. I am directly grounded in official NASA microgravity combustion flight records (FLEX, ACME, CFI, BASS, SoFIE) and spacecraft mishap investigation archives.\n\n" +
        "### Operating Capabilities\n" +
        "- **Mode A (Scientific Research):** Explore isotropic diffusion, spherical flame kinetics, radiative soot shells, and low-temperature cool flame persistence.\n" +
        "- **Mode B (Spacecraft Fire Safety):** Audit elevated oxygen hazards, detector latency, suppression protocols, and historical incident lessons (Apollo 1, Mir).\n" +
        "- **Mode C (Data Analysis):** Evaluate empirical droplet D² Law regressions, burning rate constant K, R² fit quality, and microgravity vs 1-g comparisons.\n\n" +
        "Select a research mode above or enter your query to begin."
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'SCIENTIFIC_RESEARCH',
      status: 'complete'
    }
  ]);

  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState<AIMode>('SCIENTIFIC_RESEARCH');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => `SES-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [activeModel, setActiveModel] = useState<string>('Gemini 2.5 Flash / NASA Grounded');

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleClear = () => {
    handleStop();
    setMessages([]);
    api.getHealth().catch(() => {});
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (questionText?: string) => {
    const q = questionText || input.trim();
    if (!q || isStreaming) return;

    handleStop();

    const userMsgId = `usr-${Date.now()}`;
    const assistantMsgId = `ast-${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
      status: 'complete'
    };

    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
      status: 'streaming'
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setInput('');
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Build recent conversation turns for context
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
                    content: m.content ? m.content : `Synthesis encounter: ${err.message || 'Stream disconnected'}.`,
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
    <div className="h-[calc(100vh-7.5rem)] flex flex-col max-w-6xl mx-auto space-y-3">
      {/* ── Top Header & Mode Switcher ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-space-700 pb-3">
        <div className="flex items-center gap-3.5">
          <img
            src="/flamelens-logo.png"
            alt="FlameLens AI"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono tracking-wider font-semibold">
                NASA SCIENTIFIC RESEARCH COPILOT
              </span>
              <span className="text-xs font-mono text-slate-400">GROUNDED GEMINI RAG • FTS5 BM25</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              FlameLens AI Research Assistant
            </h1>
          </div>
        </div>

        {/* Action Controls & Model Telemetry */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-space-900 border border-space-700 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-300 font-semibold">{activeModel}</span>
          </div>

          <button
            onClick={handleClear}
            title="Clear Chat History"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-800 border border-space-700 text-slate-400 hover:text-rose-300 transition-colors"
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
                  : 'bg-space-900/60 border-space-700 text-slate-400 hover:bg-space-850 hover:text-slate-200'
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

      {/* ── Chat Messages Scroll Stream ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const cfg = MODE_CONFIGS[msg.mode || 'SCIENTIFIC_RESEARCH'];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-4xl rounded-xl p-4.5 space-y-3.5 border transition-all ${
                  isUser
                    ? 'bg-cyan-950/40 border-cyan-700/80 text-cyan-100 shadow-glow-cyan'
                    : 'bg-space-900/90 border-space-700/90 text-slate-200 shadow-xl'
                }`}
              >
                {/* Message Header Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-space-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {isUser ? (
                        <>👤 FLIGHT RESEARCHER</>
                      ) : (
                        <>
                          <img
                            src="/flamelens-logo.png"
                            alt="FlameLens Copilot"
                            className="w-4 h-4 object-contain inline-block drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                          />
                          <span>FLAMELENS SCIENTIFIC COPILOT</span>
                        </>
                      )}
                    </span>
                    {!isUser && msg.mode && (
                      <span className="px-1.5 py-0.2 rounded bg-space-800 text-cyan-400 border border-space-700 text-[9px]">
                        {cfg.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.content && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Content */}
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

                {/* Citation Cards (Under Assistant Messages) */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-space-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-cyan-400 flex items-center gap-1.5 uppercase">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>VERIFIED NASA FLIGHT CITATIONS & EVIDENCE USED ({msg.sources.length}):</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">PEER-REVIEWED ARCHIVES</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-space-950 border border-space-800 text-[11px] font-mono space-y-1 hover:border-space-700 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-cyan-300 truncate max-w-[220px]" title={src.title}>
                              {src.doc_id} • {src.title}
                            </span>
                            <span className="text-[10px] text-teal-400 flex-shrink-0">
                              Score: {src.relevance_score || '0.90'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            {src.institution || src.authors || 'NASA Flight Science'} ({src.year || 2024})
                          </p>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline pt-0.5"
                            >
                              <span>Official NASA Record</span>
                              <ExternalLink className="w-2.5 h-2.5" />
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

      {/* ── Suggested Questions Pill Row ──────────────────────────────────── */}
      {messages.length < 5 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 mr-1">
            <Info className="w-3 h-3" /> SUGGESTED RESEARCH QUERIES:
          </span>
          {SUGGESTED_QUESTIONS[activeMode].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isStreaming}
              className="px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-colors text-left disabled:opacity-50"
            >
              • {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Bar & Stop Control ──────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-xl bg-space-900 border border-space-700 shadow-xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeMode === 'SPACECRAFT_FIRE_SAFETY'
              ? 'Ask about oxygen flammability limits, Apollo 1 / Mir fire investigations, or suppression...'
              : activeMode === 'EXPERIMENTAL_DATA_ANALYSIS'
              ? 'Ask to explain the D² law, compare droplet burning rates, or interpret R² regression fit...'
              : 'Ask why flames are spherical, how cool flames survive, or compare soot radiation...'
          }
          disabled={isStreaming}
          className="flex-1 bg-space-950 border border-space-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={handleStop}
            className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 shadow-glow-rose transition-all flex-shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 shadow-glow-cyan transition-all flex-shrink-0"
          >
            <span>RESEARCH</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default AIChat;
