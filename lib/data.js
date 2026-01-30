// lib/data.js
import fatwaData from '../data/fatwas.json' assert { type: 'json' };

export function getFatwaData() {
  return fatwaData;
}

export function getFatwaById(id) {
  const searchId = String(id).trim();
  const found = fatwaData.fatwas.find(f => String(f.id) === searchId);

  if (!found) {
    console.log(`[DEBUG] No fatwa found for ID: ${searchId}`);
    return null;
  }

  // Always ensure answer exists (full content)
  const fullAnswer = found.answer || found.excerpt || "പൂർണ ഉത്തരം ലഭ്യമല്ല.";

  // Generate short excerpt if not provided (limit to ~100 words)
  const shortExcerpt = found.excerpt || fullAnswer.split(/\s+/).slice(0, 60).join(" ") + "...";

  return {
    ...found,
    fullAnswer,      // ← full unlimited answer
    excerpt: shortExcerpt,  // ← short version for list
    source: found.source || "സ്രോതസ്സ് ലഭ്യമല്ല"
  };
}