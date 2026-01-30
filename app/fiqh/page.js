"use client";

import { useState } from "react";

export default function FiqhAIPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askFiqh = async () => {
    if (!question.trim()) return alert("ചോദ്യം എഴുതുക");

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5678/webhook-test/fiqh-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      // parse safely
      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Invalid JSON from server", raw: text };
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Server error. Try again." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-black to-emerald-800 text-white p-6">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-emerald-500/30">

        <h1 className="text-3xl font-bold text-center text-emerald-400">
          🕌 Fiqh AI Assistant
        </h1>
        <p className="text-center text-gray-300 mt-2">
          ഇസ്‌ലാമിക ഫിഖ് ചോദ്യങ്ങൾക്ക് AI സഹായം
        </p>

        <textarea
          placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ എഴുതുക..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full mt-5 p-4 rounded-xl bg-black/60 border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          rows={4}
        />

        <button
          onClick={askFiqh}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "ചിന്തിക്കുന്നു..." : "ചോദിക്കുക"}
        </button>

        {result && (
          <div className="mt-6 bg-black/60 rounded-xl p-4 border border-emerald-500/20">
            {result.status === "success" && (
              <>
                <div className="text-sm text-emerald-400 mb-2">
                  📚 {result.book} | {result.kitab} | {result.bab} | p.{result.page}
                </div>
                <p className="text-gray-100 leading-relaxed whitespace-pre-line">
                  {result.answer_ml}
                </p>
              </>
            )}

            {result.status === "not_found" && (
              <p className="text-yellow-400">{result.message}</p>
            )}

            {result.error && (
              <div className="text-red-400">
                ❌ {result.error}
                {result.raw && (
                  <pre className="mt-2 text-xs text-gray-400 overflow-auto">
                    {result.raw}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
