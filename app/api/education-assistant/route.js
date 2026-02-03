import { NextResponse } from 'next/server';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Missing N8N_WEBHOOK_URL in env');
    return NextResponse.json({ error: 'Server misconfiguration: webhook missing' }, { status: 500 });
  }

  console.log('Sending to n8n:', webhookUrl, 'body:', body);

  let n8nRes, rawText;
  try {
    n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    rawText = await n8nRes.text();
    console.log('n8n raw response:', n8nRes.status, rawText.substring(0, 300));
  } catch (err) {
    console.error('Fetch to n8n failed:', err);
    return NextResponse.json({ error: 'Failed to reach n8n webhook' }, { status: 502 });
  }

  if (!n8nRes.ok) {
    console.error('n8n error response:', n8nRes.status, rawText);
    let errorBody;
    try {
      errorBody = JSON.parse(rawText);
    } catch {
      errorBody = { raw: rawText };
    }
    return NextResponse.json(
      { error: 'n8n returned error', status: n8nRes.status, details: errorBody },
      { status: 500 }
    );
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { message: rawText || 'OK (non-JSON response)' };
  }

  return NextResponse.json(data);
}