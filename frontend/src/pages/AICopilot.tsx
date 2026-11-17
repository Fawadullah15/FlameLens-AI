import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowUp,
  Square,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Flame,
  BarChart2,
  Paperclip,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage, CitationRef, AIMode, StreamMetadata } from '../types';

const MODES: { id: AIMode; label: string; icon: any; placeholder: string }[] = [
  {
    id: 'SCIENTIFIC_RESEARCH',
    label: 'Combustion Theory',
    icon: Sparkles,
    placeholder: 'Ask about microgravity kinetics, spherical symmetry, cool flames...'
  },
  {
    id: 'SPACECRAFT_FIRE_SAFETY',
    label: 'Fire Safety',
    icon: Flame,
    placeholder: 'Ask about spacecraft oxygen limits, Apollo/Mir lessons, suppression...'
  },
  {
    id: 'EXPERIMENTAL_DATA_ANALYSIS',
    label: 'Data Analysis',
    icon: BarChart2,
    placeholder: 'Ask about d²-law burning rates, K values, R² fits, comparison...'
  }
];

const STARTER_PROMPTS: Record<AIMode, string[]> = {
  SCIENTIFIC_RESEARCH: [
    "Why does flame shape become spherical in microgravity?",
    "Explain the d²-law droplet kinetics using NASA flight experiments.",
    "What is the cool flame phenomenon discovered in the FLEX experiment?",
    "How does soot formation differ between 1g and microgravity?"
  ],
  SPACECRAFT_FIRE_SAFETY: [
    "What key combustion lessons came from the Apollo 1 and Mir incidents?",
    "How does elevated oxygen concentration (e.g. 32%) influence flammability?",
    "What are the microgravity fire extinction challenges for lunar habitats?",
    "Explain how smoke detector latency differs without buoyant convection."
  ],
  EXPERIMENTAL_DATA_ANALYSIS: [
    "Compare n-heptane burning rate K in microgravity vs terrestrial 1g.",
    "What are the extinction diameters for decane droplets in 21% oxygen?",
    "How does ambient pressure affect the flame standoff ratio?",
    "Summarize burning rate differences across alkane and alcohol fuels."
  ]
};

// Clean Markdown Formatter for Scientific Content
const FormattedMessage: React.FC<{ content: string; onCitationClick?: (cite: string) => void }> = ({
  content
}) => {
  if (!content) return null;

  const blocks = content.split('\n\n');

  return (
    <div className="space-y-3.5 text-[15px] leading-[1.65] text-[#E2E8F0]">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Markdown Table
        if (trimmed.startsWith('|') && trimmed.includes('---')) {
          const lines = trimmed.split('\n');
          const headerCells = lines[0].split('|').map(c => c.trim()).filter(Boolean);
          const bodyLines = lines.slice(2);

          return (
            <div key={idx} className="my-3 overflow-x-auto border border-[rgba(120,165,255,0.22)] rounded-xl bg-[#07111F]/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#101B30] border-b border-[rgba(120,165,255,0.2)]">
                  <tr>
                    {headerCells.map((h, i) => (
                      <th key={i} className="py-2.5 px-3 font-semibold text-white">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(120,165,255,0.1)]">
                  {bodyLines.map((row, rIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                    if (!cells.length) return null;
                    return (
                      <tr key={rIdx} className="hover:bg-[#101B30]/60">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3 text-[#CBD5E1]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // 2. Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-[16px] font-semibold text-white pt-2">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-[17px] font-semibold text-white pt-3">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // 3. Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(Boolean);
          return (
            <ul key={idx} className="space-y-1.5 pl-4 list-disc marker:text-[#2F82FF]">
              {items.map((item, i) => (
                <li key={i} className="text-[#CBD5E1]">
                  <span dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*]\s+/, '')) }} />
                </li>
              ))}
            </ul>
          );
        }

        // 4. Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(Boolean);
          return (
            <ol key={idx} className="space-y-1.5 pl-4 list-decimal marker:text-[#2F82FF]">
              {items.map((item, i) => (
                <li key={i} className="text-[#CBD5E1]">
                  <span dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s+/, '')) }} />
                </li>
              ))}
            </ol>
          );
        }

        // 5. Code block
        if (trimmed.startsWith('```')) {
          const code = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
          return (
            <pre key={idx} className="p-3 bg-[#07111F] border border-[rgba(120,165,255,0.25)] rounded-xl font-mono text-xs overflow-x-auto text-[#38BDF8]">
              <code>{code}</code>
            </pre>
          );
        }

        // 6. Regular Paragraph
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }} />
        );
      })}
    </div>
  );
};

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-[#E2E8F0]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#1769FF]/20 text-[#69B7FF] border border-[rgba(120,165,255,0.2)] font-mono text-[12px]">$1</code>')
    .replace(/\[(\d+)\]/g, '<span class="inline-flex items-center px-1.5 py-0.2 mx-0.5 text-[11px] font-mono font-medium rounded bg-[#1769FF]/20 text-[#69B7FF] border border-[#2F82FF]/30">[$1]</span>')
    .replace(/d\^2/g, 'd²')
    .replace(/d0\^2/g, 'd₀²');
}

