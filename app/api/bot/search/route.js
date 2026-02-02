// import { connectDB } from "@/lib/db";
// import FiqhChunk from "@/models/FiqhChunk";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// /* ------------------ Arabic normalization ------------------ */
// function normalizeArabic(text) {
//   return text
//     .replace(/[إأآا]/g, "ا")
//     .replace(/ى/g, "ي")
//     .replace(/ؤ/g, "و")
//     .replace(/ئ/g, "ي")
//     .replace(/ة/g, "ه")
//     .replace(/[ًٌٍَُِّْ]/g, "")
//     .replace(/[^\u0600-\u06FF\s]/g, "")
//     .trim();
// }

// /* ------------------ Term extraction (local, not GPT) ------------------ */
// function extractTerms(text) {
//   return [...new Set(
//     normalizeArabic(text)
//       .split(/\s+/)
//       .filter(w => w.length >= 3)
//   )];
// }

// /* ------------------ API ------------------ */
// export async function POST(req) {
//   await connectDB();

//   const { question } = await req.json();
//   if (!question) {
//     return Response.json({ error: "Missing question" }, { status: 400 });
//   }

//   const normalizedQuestion = normalizeArabic(question);
//   const terms = extractTerms(normalizedQuestion);

//   if (terms.length === 0) {
//     return Response.json({
//       answer: "السؤال غير واضح."
//     });
//   }

//   /* ------------------ MongoDB TEXT SEARCH ------------------ */
//   const regex = terms.join("|");

//   const chunks = await FiqhChunk.find({
//     text: { $regex: regex, $options: "i" },
//   })
//     .sort({ length: -1 })
//     .limit(3);

//   if (!chunks.length) {
//     return Response.json({
//       answer: "لم أجد نصًا مطابقًا في المصادر المخزنة.",
//     });
//   }

//   const sourceText = chunks.map(c => c.text).join("\n\n---\n\n");

//   /* ------------------ GPT: extraction ONLY ------------------ */
//   let finalAnswer = "";

//   try {
//     const gpt = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       temperature: 0,
//       messages: [
//         {
//           role: "system",
//           content: `
// أنت مساعد فقه شافعي.
// مهمتك فقط:
// - استخراج الجواب من النص المعطى
// - لا تضف أي حكم أو تعليل من عندك
// - إن كان الجواب صريحًا فاذكره بصيغة واضحة
// - إن كان بنفي فاحفظ النفي
// `
//         },
//         {
//           role: "user",
//           content: `
// النص:
// ${sourceText}

// السؤال:
// ${normalizedQuestion}
// `
//         }
//       ],
//     });

//     finalAnswer = gpt.choices[0].message.content.trim();

//   } catch (err) {
//     console.error("GPT failed:", err.message);
//   }

//   /* ------------------ HARD FALLBACK ------------------ */
//   if (!finalAnswer) {
//     finalAnswer = chunks[0].text;
//   }

//   return Response.json({
//     answer: finalAnswer,
//     source: {
//       book: chunks[0].book,
//       topic: chunks[0].topic,
//       chunkId: chunks[0].chunkId,
//     },
//   });
// }




import { connectDB } from "@/lib/db";
import FiqhChunk from "@/models/FiqhChunk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------ Arabic normalization ------------------ */
function normalizeArabic(text = "") {
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[^\u0600-\u06FF\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------ Term extraction ------------------ */
function extractTerms(text) {
  return [...new Set(
    normalizeArabic(text)
      .split(" ")
      .filter(w => w.length >= 3)
  )];
}

/* ------------------ Chunk relevance scoring ------------------ */
function scoreChunk(text, terms) {
  const t = normalizeArabic(text);
  let score = 0;
  for (const term of terms) {
    if (t.includes(term)) score++;
  }
  return score;
}

/* ------------------ Sentence-level extraction ------------------ */
function extractRelevantSentences(text, terms) {
  const sentences = text.split(/(?<=[.؟!])\s+/);
  return sentences
    .filter(s =>
      terms.some(t => normalizeArabic(s).includes(t))
    )
    .join(" ");
}

/* ------------------ GPT: Topic/Subtopic (ADD ONLY) ------------------ */
async function generateTopicMeta(text) {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
أنت مصنف فقهي متخصص في كتاب "فتح المعين".
القواعد الصارمة:
- استخرج موضوعًا فقهيًا مطابقًا لأبواب فتح المعين
- استخرج موضوعًا فرعيًا أدق من نفس النص
- لا تفسر
- لا تلخص
- لا تخترع بابًا غير معروف فقهيًا
- أجب بصيغة JSON فقط
مثال:
{
  "topic": "الصلاة",
  "subTopic": "شروط وجوب الصلاة"
}
`
      },
      {
        role: "user",
        content: text.slice(0, 1200)
      }
    ],
  });

  return JSON.parse(res.choices[0].message.content);
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

  if (!terms.length) {
    return Response.json({ answer: "السؤال غير واضح." });
  }

  /* ------------------ MongoDB candidate fetch ------------------ */
  const regex = terms.join("|");

  const candidates = await FiqhChunk.find({
    text: { $regex: regex, $options: "i" },
  }).limit(10);

  if (!candidates.length) {
    return Response.json({
      answer: "لم أجد نصًا مطابقًا في المصادر المخزنة.",
    });
  }

  /* ------------------ Rank by relevance ------------------ */
  const ranked = candidates
    .map(c => ({
      chunk: c,
      score: scoreChunk(c.text, terms),
    }))
    .filter(x => x.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (!ranked.length) {
    return Response.json({
      answer: "لا يوجد نص صريح يجيب عن السؤال.",
    });
  }

  /* ------------------ Extract only relevant lines ------------------ */
  const sourceText = ranked
    .map(x => extractRelevantSentences(x.chunk.text, terms))
    .join("\n");

  /* ------------------ GPT: STRICT EXTRACTION ------------------ */
  let finalAnswer = "";

  try {
    const gpt = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
أنت أداة استخراج نصي فقط.
القواعد الصارمة:
- الجواب يجب أن يكون من النص حرفياً
- الجواب جملة مفيدة كاملة
- لا تختصر
- لا تعلل
- لا تضف رأياً
- لا تجب بنعم أو لا فقط
- إن لم يوجد جواب صريح قل: "لا يوجد نص صريح"
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

  if (!finalAnswer) {
    finalAnswer = sourceText;
  }

  /* ------------------ ADD: Topic/Subtopic fallback ------------------ */
  let topic = ranked[0].chunk.topic;
  let subTopic = ranked[0].chunk.subTopic;

  if (!topic || !subTopic) {
    try {
      const meta = await generateTopicMeta(ranked[0].chunk.text);
      topic = topic || meta.topic;
      subTopic = subTopic || meta.subTopic;
    } catch (e) {
      console.error("Topic generation failed");
    }
  }

  return Response.json({
    answer: finalAnswer,
    source: {
      book: ranked[0].chunk.book,
      topic,
      subTopic,
      chunkId: ranked[0].chunk.chunkId,
    },
  });
}



// import { connectDB } from "@/lib/db";
// import FiqhChunk from "@/models/FiqhChunk";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// /* ------------------ Arabic normalization ------------------ */
// function normalizeArabic(text = "") {
//   return text
//     .replace(/[إأآا]/g, "ا")
//     .replace(/ى/g, "ي")
//     .replace(/ؤ/g, "و")
//     .replace(/ئ/g, "ي")
//     .replace(/ة/g, "ه")
//     .replace(/[ًٌٍَُِّْ]/g, "")
//     .replace(/[^\u0600-\u06FF\s]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// /* ------------------ Term extraction ------------------ */
// function extractTerms(text) {
//   return [...new Set(
//     normalizeArabic(text)
//       .split(" ")
//       .filter(w => w.length >= 3)
//   )];
// }

// /* ------------------ Chunk relevance scoring ------------------ */
// function scoreChunk(text, terms) {
//   const t = normalizeArabic(text);
//   let score = 0;
//   for (const term of terms) {
//     if (t.includes(term)) score++;
//   }
//   return score;
// }

// /* ------------------ Sentence-level extraction ------------------ */
// function extractRelevantSentences(text, terms) {
//   const sentences = text.split(/(?<=[.؟!])\s+/);
//   return sentences
//     .filter(s =>
//       terms.some(t => normalizeArabic(s).includes(t))
//     )
//     .join(" ");
// }

// /* ------------------ API ------------------ */
// export async function POST(req) {
//   await connectDB();

//   const { question } = await req.json();
//   if (!question) {
//     return Response.json({ error: "Missing question" }, { status: 400 });
//   }

//   const normalizedQuestion = normalizeArabic(question);
//   const terms = extractTerms(normalizedQuestion);

//   if (!terms.length) {
//     return Response.json({ answer: "السؤال غير واضح." });
//   }

//   /* ------------------ MongoDB candidate fetch ------------------ */
//   const regex = terms.join("|");

//   const candidates = await FiqhChunk.find({
//     text: { $regex: regex, $options: "i" },
//   }).limit(10);

//   if (!candidates.length) {
//     return Response.json({
//       answer: "لم أجد نصًا مطابقًا في المصادر المخزنة.",
//     });
//   }

//   /* ------------------ Rank by relevance ------------------ */
//   const ranked = candidates
//     .map(c => ({
//       chunk: c,
//       score: scoreChunk(c.text, terms),
//     }))
//     .filter(x => x.score >= 2)
//     .sort((a, b) => b.score - a.score)
//     .slice(0, 2);

//   if (!ranked.length) {
//     return Response.json({
//       answer: "لا يوجد نص صريح يجيب عن السؤال.",
//     });
//   }

//   /* ------------------ Extract only relevant lines ------------------ */
//   const sourceText = ranked
//     .map(x => extractRelevantSentences(x.chunk.text, terms))
//     .join("\n");

//   /* ------------------ GPT: STRICT EXTRACTION ------------------ */
//   let finalAnswer = "";

//   try {
//     const gpt = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       temperature: 0,
//       messages: [
//         {
//           role: "system",
//           content: `
// أنت أداة استخراج نصي فقط.
// القواعد الصارمة:
// - الجواب يجب أن يكون من النص حرفياً
// - الجواب جملة مفيدة كاملة
// - لا تختصر
// - لا تعلل
// - لا تضف رأياً
// - لا تجب بنعم أو لا فقط
// - إن لم يوجد جواب صريح قل: "لا يوجد نص صريح"
// `
//         },
//         {
//           role: "user",
//           content: `
// النص:
// ${sourceText}

// السؤال:
// ${normalizedQuestion}
// `
//         }
//       ],
//     });

//     finalAnswer = gpt.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("GPT failed:", err.message);
//   }

//   /* ------------------ Hard fallback ------------------ */
//   if (!finalAnswer) {
//     finalAnswer = sourceText;
//   }

//   return Response.json({
//     answer: finalAnswer,
//     source: {
//       book: ranked[0].chunk.book,
//       topic: ranked[0].chunk.topic,
//       chunkId: ranked[0].chunk.chunkId,
//     },
//   });
// }
