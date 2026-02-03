


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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Precise Language Detection
async function detectLanguage(text) {
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: "Identify the language of the user text. Reply ONLY with the language name in English (e.g., 'Malayalam', 'Arabic', 'English', 'French', 'Urdu')."
            },
            { role: "user", content: text }
        ],
    });
    return res.choices[0].message.content.trim();
}

// 2. Expert Fiqh Translation (Focus on keywords)
async function translateToFiqhArabic(text, lang) {
    // If it's already Arabic, we still want to "normalize" it (remove prefixes like 'فـ' or 'وـ')
    const isArabic = lang.toLowerCase() === "arabic" || lang.toLowerCase() === "ar";

    const systemPrompt = `
You are a Fiqh Query Optimizer. 
Your task is to convert the user's input into a "Search Key" specifically for the book Fathul Mueen.

STRICT RULES:
1. NORMALIZE: Strip away conversational prefixes like 'فـ' (so 'فيكفر' becomes 'يكفر'), 'هل', or 'ما هو'.
2. TERMINOLOGY: Use exact Classical Arabic Fiqh terms (e.g., 'أركان' instead of 'أجزاء').
3. CLEANING: If the user input is already Arabic, remove grammatical particles that might hinder vector matching.
4. Output ONLY the optimized Arabic text. No explanations.`;

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini", // GPT-4o-mini is enough for this and cheaper
        temperature: 0,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
        ],
    });

    return res.choices[0].message.content.trim();
}

export async function POST(req) {
    try {
        await connectDB();
        const { question } = await req.json();

        const userLang = await detectLanguage(question);
        const questionArabic = await translateToFiqhArabic(question, userLang);

        // B. Embedding
        const embRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: questionArabic,
        });
        const vector = embRes.data[0].embedding;

        // C. ADVANCED SEARCH (Atlas Free Tier optimized)
        const results = await FiqhChunk.aggregate([
            {
                $search: {
                    index: "default",
                    knnBeta: {
                        vector: vector,
                        path: "embedding",
                        k: 15 // Higher K to ensure we catch long lists (like Arkan)
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" }
                }
            },
            { $match: { score: { $gt: 0.6 } } }, // THRESHOLD: Ignore low-quality matches
            { $limit: 8 }
        ]);

        if (!results.length) {
            const noMatchMsg = userLang === 'ml'
                ? "ക്ഷമിക്കണം, ഫത്തുൽ മുഈനിൽ ഇതുമായി ബന്ധപ്പെട്ട വിവരങ്ങൾ കണ്ടെത്താനായില്ല."
                : "No relevant text found in Fathul Mueen.";
            return Response.json({ answer: noMatchMsg });
        }

        // D. Context Building with Metadata labels
        const contextText = results.map((r, i) => `[Doc ${i + 1}]: ${r.text}`).join("\n\n");

        // E. THE "MUFTI" PROMPT - Strict Grounding
        const finalRes = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: `You are a Shafi'i Mufti. Answer ONLY using the provided context from Fathul Mueen.
          
          RULES:
          1. LANGUAGE: You must answer in ${userLang}. (If the user asked in ${userLang}, reply in ${userLang}).
          2. ACCURACY: If you mention a Fiqh term, include the Arabic in brackets. (e.g., നിയ്യത്ത് [نية]).
          3. LISTS: If the user asks for "how many" or "what are", extract the list exactly as written in the text.
          4. NO HALLUCINATION: If the context talks about 'Purification' but the user asked about 'Marriage', say you can't find it.
          5. Keep the tone religious and respectful.`
                },
                { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${question}` }
            ],
        });

        return Response.json({
            answer: finalRes.choices[0].message.content,
            source: results.map(r => ({ topic: r.topic, subtopic: r.subtopic }))
        });

    } catch (error) {
        console.error("Search Error:", error);
        return Response.json({ error: "Search failed" }, { status: 500 });
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
