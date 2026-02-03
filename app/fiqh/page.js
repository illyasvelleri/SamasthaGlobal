// "use client";

// import { useState, useRef, useEffect } from "react";

// export default function FiqhChatPage() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) return;

//     // Add user message
//     const userMessage = { role: "user", content: question.trim() };
//     setMessages((prev) => [...prev, userMessage]);
//     setQuestion("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/bot/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: userMessage.content }),
//       });

//       if (!res.ok) throw new Error("Failed to get response");

//       const data = await res.json();

//       // Add AI message
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: data.answer || "No answer received." },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
//           <h1 className="text-xl font-semibold">Fiqh Assistant</h1>
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             Ask about Wudu, Salah, Zakat, etc.
//           </div>
//         </div>
//       </header>

//       {/* Messages Area */}
//       <main className="flex-1 overflow-y-auto px-4 py-6">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {messages.length === 0 ? (
//             <div className="text-center py-20 text-gray-500 dark:text-gray-400">
//               <div className="text-5xl mb-4">🕌</div>
//               <h2 className="text-xl font-medium mb-2">Ask any Fiqh question</h2>
//               <p className="max-w-md mx-auto">
//                 Examples: "What are the fard of wudu?", "Ruling on praying in congregation", "Is nail polish allowed during wudu?"
//               </p>
//             </div>
//           ) : (
//             messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${
//                   msg.role === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
//                     msg.role === "user"
//                       ? "bg-blue-600 text-white rounded-br-none"
//                       : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
//                     {msg.content}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}

//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 shadow-sm rounded-bl-none">
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
//                   <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
//                   <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </main>

//       {/* Input Area - fixed at bottom */}
//       <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 backdrop-blur-sm">
//         <form
//           onSubmit={handleSubmit}
//           className="max-w-4xl mx-auto px-4 py-4"
//         >
//           <div className="relative">
//             <textarea
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask about any fiqh matter..."
//               rows={1}
//               className="w-full px-5 py-4 pr-14 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base leading-relaxed shadow-sm"
//               disabled={isLoading}
//             />
//             <button
//               type="submit"
//               disabled={isLoading || !question.trim()}
//               className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                 />
//               </svg>
//             </button>
//           </div>
//           <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
//             Press Enter to send • Shift + Enter for new line
//           </p>
//         </form>
//       </footer>
//     </div>
//   );
// }



"use client";

import { useState, useRef, useEffect } from "react";

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const sampleQuestions = [
    {
      question: "ما شروط الصلاة؟",
      icon: "🕰️"
    },
    {
      question: "ما مبطلات الصلاة عند الشافعية؟",
      icon: "❌"
    },
    {
      question: "നമസ്‌കാരത്തിലെ ഫർളുകൾ എത്രയും എന്തൊക്കെയാണ്?",
      icon: "📖"
    },
    {
      question: "What are the integrals (arkan) of prayer in the Shafi‘i madhhab?",
      icon: "🕌"
    }
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/bot/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSampleQuestion = (question) => {
    setInputValue(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasContent = messages.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-[140px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/3 rounded-full blur-[100px] animate-pulse-gentle"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <main className="relative flex-1 w-full max-w-[1200px] mx-auto flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="flex-1 overflow-y-auto py-8 sm:py-12 md:py-16 lg:py-20">
          {!hasContent ? (
            <div className="flex flex-col items-center justify-center min-h-[75vh] text-center">
              {/* AI Core Visual */}
              <div className="relative mb-12 sm:mb-16 md:mb-20">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                  {/* Outer rings */}
                  <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-spin-slow"></div>
                  <div className="absolute inset-3 rounded-full border border-cyan-400/15 animate-spin-reverse"></div>
                  <div className="absolute inset-6 rounded-full border border-indigo-400/20 animate-spin-slower"></div>

                  {/* Core sphere */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-indigo-500/20 backdrop-blur-xl shadow-[0_0_60px_rgba(59,130,246,0.15)] animate-pulse-gentle">
                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                  </div>

                  {/* Inner glow */}
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/20 blur-md"></div>

                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                </div>
              </div>
              {/* Beta Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-cyan-400/90">
                  Now Optimized: باب الصلاة (Kitab as-Salah)
                </span>
              </div>
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 sm:mb-8 leading-[1.1] px-4">
                <span className="bg-gradient-to-r from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent">
                  Ask Your Fiqh
                </span>
                <br />
                <span className="text-white/60">Questions</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-white/40 mb-12 sm:mb-16 md:mb-20 max-w-md font-light tracking-wide px-4">
                Ask fiqh. Get authoritative answers.
              </p>

              {/* Sample Question Cards */}
              <div className="w-full max-w-2xl px-4 mb-8 sm:mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {sampleQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSampleQuestion(item.question)}
                      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-5 sm:p-6 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>

                      <div className="relative flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/10 flex items-center justify-center text-xl sm:text-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                          {item.icon}
                        </div>
                        <p className="flex-1 text-white/70 text-sm sm:text-[15px] leading-relaxed font-light group-hover:text-white/90 transition-colors pt-1">
                          {item.question}
                        </p>
                      </div>

                      {/* Subtle arrow indicator */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-40 transition-opacity">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 md:space-y-10 pb-8">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] px-5 sm:px-6 md:px-7 py-4 sm:py-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${msg.role === "user"
                      ? "bg-white/[0.06] border-white/[0.12] text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                      : "bg-blue-500/[0.04] border-blue-500/[0.15] text-white/90 shadow-[0_8px_32px_rgba(59,130,246,0.08)]"
                      }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed text-[15px] sm:text-base font-light tracking-wide">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="px-6 py-5 rounded-2xl backdrop-blur-xl border border-blue-500/[0.15] bg-blue-500/[0.04] shadow-[0_8px_32px_rgba(59,130,246,0.08)]">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce-gentle" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce-gentle" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce-gentle" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4 md:px-8 md:pb-6 md:left-1/2 md:-translate-x-1/2 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent"
        >
          <div className="relative max-w-3xl mx-auto">
            {/* Glow effect on focus */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/10 to-blue-500/0 rounded-full blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none focus-within:opacity-100"></div>

            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1] rounded-full text-base sm:text-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.06] resize-none transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] font-light tracking-wide"
                style={{
                  minHeight: '60px',
                  maxHeight: '180px',
                  lineHeight: '1.5'
                }}
                disabled={isThinking}
              />

              <button
                type="submit"
                disabled={isThinking || !inputValue.trim()}
                className="absolute right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 backdrop-blur-xl rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 hover:border-white/20 shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 group"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </main>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.08); }
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 35s linear infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 1.4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}





// "use client";

// import { useState, useRef, useEffect } from "react";

// export default function FiqhAssistant() {
//   const [inputValue, setInputValue] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);

//   const scrollRef = useRef(null);

//   const scrollToBottom = () => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isThinking]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     const userMessage = { role: "user", content: inputValue.trim() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsThinking(true);

//     try {
//       const res = await fetch("/api/bot/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: userMessage.content }),
//       });

//       if (!res.ok) throw new Error("Request failed");

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: data.answer || "No response received." },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "An error occurred. Please try again." },
//       ]);
//     } finally {
//       setIsThinking(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const hasContent = messages.length > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center">
//       <main className="flex-1 w-full max-w-5xl flex flex-col px-5 sm:px-8 md:px-12 lg:px-16">
//         <div className="flex-1 overflow-y-auto py-12 md:py-20 lg:py-24">
//           {!hasContent ? (
//             <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 md:space-y-12">
//               {/* Subtle abstract AI indicator */}
//               <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-indigo-500/8 dark:from-blue-500/12 dark:to-indigo-500/12 rounded-full blur-2xl animate-pulse-slow"></div>
//                 <div className="absolute inset-2 bg-white/40 dark:bg-neutral-800/40 rounded-full shadow-inner"></div>
//               </div>

