import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + cheap
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are an authoritative, precise assistant. Answer clearly and concisely.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "AI failed to respond" },
      { status: 500 }
    );
  }
}
