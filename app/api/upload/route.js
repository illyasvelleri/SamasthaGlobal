import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { text, bookName } = body;

    if (!text || !bookName) {
      return NextResponse.json(
        { error: "Text and bookName are required" },
        { status: 400 }
      );
    }

    const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, bookName }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = { message: "n8n responded without JSON" };
    }

    return NextResponse.json({
      success: true,
      message: "Upload sent to n8n successfully",
      data,
    });
  } catch (error) {
    console.error("Upload API Error:", error);

    return NextResponse.json(
      { error: "Failed to send data to n8n" },
      { status: 500 }
    );
  }
}
