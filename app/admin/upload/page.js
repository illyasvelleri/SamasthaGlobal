"use client";

import { useState } from "react";

export default function UploadPage() {
  const [bookName, setBookName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleUpload() {
    if (!bookName || !text) {
      alert("Book name and text are required");
      return;
    }

    setLoading(true);
    setResult(null); // ✅ fixed

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookName, text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResult("✅ Successfully sent to n8n");
    } catch (err) {
      setResult("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Fiqh Book Upload (Workflow-1)
        </h1>

        <input
          type="text"
          placeholder="Book Name (e.g. Fathul Muin)"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Paste Arabic fiqh text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload to n8n"}
        </button>

        {result && (
          <p className="mt-4 text-sm font-medium">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}
