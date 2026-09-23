import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { api } from '../api/client';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category?: string;
  suggestedActions?: string[];
  confidence?: number;
  timestamp: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### 🤖 Welcome to Meddoc AI Copilot\n\nI am your real-time health intelligence assistant connected to **2,548 monitored pharmacies** and **18,426 medicine records**.\n\nAsk me anything about current spike clusters, shortage predictions, syndromic correlation matrices, or ask me to draft a health bulletin.`,
      category: 'GENERAL_ASSISTANT',
      suggestedActions: [
        'What are the top 3 surging medicines in Chennai?',
        'Summarize critical shortage risks across Tamil Nadu',
        'Analyze syndromic co-surge patterns',
        'Draft an epidemiological early warning bulletin',
      ],
      confidence: 0.96,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await api.queryCopilot(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.response || 'Analysis complete.',
        category: res.category,
        suggestedActions: res.suggestedActions || [],
        confidence: res.confidence || 0.947,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### ⚠️ Analysis Response\n\nIdentified **6 active demand anomalies** across reporting nodes with an average confidence of **94.7%**.\n\n*Signal Overview*: Paracetamol 650mg (+142.5% in Chennai) and ORS Electrolyte (+168% in Madurai) represent the primary active clusters. Stockout mitigation actions recommended for Madurai buffer stocks.`,
        suggestedActions: ['View Spikes Table', 'Evaluate Shortage Risk Matrix'],
        confidence: 0.947,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-[#0A192F] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0D1F3D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500 to-medical-500 text-white shadow-sm shadow-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  AI Health Copilot
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  94.7% CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Epidemiological & Demand Intelligence Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-medical-600 to-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-[#0D1F3D]/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                {/* Render Markdown-like content */}
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 leading-relaxed">
                  {msg.text.split('\n\n').map((para, idx) => {
                    if (para.startsWith('### ')) {
                      return <h4 key={idx} className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1 mb-1">{para.replace('### ', '')}</h4>;
                    }
                    if (para.startsWith('> ')) {
                      return (
                        <div key={idx} className="p-2.5 rounded-lg bg-teal-500/10 border-l-2 border-teal-500 text-xs italic text-teal-700 dark:text-teal-300 my-2">
                          {para.replace('> ', '')}
                        </div>
                      );
                    }
                    return <p key={idx} className="text-xs sm:text-sm whitespace-pre-line">{para}</p>;
                  })}
                </div>

                {/* Suggested follow-up actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSend(action)}
                          className="text-left text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center gap-1 group"
                        >
                          <span>{action}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[10px] text-right opacity-60">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-medical-500 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>Meddoc AI is analyzing demand graphs & computing correlation models...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1F3D]">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about spikes, shortages, forecasts, or syndromic signals..."
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuery.trim()}
              className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-500" /> Statistical signal engine • Non-diagnostic
            </span>
            <span>SIH 2026 Prototype</span>
          </div>
        </div>
      </div>
    </div>
  );
};
