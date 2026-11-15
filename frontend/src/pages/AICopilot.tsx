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
  Paperclip
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
    <div className="space-y-3.5 text-[15px] leading-[1.65] text-[#1A1A1A]">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Markdown Table
        if (trimmed.startsWith('|') && trimmed.includes('---')) {
          const lines = trimmed.split('\n');
          const headerCells = lines[0].split('|').map(c => c.trim()).filter(Boolean);
          const bodyLines = lines.slice(2);

          return (
            <div key={idx} className="my-3 overflow-x-auto border border-[#E5E5E5] rounded-[8px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F7F7F8] border-b border-[#E5E5E5]">
                  <tr>
                    {headerCells.map((h, i) => (
                      <th key={i} className="py-2.5 px-3 font-semibold text-[#0D0D0D]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {bodyLines.map((row, rIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                    if (!cells.length) return null;
                    return (
                      <tr key={rIdx} className="hover:bg-[#F9F9FA]">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3 text-[#333333]">
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
            <h3 key={idx} className="text-[16px] font-semibold text-[#0D0D0D] pt-2">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-[17px] font-semibold text-[#0D0D0D] pt-3">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // 3. Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(Boolean);
          return (
            <ul key={idx} className="space-y-1.5 pl-4 list-disc marker:text-[#8F8F8F]">
              {items.map((item, i) => (
                <li key={i} className="text-[#2D2D2D]">
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
            <ol key={idx} className="space-y-1.5 pl-4 list-decimal marker:text-[#8F8F8F]">
              {items.map((item, i) => (
                <li key={i} className="text-[#2D2D2D]">
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
            <pre key={idx} className="p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] font-mono text-xs overflow-x-auto text-[#0D0D0D]">
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
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#0D0D0D]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-[#333333]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#F4F4F4] text-[#0D0D0D] font-mono text-[12px]">$1</code>')
    .replace(/\[(\d+)\]/g, '<span class="inline-flex items-center px-1.5 py-0.2 mx-0.5 text-[11px] font-mono font-medium rounded bg-[#F8F1EC] text-[#B86B39] border border-[#EBDAD0]">[$1]</span>')
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
      // Only persist when not mid-stream with empty assistant turn
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
    <div className="flex flex-col h-full bg-white relative">
      {/* ── TOP MODE SELECTION BAR ────────────────────────────────────── */}
      <div className="border-b border-[#EBEBEB] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 bg-white z-10 shrink-0 min-w-0">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-[8px] text-[12px] sm:text-[13px] font-medium transition-colors shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#EAEAEA] text-[#0D0D0D]'
                    : 'text-[#666666] hover:text-[#0D0D0D] hover:bg-[#F4F4F4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#8F8F8F] shrink-0">
          <span className="hidden sm:inline font-mono text-[11px]">NASA RAG Grounding</span>
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
              className="p-1.5 rounded-[6px] hover:bg-[#F0F0F0] text-[#6E6E6E] hover:text-[#0D0D0D] transition-colors flex items-center space-x-1"
              title="Reset conversation and start fresh session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">New Session</span>
            </button>
          )}
        </div>
      </div>

      {/* ── CONVERSATION THREAD AREA ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-6">
        <div className="max-w-[768px] mx-auto w-full">
          {messages.length === 0 ? (
            /* Empty State: ChatGPT Style Welcome */
            <div className="py-16 sm:py-24 text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 max-w-lg mx-auto flex flex-col items-center">
                <img
                  src="/logo.png"
                  alt="FlameLens Q Insignia"
                  className="w-12 h-12 object-contain"
                />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0D0D0D] tracking-tight">
                  What would you like to investigate?
                </h2>
                <p className="text-xs sm:text-[14px] text-[#6E6E6E] leading-relaxed">
                  Ask about NASA microgravity combustion kinetics, droplet extinction limits, spherical flame geometry, or spacecraft fire safety.
                </p>
              </div>

              {/* Starter Question Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left pt-2">
                {STARTER_PROMPTS[activeMode].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-3 sm:p-3.5 bg-white border border-[#E5E5E5] hover:border-[#CCCCCC] hover:bg-[#F9F9FA] rounded-[10px] text-xs sm:text-[13px] text-[#333333] transition-colors leading-snug flex flex-col justify-between shadow-2xs"
                  >
                    <span>{prompt}</span>
                    <span className="text-[10px] sm:text-[11px] text-[#8F8F8F] font-mono mt-2">NASA PSI Data</span>
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
                      /* User message: clean light grey bubble aligned right */
                      <div className="flex justify-end">
                        <div className="max-w-[85%] sm:max-w-[80%] bg-[#F4F4F4] text-[#0D0D0D] rounded-[18px] sm:rounded-[20px] px-3.5 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-[14px] leading-relaxed break-words">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      /* Assistant message: clean typography directly on white */
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src="/logo.png"
                            alt="FlameLens Q Emblem"
                            className="w-5 h-5 object-contain shrink-0"
                          />
                          <span className="text-xs font-semibold text-[#0D0D0D]">FlameLens Intelligence</span>
                          <span className="text-[11px] font-mono text-[#8F8F8F]">{msg.timestamp}</span>
                        </div>

                        <div className="pl-6 sm:pl-7">
                          {msg.content ? (
                            <FormattedMessage content={msg.content} />
                          ) : (
                            <div className="flex items-center space-x-1.5 py-2 text-xs text-[#8F8F8F]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B39] animate-pulse" />
                              <span>Searching NASA technical archives & synthesizing...</span>
                            </div>
                          )}

                          {/* Action Bar (Copy, Sources, Citations) */}
                          {msg.status !== 'streaming' && msg.content && (
                            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-[#8F8F8F]">
                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="inline-flex items-center space-x-1 hover:text-[#0D0D0D] transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
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
                                  className="inline-flex items-center space-x-1 text-[#B86B39] hover:underline"
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
                            <div className="mt-3 p-3 bg-[#F7F7F8] border border-[#E5E5E5] rounded-[8px] space-y-2">
                              <div className="text-[11px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                                Verified References Grounding This Answer
                              </div>
                              <div className="space-y-1.5">
                                {msg.sources.map((src, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2 bg-white border border-[#E5E5E5] rounded-[6px] text-xs flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="font-mono text-[10px] font-semibold text-[#B86B39] mr-2">
                                        [{idx + 1}] {src.source_id}
                                      </span>
                                      <span className="font-medium text-[#0D0D0D]">{src.title}</span>
                                    </div>
                                    {src.url && (
                                      <a
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#6E6E6E] hover:text-[#0D0D0D] shrink-0 ml-2"
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
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-3 sm:pb-4 px-3 sm:px-4 z-20">
        <div className="max-w-[768px] mx-auto w-full">
          <div className="relative flex items-end bg-white border border-[#E5E5E5] rounded-[22px] sm:rounded-[24px] shadow-sm focus-within:border-[#0D0D0D] focus-within:ring-1 focus-within:ring-[#0D0D0D] transition-all p-1.5 sm:p-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={MODES.find(m => m.id === activeMode)?.placeholder || 'Ask a research question...'}
              className="flex-1 bg-transparent border-none text-[13px] sm:text-[14px] text-[#0D0D0D] placeholder:text-[#8F8F8F] focus:outline-none resize-none px-2 sm:px-3 py-1.5 max-h-44 leading-relaxed min-w-0"
            />

            <div className="flex items-center space-x-1 shrink-0 pb-0.5">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopStream}
                  className="p-2 rounded-full bg-[#0D0D0D] text-white hover:bg-[#333333] transition-colors"
                  aria-label="Stop generation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim()}
                  className="p-2 rounded-full bg-[#0D0D0D] text-white hover:bg-[#333333] disabled:opacity-20 disabled:hover:bg-[#0D0D0D] transition-colors"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="text-center pt-1.5 sm:pt-2">
            <span className="text-[11px] sm:text-[12px] text-[#8F8F8F]">
              FlameLens AI responses are derived from NASA Technical Reports and Physical Sciences Informatics.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