export const AICopilot: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState<AIMode>('SCIENTIFIC_RESEARCH');
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedSid = localStorage.getItem('flamelens_active_session_id');
      if (savedSid) return savedSid;
    }
    return `SES-${Date.now().toString(36).toUpperCase()}`;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const savedSid = localStorage.getItem('flamelens_active_session_id');
      if (savedSid) {
        const savedMsgs = localStorage.getItem(`flamelens_chat_${savedSid}`);
        if (savedMsgs) {
          try {
            return JSON.parse(savedMsgs);
          } catch {
            return [];
          }
        }
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSourcesId, setExpandedSourcesId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasAutoFired = useRef(false);

  // Sync to local storage for persistence across tab switches / reloads
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionId) {
      localStorage.setItem('flamelens_active_session_id', sessionId);
      const completedMessages = messages.filter(m => m.status !== 'streaming' || m.content.length > 0);
      if (completedMessages.length > 0) {
        localStorage.setItem(`flamelens_chat_${sessionId}`, JSON.stringify(completedMessages));
      }
    }
  }, [messages, sessionId]);

  // Initialize or handle query params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const newSession = searchParams.get('new');

    if (newSession === 'true') {
      const freshId = `SES-${Date.now().toString(36).toUpperCase()}`;
      setMessages([]);
      setSessionId(freshId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('flamelens_active_session_id', freshId);
      }
      setSearchParams({}, { replace: true });
      return;
    }

    if (queryParam && !hasAutoFired.current) {
      hasAutoFired.current = true;
      handleSendMessage(queryParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
                    content: m.content ? m.content : `Scientific retrieval error: ${err.message || 'Stream interrupted'}.`,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#02050C] text-white relative">
      {/* ── TOP MODE SELECTION BAR ────────────────────────────────────── */}
      <div className="border-b border-[rgba(120,165,255,0.18)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 bg-[#07111F]/90 backdrop-blur-md z-10 shrink-0 min-w-0">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1769FF] text-white shadow-[0_0_10px_rgba(47,130,255,0.6)] font-semibold'
                    : 'text-[#AAB6CA] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#AAB6CA] shrink-0">
          <span className="hidden sm:inline font-mono text-[11px] text-[#38BDF8]">NASA RAG Grounding Active</span>
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (isStreaming) handleStopStream();
                const newSid = `SES-${Date.now().toString(36).toUpperCase()}`;
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(`flamelens_chat_${sessionId}`);
                  localStorage.setItem('flamelens_active_session_id', newSid);
                }
                setMessages([]);
                setSessionId(newSid);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#AAB6CA] hover:text-white transition-colors flex items-center space-x-1"
              title="Reset conversation and start fresh session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">New Session</span>
            </button>
          )}
        </div>
      </div>

      {/* ── CONVERSATION THREAD AREA ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-[768px] mx-auto w-full">
          {messages.length === 0 ? (
            /* Empty State: NASA Aerospace Welcome */
            <div className="py-12 sm:py-20 text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 max-w-lg mx-auto flex flex-col items-center">
                <div className="relative">
                  <img
                    src="/flamelens-logo.png"
                    alt="FlameLens Emblem"
                    className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(47,130,255,0.7)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  FlameLens AI Scientific Copilot
                </h2>
                <p className="text-xs sm:text-[14px] text-[#AAB6CA] leading-relaxed">
                  Ask about NASA microgravity combustion kinetics, droplet extinction limits, spherical flame geometry, or spacecraft fire safety.
                </p>
              </div>

              {/* Starter Question Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left pt-2">
                {STARTER_PROMPTS[activeMode].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3.5 bg-[#07111F] border border-[rgba(120,165,255,0.2)] hover:border-[#2F82FF] hover:bg-[#101B30] rounded-xl text-xs sm:text-[13px] text-[#CBD5E1] hover:text-white transition-all leading-snug flex flex-col justify-between shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  >
                    <span>{prompt}</span>
                    <span className="text-[10px] text-[#69B7FF] font-mono mt-2 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#2F82FF]" />
                      <span>NASA PSI Telemetry</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Message History */
            <div className="space-y-6 pb-28">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className="space-y-2">
                    {isUser ? (
                      /* User message: dark blue translucent bubble aligned right */
                      <div className="flex justify-end">
                        <div className="max-w-[85%] sm:max-w-[80%] bg-[#101B30] border border-[rgba(120,165,255,0.25)] text-white rounded-2xl px-4 py-2.5 text-[13px] sm:text-[14px] leading-relaxed break-words shadow-[0_0_15px_rgba(35,112,255,0.2)]">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      /* Assistant message: glowing emblem and clean typography */
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src="/logo.png"
                            alt="FlameLens Emblem"
                            className="w-5 h-5 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(47,130,255,0.6)]"
                          />
                          <span className="text-xs font-semibold text-white">FlameLens Scientific Copilot</span>
                          <span className="text-[11px] font-mono text-[#78869C]">{msg.timestamp}</span>
                        </div>

                        <div className="pl-6 sm:pl-7">
                          {msg.content ? (
                            <FormattedMessage content={msg.content} />
                          ) : (
                            <div className="flex items-center space-x-2 py-2 text-xs text-[#69B7FF]">
                              <Loader2 className="w-4 h-4 animate-spin text-[#2F82FF]" />
                              <span>Synthesizing NASA flight telemetry & citations...</span>
                            </div>
                          )}

                          {/* Action Bar (Copy, Sources, Citations) */}
                          {msg.status !== 'streaming' && msg.content && (
                            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-[#78869C]">
                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="inline-flex items-center space-x-1 hover:text-white transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              {msg.sources && msg.sources.length > 0 && (
                                <button
                                  onClick={() =>
                                    setExpandedSourcesId(expandedSourcesId === msg.id ? null : msg.id)
                                  }
                                  className="inline-flex items-center space-x-1 text-[#69B7FF] hover:text-white"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>{msg.sources.length} NASA Sources</span>
                                  <ChevronDown
                                    className={`w-3 h-3 transition-transform ${
                                      expandedSourcesId === msg.id ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Expanded Sources Panel */}
                          {expandedSourcesId === msg.id && msg.sources && (
                            <div className="mt-3 p-3.5 bg-[#07111F] border border-[rgba(120,165,255,0.22)] rounded-xl space-y-2">
                              <div className="text-[11px] font-semibold text-[#69B7FF] uppercase tracking-wide">
                                Verified References Grounding This Answer
                              </div>
                              <div className="space-y-1.5">
                                {msg.sources.map((src, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 bg-[#101B30]/70 border border-[rgba(120,165,255,0.15)] rounded-lg text-xs flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="font-mono text-[10px] font-semibold text-[#38BDF8] mr-2">
                                        [{idx + 1}] {src.source_id}
                                      </span>
                                      <span className="font-medium text-white">{src.title}</span>
                                    </div>
                                    {src.url && (
                                      <a
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#69B7FF] hover:text-white shrink-0 ml-2"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY CENTERED INPUT COMPOSER ─────────────────────────────── */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#02050C] via-[#02050C]/95 to-transparent pt-3 pb-4 sm:pb-5 px-4 sm:px-6 z-20">
        <div className="max-w-[768px] mx-auto w-full">
          <div className="relative flex items-end bg-[rgba(18,35,65,0.75)] backdrop-blur-xl border border-[rgba(120,165,255,0.25)] rounded-2xl shadow-[0_0_25px_rgba(35,112,255,0.25)] focus-within:border-[#2F82FF] focus-within:shadow-[0_0_35px_rgba(47,130,255,0.45)] transition-all p-1.5 sm:p-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={MODES.find(m => m.id === activeMode)?.placeholder || 'Ask a research question...'}
              className="flex-1 bg-transparent border-none text-[13px] sm:text-[14px] text-white placeholder:text-[#78869C] focus:outline-none resize-none px-2.5 sm:px-3 py-1.5 max-h-44 leading-relaxed min-w-0"
            />

            <div className="flex items-center space-x-1 shrink-0 pb-0.5">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopStream}
                  className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                  aria-label="Stop generation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim()}
                  className="p-2 rounded-full bg-[#1769FF] hover:bg-[#2F82FF] text-white disabled:opacity-20 disabled:hover:bg-[#1769FF] transition-all shadow-[0_0_12px_rgba(47,130,255,0.6)]"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] sm:text-[12px] text-[#78869C]">
              FlameLens AI responses are grounded directly in NASA Technical Reports and Physical Sciences Informatics.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
