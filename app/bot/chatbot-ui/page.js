'use client';

import { useState, useRef, useEffect } from 'react';
import { menus } from '../../../data/menus';

export default function IntelligenceAssistant() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('main_menu');

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
    }
  }, [messages, isThinking, showChat]);

  // Initialize with main menu when chat opens
  useEffect(() => {
    if (showChat && messages.length === 0) {
      setTimeout(() => addAssistantMessage('main_menu'), 400);
    }
  }, [showChat]);

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      time: Date.now()
    }]);
  };

  const addAssistantMessage = (menuKey) => {
    const menu = menus[menuKey];
    if (!menu) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand. How else can I assist you?',
        time: Date.now(),
      }]);
      return;
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: menu.text,
      buttons: menu.buttons || [],
      menuKey,
      time: Date.now(),
    }]);
  };

  const handleStart = () => {
    setShowChat(true);
    setMessages([]);
    setCurrentMenu('main_menu');
  };

  // ──────────────────────────────────────────────
  //  MERGED & FIXED submit handler
  //  → free text → GPT
  //  → buttons → menu system
  // ──────────────────────────────────────────────
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const question = inputValue.trim();
    addUserMessage(question);
    setInputValue('');
    setIsThinking(true);

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      setIsThinking(false);

      if (data.answer) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.answer, time: Date.now() },
        ]);
      } else {
        // fallback to current menu if GPT returns nothing
        addAssistantMessage(currentMenu);
      }
    } catch (err) {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again.", time: Date.now() },
      ]);
    }
  };

  const handleButton = (btn) => {
    // Handle external URL
    if (btn.url) {
      window.open(btn.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Handle phone call
    if (btn.phone) {
      window.location.href = `tel:${btn.phone}`;
      addUserMessage(`Calling ${btn.text}`);
      return;
    }

    // Handle menu navigation
    addUserMessage(btn.text);
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setCurrentMenu(btn.callback_data);
      addAssistantMessage(btn.callback_data);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e);
    }
  };

  const formatText = (text) => {
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  ENTRY SCREEN (unchanged)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 relative overflow-hidden pt-16">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.1)_0%,_transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(5,150,105,0.08)_0%,_transparent_50%)]"></div>
        </div>

        {/* Delicate grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

        <div className="relative min-h-screen flex items-center justify-center px-5 sm:px-8">
          <div className="w-full max-w-2xl text-center space-y-16 sm:space-y-20 animate-fade-in-up">
            {/* Abstract AI presence */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-600/20 animate-spin-slow"></div>
                <div className="absolute inset-3 rounded-full border border-emerald-500/30 animate-spin-reverse"></div>
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur-sm">
                  <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-emerald-400/30 to-transparent"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_12px_rgba(5,150,105,0.5)]"></div>
              </div>
            </div>

            {/* Value statement */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 leading-[1.1] px-4">
              Authoritative intelligence for your questions
            </h1>

            {/* Primary action */}
            <div className="pt-4 sm:pt-8">
              <button
                onClick={handleStart}
                className="group relative px-14 sm:px-20 py-5 sm:py-6 text-lg sm:text-xl font-medium bg-emerald-600 text-white rounded-full transition-all duration-300 hover:bg-emerald-700 active:bg-emerald-800 shadow-[0_4px_24px_rgba(5,150,105,0.2)] hover:shadow-[0_8px_32px_rgba(5,150,105,0.3)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <span className="relative z-10">Begin</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-white/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>

            {/* Minimal footer info */}
            <p className="text-sm sm:text-base text-stone-500 font-light tracking-wide pt-8 sm:pt-12">
              Precise • Authoritative • Trusted
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  AI WORKSPACE (unchanged except fixed submit handler)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-stone-100 relative animate-fade-in">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.12)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(5,150,105,0.1)_0%,_transparent_50%)]"></div>
      </div>

      {/* Delicate grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

      <main className="relative flex-1 w-full max-w-[1100px] mx-auto flex flex-col px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="flex-1 overflow-y-auto py-12 sm:py-16 md:py-20 pb-40 sm:pb-48">
          <div className="space-y-10 sm:space-y-12 pb-20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`space-y-3 animate-fade-in-up ${msg.role === 'user'
                  ? 'ml-auto max-w-[85%] sm:max-w-[78%] md:max-w-[72%]'
                  : 'mr-auto max-w-[92%] sm:max-w-[85%] md:max-w-[80%]'
                  }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Message bubble */}
                <div
                  className={`prose prose-emerald max-w-none text-base sm:text-[15.5px] leading-relaxed font-light tracking-wide ${msg.role === 'user'
                    ? 'bg-white/70 backdrop-blur-sm border border-emerald-600/15 rounded-2xl px-6 sm:px-7 py-5 shadow-[0_4px_16px_rgba(5,150,105,0.06)]'
                    : 'text-stone-800'
                    }`}
                >
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Assistant buttons */}
                {msg.role === 'assistant' && msg.buttons?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {msg.buttons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleButton(btn)}
                        className="group w-full text-left px-6 sm:px-7 py-4 sm:py-5 bg-white/70 backdrop-blur-sm border border-emerald-600/12 rounded-2xl hover:bg-white/85 hover:border-emerald-600/25 hover:shadow-[0_4px_20px_rgba(5,150,105,0.1)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between"
                      >
                        <span className="text-base font-medium text-stone-800 group-hover:text-stone-900 transition-colors">
                          {btn.text}
                        </span>

                        {(btn.phone || btn.url) && (
                          <svg
                            className="w-5 h-5 text-emerald-600/50 group-hover:text-emerald-600/80 transition-colors flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={btn.phone
                                ? "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                : "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              }
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <time className="block text-xs text-stone-400 font-light pl-2">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-3 px-7 py-5 rounded-2xl backdrop-blur-sm border border-emerald-600/10 bg-emerald-50/40 shadow-[0_4px_16px_rgba(5,150,105,0.04)]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-emerald-600/50 rounded-full animate-bounce-gentle" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-600/50 rounded-full animate-bounce-gentle" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-600/50 rounded-full animate-bounce-gentle" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-stone-600 font-light">Processing</span>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </div>

        {/* Fixed input area */}
        <div className="fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4 md:px-8 md:pb-6 md:left-1/2 md:-translate-x-1/2 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent pt-10 pb-8 px-5 sm:px-8 lg:px-12">
          <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-xl border border-emerald-600/15 rounded-full overflow-hidden shadow-[0_4px_24px_rgba(5,150,105,0.08)] focus-within:border-emerald-600/30 focus-within:bg-white/85 focus-within:shadow-[0_8px_32px_rgba(5,150,105,0.12)] transition-all duration-300 flex items-center">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg text-stone-900 placeholder-stone-400 outline-none font-light tracking-wide"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputValue.trim()}
                  className={`p-4 mx-2 rounded-full transition-all duration-300 ${inputValue.trim() && !isThinking
                    ? 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/80'
                    : 'text-emerald-300 cursor-not-allowed'
                    }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {/* Minimal footer */}
          <p className="text-center text-xs sm:text-sm text-stone-400 font-light tracking-wide mt-6">
            Precise answers from authoritative intelligence
          </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0);
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 1.2s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(245, 245, 244, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(5, 150, 105, 0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(5, 150, 105, 0.3);
        }

        /* Prose styling for assistant messages */
        .prose strong {
          color: rgb(28, 25, 23);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}