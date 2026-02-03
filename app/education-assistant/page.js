'use client';

import { useState, useRef, useEffect } from 'react';

const SAMPLE_QUESTIONS = [
  "What are the most common reasons for student leave this month?",
  "Show attendance summary for grade 10",
  "Which students are overdue on science project?",
  "Aaliya Rahman's marks in Maths Mid-Term 1",
  "Average percentage of class 9 students in Term 1",
  "List students who were absent on 2026-01-06 and why",
  "Who scored highest in Science this term?",
  "Attendance percentage of Muhammad Bilal",
];

export default function EducationAssistant() {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showWorkspace && messages.length === 0) {
      const timer = setTimeout(() => {
        addAssistantMessage('How can I help you with school data today?');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showWorkspace]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, timestamp: Date.now() },
    ]);
  };

  const addAssistantMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: text, timestamp: Date.now() },
    ]);
  };

  const sendQuestion = async (question) => {
    addUserMessage(question);
    setIsLoading(true);

    try {
      const res = await fetch('/api/education-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API failed ${res.status}: ${text}`);
      }

      const data = await res.json();

      // ────────────────────────────────────────────────
      // FIXED: handle n8n response shape { "output": "..." }
      // ────────────────────────────────────────────────
      let reply =
        data.output ||
        data.response ||
        data.answer ||
        data.text ||
        data.message ||
        data.result ||
        (data && typeof data === 'object'
          ? `Server response:\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
          : String(data) || 'No readable response received.');

      addAssistantMessage(reply.trim());
    } catch (err) {
      console.error('Client error:', err);
      addAssistantMessage('Sorry, there was a server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const question = inputValue.trim();
    setInputValue('');
    sendQuestion(question);
  };

  const handleSampleQuestion = (question) => {
    sendQuestion(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ───────── ENTRY SCREEN ─────────
  if (!showWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 flex items-center justify-center px-5">
        <div className="w-full max-w-3xl text-center space-y-20">
          <h1 className="text-6xl md:text-8xl font-light text-slate-900">
            School Data Intelligence
          </h1>

          <button
            onClick={() => setShowWorkspace(true)}
            className="px-20 py-8 text-2xl bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition"
          >
            Begin Analysis
          </button>

          <p className="text-xl text-slate-500">
            Precise. Authoritative. Trusted.
          </p>
        </div>
      </div>
    );
  }

  // ───────── MAIN WORKSPACE ─────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-stone-100">
      <main className="flex flex-col min-h-screen max-w-5xl mx-auto px-6 pt-16 pb-40">
        <div className="flex-1 space-y-12 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-xl text-slate-600 py-20">
              Ask anything about students, attendance, exams, or projects.
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[90%]'}
            >
              <div
                className={`p-6 rounded-2xl border prose prose-slate max-w-none ${
                  msg.role === 'user'
                    ? 'bg-white text-slate-900'
                    : 'bg-emerald-50 text-slate-800'
                }`}
              >
                {msg.content}
              </div>
              <time className="text-xs text-slate-400 pl-2">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 py-4">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing school records…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length < 3 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {SAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSampleQuestion(q)}
                className="p-6 bg-white rounded-2xl border hover:shadow transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-stone-50/95 px-6 pb-6 pt-10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about students, attendance, exams..."
              className="flex-1 px-6 py-5 rounded-xl border outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-5 rounded-xl bg-emerald-600 text-white disabled:bg-emerald-300 transition"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}