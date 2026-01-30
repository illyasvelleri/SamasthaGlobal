"use client";
import { useState } from "react";

export default function FiqhAI() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");

  async function ask() {
    setAns("Searching Fath al-Mu'in...");

    const res = await fetch("http://localhost:5678/webhook-test/fiqh-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    const data = await res.json();
    setAns(data.answer_ml || data.message);
  }

  return (
    <div>
      <h1>Fiqh AI</h1>
      <input value={q} onChange={e => setQ(e.target.value)} />
      <button onClick={ask}>Ask</button>
      <p>{ans}</p>
    </div>
  );
}