//               <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
//                 How can I help you today?
//               </h1>

//               <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
//                 Ask anything. Receive clear, reasoned answers grounded in knowledge.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-8 md:space-y-10">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[82%] sm:max-w-[75%] md:max-w-[68%] lg:max-w-[62%] px-5 sm:px-6 md:px-7 py-4 sm:py-5 rounded-2xl backdrop-blur-sm border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm ${
//                       msg.role === "user"
//                         ? "bg-white/70 dark:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100"
//                         : "bg-neutral-50/70 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-200"
//                     }`}
//                   >
//                     <div className="whitespace-pre-wrap leading-relaxed text-[15px] sm:text-base md:text-[17px]">
//                       {msg.content}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {isThinking && (
//                 <div className="flex justify-start">
//                   <div className="px-6 py-4 rounded-2xl backdrop-blur-sm border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/70 dark:bg-neutral-900/60 shadow-sm">
//                     <div className="flex gap-2.5">
//                       <div className="w-2.5 h-2.5 bg-neutral-400/60 dark:bg-neutral-500/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
//                       <div className="w-2.5 h-2.5 bg-neutral-400/60 dark:bg-neutral-500/60 rounded-full animate-bounce" style={{ animationDelay: "180ms" }} />
//                       <div className="w-2.5 h-2.5 bg-neutral-400/60 dark:bg-neutral-500/60 rounded-full animate-bounce" style={{ animationDelay: "360ms" }} />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div ref={scrollRef} />
//             </div>
//           )}
//         </div>

//         {/* Input field – always visible, calm, centered */}
//         <form
//           onSubmit={handleSubmit}
//           className="w-full pb-6 sm:pb-8 md:pb-10 lg:pb-12"
//         >
//           <div className="relative max-w-4xl mx-auto">
//             <textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask anything..."
//               rows={1}
//               className="w-full px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/70 dark:border-neutral-800/70 rounded-full text-base sm:text-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-300/40 dark:focus:ring-blue-700/30 resize-none shadow-sm transition-all duration-200"
//               disabled={isThinking}
//             />

//             <button
//               type="submit"
//               disabled={isThinking || !inputValue.trim()}
//               className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-blue-500/10 dark:bg-blue-600/20 hover:bg-blue-500/20 dark:hover:bg-blue-600/30 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <svg
//                 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2.2"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </button>
//           </div>
//         </form>
//       </main>

//       <style jsx global>{`
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.45; }
//           50%      { opacity: 0.9;  }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 5s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }