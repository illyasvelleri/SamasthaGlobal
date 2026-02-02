


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

// /* ------------------ GPT: Topic/Subtopic (ADD ONLY) ------------------ */
// async function generateTopicMeta(text) {
//   const res = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     messages: [
//       {
//         role: "system",
//         content: `
// أنت مصنف فقهي متخصص في كتاب "فتح المعين".
// القواعد الصارمة:
// - استخرج موضوعًا فقهيًا مطابقًا لأبواب فتح المعين
// - استخرج موضوعًا فرعيًا أدق من نفس النص
// - لا تفسر
// - لا تلخص
// - لا تخترع بابًا غير معروف فقهيًا
// - أجب بصيغة JSON فقط
// مثال:
// {
//   "topic": "الصلاة",
//   "subTopic": "شروط وجوب الصلاة"
// }
// `
//       },
//       {
//         role: "user",
//         content: text.slice(0, 1200)
//       }
//     ],
//   });

//   return JSON.parse(res.choices[0].message.content);
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

//   if (!finalAnswer) {
//     finalAnswer = sourceText;
//   }

//   /* ------------------ ADD: Topic/Subtopic fallback ------------------ */
//   let topic = ranked[0].chunk.topic;
//   let subTopic = ranked[0].chunk.subTopic;

//   if (!topic || !subTopic) {
//     try {
//       const meta = await generateTopicMeta(ranked[0].chunk.text);
//       topic = topic || meta.topic;
//       subTopic = subTopic || meta.subTopic;
//     } catch (e) {
//       console.error("Topic generation failed");
//     }
//   }

//   return Response.json({
//     answer: finalAnswer,
//     source: {
//       book: ranked[0].chunk.book,
//       topic,
//       subTopic,
//       chunkId: ranked[0].chunk.chunkId,
//     },
//   });
// }


import { connectDB } from "@/lib/db";
import FiqhChunk from "@/models/FiqhChunk";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------ Language Utilities ------------------ */
async function detectLanguage(text) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Upgraded for better speed/accuracy
    temperature: 0,
    messages: [
      { role: "system", content: "Detect language. Reply only with the code: ar, en, or ml." },
      { role: "user", content: text }
    ],
  });
  return res.choices[0].message.content.trim().toLowerCase();
}

async function translateToArabic(text, lang) {
  if (lang === "ar") return text;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: "Translate this Fiqh question accurately into classical Arabic terminology." },
      { role: "user", content: text }
    ],
  });
  return res.choices[0].message.content.trim();
}

async function translateFromArabic(text, lang) {
  if (lang === "ar" || text.includes("لا يوجد نص")) return text;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: `Translate this Shafi'i Fiqh answer into ${lang}. Keep technical terms accurate.` },
      { role: "user", content: text }
    ],
  });
  return res.choices[0].message.content.trim();
}

/* ------------------ STRICT SHAFII VALIDATION ------------------ */
async function validateAnswer(sourceText, questionArabic) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini", // 3.5 is too weak for strict Fiqh logic
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
أنت فقيه شافعي ومدقق لكتاب "فتح المعين" فقط.
قواعد العمل:
1. أجب فقط من النص المقدم.
2. إذا سأل المستخدم عن "شروط" فلا تذكر الأركان.
3. التزم بالمذهب الشافعي تماماً كما ورد في النص.
4. إذا لم تجد الإجابة في النص، قل نصاً: "لا يوجد نص صريح في هذا الجزء من فتح المعين".
5. لا تشرح من معلوماتك الخارجية.
`
      },
      {
        role: "user",
        content: `السؤال: ${questionArabic}\n\nالنص المستخرج:\n${sourceText}`
      }
    ],
  });

  return res.choices[0].message.content.trim();
}

/* ------------------ SEARCH API (VECTOR VERSION) ------------------ */
export async function POST(req) {
  try {
    await connectDB();

    const { question } = await req.json();
    if (!question) return Response.json({ error: "Question is required" }, { status: 400 });

    // 1. Language Handling
    const userLang = await detectLanguage(question);
    const questionArabic = await translateToArabic(question, userLang);

    // 2. Generate Question Embedding
    const embRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: questionArabic,
    });
    const vector = embRes.data[0].embedding;

    // 3. Atlas Free Tier Vector Search (knnBeta)
    const rankedResults = await FiqhChunk.aggregate([
      {
        $search: {
          index: "default", // Ensure this matches your Atlas Index Name
          knnBeta: {
            vector: vector,
            path: "embedding",
            k: 3 // Fetch top 3 most relevant pages/chunks
          }
        }
      },
      {
        $project: {
          text: 1,
          book: 1,
          topic: 1,
          subtopic: 1,
          chunkId: 1,
          score: { $meta: "searchScore" }
        }
      }
    ]);

    if (!rankedResults.length) {
      const failMsg = await translateFromArabic("لم أجد نصاً مطابقاً في فتح المعين لهذا السؤال.", userLang);
      return Response.json({ answer: failMsg });
    }

    // 4. Extract and Validate
    const contextText = rankedResults.map(r => r.text).join("\n\n---\n\n");
    const validatedArabic = await validateAnswer(contextText, questionArabic);

    // 5. Final Output
    const finalAnswer = await translateFromArabic(validatedArabic, userLang);

    return Response.json({
      answer: finalAnswer,
      source: {
        book: rankedResults[0].book,
        topic: rankedResults[0].topic,
        subtopic: rankedResults[0].subtopic,
        chunkId: rankedResults[0].chunkId,
        relevance: Math.round(rankedResults[0].score * 100) + "%"
      },
    });

  } catch (error) {
    console.error("Fiqh AI Search Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
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

// /* ------------------ Detect language ------------------ */
// async function detectLanguage(text) {
//   const res = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     messages: [
//       { role: "system", content: "Detect language. Reply only: ar, en, ml" },
//       { role: "user", content: text }
//     ],
//   });
//   return res.choices[0].message.content.trim();
// }

// /* ------------------ Translate TO Arabic ------------------ */
// async function translateToArabic(text, lang) {
//   if (lang === "ar") return text;

//   const res = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     messages: [
//       { role: "system", content: "Translate this fiqh question accurately into Arabic." },
//       { role: "user", content: text }
//     ],
//   });

//   return res.choices[0].message.content.trim();
// }

// /* ------------------ Translate FROM Arabic ------------------ */
// async function translateFromArabic(text, lang) {
//   if (lang === "ar") return text;

//   const res = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     messages: [
//       { role: "system", content: `Translate the following fiqh answer into ${lang}. Do not add explanations.` },
//       { role: "user", content: text }
//     ],
//   });

//   return res.choices[0].message.content.trim();
// }

// /* ------------------ STRICT VALIDATION (NO FIqh CREATION) ------------------ */
// async function validateAnswer(sourceText, questionArabic) {
//   const res = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//     messages: [
//       {
//         role: "system",
//         content: `
// أنت مدقق فقهي لكتاب فتح المعين فقط.
// قواعد صارمة:
// - استخدم النص المعطى فقط
// - تحقق أن الجواب يطابق السؤال بدقة
// - إن كان السؤال عن شروط فلا تذكر أركان أو فروض
// - احذف الجمل غير المتعلقة
// - لا تضف أي حكم جديد
// - لا تستخدم معرفة خارج النص
// - إن لم يبق جواب صحيح قل: لا يوجد نص صريح
// `
//       },
//       {
//         role: "user",
//         content: `
// السؤال:
// ${questionArabic}

// النص:
// ${sourceText}
// `
//       }
//     ],
//   });

//   return res.choices[0].message.content.trim();
// }

// /* ------------------ API ------------------ */
// export async function POST(req) {
//   await connectDB();

//   const { question } = await req.json();
//   if (!question) {
//     return Response.json({ error: "Missing question" }, { status: 400 });
//   }

//   /* -------- Language & Translation -------- */
//   const userLang = await detectLanguage(question);
//   const questionArabic = await translateToArabic(question, userLang);

//   const normalizedQuestion = normalizeArabic(questionArabic);
//   const terms = extractTerms(normalizedQuestion);

//   if (!terms.length) {
//     return Response.json({ answer: "السؤال غير واضح." });
//   }

//   /* -------- MongoDB search -------- */
//   const regex = terms.join("|");

//   const candidates = await FiqhChunk.find({
//     text: { $regex: regex, $options: "i" },
//   }).limit(10);

//   if (!candidates.length) {
//     return Response.json({
//       answer: await translateFromArabic(
//         "لم أجد نصًا مطابقًا في فتح المعين.",
//         userLang
//       ),
//     });
//   }

//   /* -------- Rank -------- */
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
//       answer: await translateFromArabic(
//         "لا يوجد نص صريح يجيب عن هذا السؤال.",
//         userLang
//       ),
//     });
//   }

//   /* -------- Extract relevant text -------- */
//   const sourceText = ranked
//     .map(x => extractRelevantSentences(x.chunk.text, terms))
//     .join("\n");

//   /* -------- Validate (NOT rewrite) -------- */
//   const validatedArabic = await validateAnswer(
//     sourceText,
//     normalizedQuestion
//   );

//   /* -------- Translate back -------- */
//   const finalAnswer = await translateFromArabic(
//     validatedArabic,
//     userLang
//   );

//   return Response.json({
//     answer: finalAnswer,
//     source: {
//       book: ranked[0].chunk.book,
//       topic: ranked[0].chunk.topic,
//       subTopic: ranked[0].chunk.subtopic,
//       chunkId: ranked[0].chunk.chunkId,
//     },
//   });
// }
