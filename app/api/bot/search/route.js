

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
            { $match: { score: { $gt: 0.5 } } }, // Slightly lowered from 0.6 to be safe
    { $sort: { score: -1 } },           // Pro-tip: Highest score first
    { $limit: 10 }                       // Increased from 8 to catch longer lists
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
            max_tokens: 1000, // Added to prevent the answer from cutting off
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

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // 1. Precise Language Detection
// async function detectLanguage(text) {
//     const res = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         temperature: 0,
//         messages: [
//             {
//                 role: "system",
//                 content: "Identify the language of the user text. Reply ONLY with the language name in English (e.g., 'Malayalam', 'Arabic', 'English', 'French', 'Urdu')."
//             },
//             { role: "user", content: text }
//         ],
//     });
//     return res.choices[0].message.content.trim();
// }

// // 2. Expert Fiqh Translation (Focus on keywords)
// async function translateToFiqhArabic(text, lang) {
//     // If it's already Arabic, we still want to "normalize" it (remove prefixes like 'فـ' or 'وـ')
//     const isArabic = lang.toLowerCase() === "arabic" || lang.toLowerCase() === "ar";

//     const systemPrompt = `
// You are a Fiqh Query Optimizer. 
// Your task is to convert the user's input into a "Search Key" specifically for the book Fathul Mueen.

// When the user asks for "Conditions" (شروط) or "Pillars" (أركان), you MUST include the subject (Prayer, Wudu, fasting) in the output.
// Example: If user asks "Conditions", and the topic is prayer, output "شروط الصلاة".
// Do not output generic words like "شروط" alone.

// STRICT RULES:
// 1. NORMALIZE: Strip away conversational prefixes like 'فـ' (so 'فيكفر' becomes 'يكفر'), 'هل', or 'ما هو'.
// 2. TERMINOLOGY: Use exact Classical Arabic Fiqh terms (e.g., 'أركان' instead of 'أجزاء').
// 3. CLEANING: If the user input is already Arabic, remove grammatical particles that might hinder vector matching.
// 4. Output ONLY the optimized Arabic text. No explanations.`;

//     const res = await openai.chat.completions.create({
//         model: "gpt-4o-mini", // GPT-4o-mini is enough for this and cheaper
//         temperature: 0,
//         messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: text },
//         ],
//     });

//     return res.choices[0].message.content.trim();
// }


// // C. HYBRID SEARCH (Vector + Keyword)
// async function performHybridSearch(vector, questionArabic) {
//     // 1. Vector Pipeline (Semantic/Meaning)
//     const vectorResults = await FiqhChunk.aggregate([
//         {
//             $search: {
//                 index: "default",
//                 knnBeta: { vector: vector, path: "embedding", k: 20 }
//             }
//         },
//         { $addFields: { vectorScore: { $meta: "searchScore" } } },
//         { $limit: 10 }
//     ]);

//     // 2. Text Pipeline (Keyword/Exact match)
//     const textResults = await FiqhChunk.aggregate([
//         {
//             $search: {
//                 index: "default",
//                 text: {
//                     query: questionArabic,
//                     path: "text",
//                     fuzzy: { maxEdits: 2 } // Allows for small spelling mistakes
//                 }
//             }
//         },
//         { $addFields: { textScore: { $meta: "searchScore" } } },
//         { $limit: 10 }
//     ]);

//     // 3. Simple Fusion: Combine and Deduplicate
//     const combined = [...vectorResults, ...textResults];
//     const uniqueResults = {};

//     combined.forEach(res => {
//         if (!uniqueResults[res._id]) {
//             uniqueResults[res._id] = {
//                 ...res,
//                 // Boost documents that appear in BOTH searches
//                 finalScore: (res.vectorScore || 0) + (res.textScore || 0)
//             };
//         } else {
//             // If it exists in both, combine the scores
//             uniqueResults[res._id].finalScore += (res.textScore || 0);
//         }
//     });

//     // Sort by the new combined score
//     return Object.values(uniqueResults)
//         .sort((a, b) => b.finalScore - a.finalScore)
//         .slice(0, 8); // Send top 8 to the Mufti
// }


// export async function POST(req) {
//     try {
//         await connectDB();
//         const { question } = await req.json();

//         const userLang = await detectLanguage(question);
//         const questionArabic = await translateToFiqhArabic(question, userLang);

//         // B. Embedding
//         const embRes = await openai.embeddings.create({
//             model: "text-embedding-3-small",
//             input: questionArabic,
//         });
//         const vector = embRes.data[0].embedding;

//         // C. ADVANCED SEARCH (Atlas Free Tier optimized)
//         const results = await performHybridSearch(vector, questionArabic);

//         if (!results.length) {
//             const noMatchMsg = userLang === 'ml'
//                 ? "ക്ഷമിക്കണം, ഫത്തുൽ മുഈനിൽ ഇതുമായി ബന്ധപ്പെട്ട വിവരങ്ങൾ കണ്ടെത്താനായില്ല."
//                 : "No relevant text found in Fathul Mueen.";
//             return Response.json({ answer: noMatchMsg });
//         }

//         // D. Context Building with Metadata labels
//         const contextText = results.map((r, i) => `[Doc ${i + 1}]: ${r.text}`).join("\n\n");

//         // E. THE "MUFTI" PROMPT - Strict Grounding
//         const finalRes = await openai.chat.completions.create({
//             model: "gpt-4o",
//             temperature: 0,
//             messages: [
//                 {
//                     role: "system",
//                     content: `You are a Shafi'i Mufti. Answer ONLY using the provided context from Fathul Mueen.
          
//           RULES:
//           1. LANGUAGE: You must answer in ${userLang}. (If the user asked in ${userLang}, reply in ${userLang}).
//           2. ACCURACY: If you mention a Fiqh term, include the Arabic in brackets. (e.g., നിയ്യത്ത് [نية]).
//           3. LISTS: If the user asks for "how many" or "what are", extract the list exactly as written in the text.
//           4. NO HALLUCINATION: If the context talks about 'Purification' but the user asked about 'Marriage', say you can't find it.
//           5. Keep the tone religious and respectful.
//           6. If the user asks about PRAYER (الصلاة), but the provided context is about WUDU (الوضوء) or PURIFICATION (الطهارة), you must NOT use that list.`
//                 },
//                 { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${question}` }
//             ],
//         });

//         return Response.json({
//             answer: finalRes.choices[0].message.content,
//             source: results.map(r => ({ topic: r.topic, subtopic: r.subtopic }))
//         });

//     } catch (error) {
//         console.error("Search Error:", error);
//         return Response.json({ error: "Search failed" }, { status: 500 });
//     }
// }
