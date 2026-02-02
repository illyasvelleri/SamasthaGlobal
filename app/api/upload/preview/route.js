import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { book, text } = await req.json();

    if (!text || !text.trim()) {
      return Response.json(
        { error: "Missing fiqh text" },
        { status: 400 }
      );
    }

    const gpt = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
أنت فقيه شافعي متخصص في كتاب "فتح المعين".
مهمتك تصنيف النص فقط.

قواعد صارمة:
- لا تشرح
- لا تلخص
- لا تعيد صياغة النص
- لا تخترع موضوعاً غير موجود
- استخدم عناوين فقهية معروفة في كتب الشافعية
- العنوان قصير (3–6 كلمات)
- العنوان الفرعي أدق من الرئيسي

الخرج يكون بهذا الشكل فقط:
Topic: ...
Subtopic: ...
`
        },
        {
          role: "user",
          content: `
الكتاب: ${book || "فتح المعين"}

النص:
${text}
`
        }
      ],
    });

    const output = gpt.choices[0].message.content || "";

    let topic = "";
    let subtopic = "";

    output.split("\n").forEach(line => {
      if (line.startsWith("Topic:")) {
        topic = line.replace("Topic:", "").trim();
      }
      if (line.startsWith("Subtopic:")) {
        subtopic = line.replace("Subtopic:", "").trim();
      }
    });

    return Response.json({
      topic,
      subtopic,
    });

  } catch (err) {
    console.error("Preview API failed:", err.message);
    return Response.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
