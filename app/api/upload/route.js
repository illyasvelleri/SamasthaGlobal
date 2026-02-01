// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import FiqhChunk from "@/models/FiqhChunk";

// export async function POST(req) {
//   await connectDB();

//   const body = await req.json();
//   const { book, topic, subtopic, chunkId, order, text } = body;

//   if (!book || !topic || !text) {
//     return NextResponse.json(
//       { error: "Missing required fields" },
//       { status: 400 }
//     );
//   }

//   // Auto-generate chunkId if not provided
//   const id = chunkId || `${topic.replace(/\s+/g, "_")}-${Date.now()}`;

//   try {
//     await FiqhChunk.create({
//       book,
//       topic,
//       subtopic,
//       chunkId: id,
//       order: order ? Number(order) : undefined,
//       text,
//     });
//     return NextResponse.json({ success: true, chunkId: id });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FiqhChunk from "@/models/FiqhChunk";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  await connectDB();

  const { book, topic, subtopic, chunkId, order, text } = await req.json();

  if (!book || !topic || !text) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Auto-generate chunkId if not provided
  const id = chunkId || `${topic.replace(/\s+/g, "_")}-${Date.now()}`;

  // Call GPT to generate keywords
  let keywords = [];
  try {
    const gptResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0,
  messages: [
    {
      role: "system",
      content: "You are a Shafi'i fiqh scholar extracting retrieval signals."
    },
    {
      role: "user",
      content: `
From the following fiqh text, extract AT MOST 12 Arabic retrieval keywords.
Rules:
- Focus on ruling phrases and legal qualifiers
- Avoid generic words like: الصلاة، الفقه، الإسلام، العبادة
- Prefer phrases that indicate obligation, exception, or negation
- Each keyword must be 1–4 words only
- Output as a plain list, one per line

TEXT:
${text}
      `
    }
  ]
});

    const rawKeywords = gptResponse.choices[0].message.content.trim();
    // Split by comma or newline
    keywords = rawKeywords.split(/,|\n/).map(k => k.trim()).filter(Boolean);
  } catch (err) {
    console.error("GPT keyword generation failed:", err.message);
  }

  try {
    await FiqhChunk.create({
      book,
      topic,
      subtopic,
      chunkId: id,
      order: order ? Number(order) : undefined,
      text,
      keywords,
      length: text.length,
    });

    return NextResponse.json({ success: true, chunkId: id, keywords });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
