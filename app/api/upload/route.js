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
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an Arabic fiqh assistant." },
        {
          role: "user",
          content: `Extract 5-10 relevant keywords (in Arabic) from this fiqh text:\n${text}`,
        },
      ],
      temperature: 0,
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
