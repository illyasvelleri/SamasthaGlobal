import { connectDB } from "@/lib/db";
import FiqhChunk from "@/models/FiqhChunk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------ Arabic normalization ------------------ */
function normalizeArabic(text) {
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[^\u0600-\u06FF\s]/g, "")
    .trim();
}

/* ------------------ Term extraction (local, not GPT) ------------------ */
function extractTerms(text) {
  return [...new Set(
    normalizeArabic(text)
      .split(/\s+/)
      .filter(w => w.length >= 3)
  )];
}

/* ------------------ API ------------------ */
export async function POST(req) {
  await connectDB();

  const { question } = await req.json();
  if (!question) {
    return Response.json({ error: "Missing question" }, { status: 400 });
  }

  const normalizedQuestion = normalizeArabic(question);
  const terms = extractTerms(normalizedQuestion);

  if (terms.length === 0) {
    return Response.json({
      answer: "السؤال غير واضح."
    });
  }

  /* ------------------ MongoDB TEXT SEARCH ------------------ */
  const regex = terms.join("|");

  const chunks = await FiqhChunk.find({
    text: { $regex: regex, $options: "i" },
  })
    .sort({ length: -1 })
    .limit(3);

  if (!chunks.length) {
    return Response.json({
      answer: "لم أجد نصًا مطابقًا في المصادر المخزنة.",
    });
  }

  const sourceText = chunks.map(c => c.text).join("\n\n---\n\n");

  /* ------------------ GPT: extraction ONLY ------------------ */
  let finalAnswer = "";

  try {
    const gpt = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
أنت مساعد فقه شافعي.
مهمتك فقط:
- استخراج الجواب من النص المعطى
- لا تضف أي حكم أو تعليل من عندك
- إن كان الجواب صريحًا فاذكره بصيغة واضحة
- إن كان بنفي فاحفظ النفي
`
        },
        {
          role: "user",
          content: `
النص:
${sourceText}

السؤال:
${normalizedQuestion}
`
        }
      ],
    });

    finalAnswer = gpt.choices[0].message.content.trim();

  } catch (err) {
    console.error("GPT failed:", err.message);
  }

  /* ------------------ HARD FALLBACK ------------------ */
  if (!finalAnswer) {
    finalAnswer = chunks[0].text;
  }

  return Response.json({
    answer: finalAnswer,
    source: {
      book: chunks[0].book,
      topic: chunks[0].topic,
      chunkId: chunks[0].chunkId,
    },
  });
}
