import { next } from "@vercel/functions";

export const config = {
  matcher: "/chat",
};

export default async function middleware(request) {
  if (request.method !== "POST") return next();

  const apiKey = process.env.XKIRO_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "XKIRO_API_KEY is not configured on Vercel." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    return Response.json({ error: "messages is required." }, { status: 400 });
  }

  const messages = body.messages
    .filter(m => m && (m.role === "user" || m.role === "assistant" || m.role === "system") && typeof m.content === "string")
    .slice(-30);

  if (!messages.length) return Response.json({ error: "No valid messages." }, { status: 400 });

  try {
    const upstream = await fetch("https://api.xkiro.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: typeof body.model === "string" ? body.model : "openai/gpt-5.6-sol",
        messages,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
        stream: false,
      }),
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text || "xKiro returned invalid JSON." }; }

    if (!upstream.ok) {
      const message = data?.error?.message || data?.error || `xKiro HTTP ${upstream.status}`;
      return Response.json({ error: message }, { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 });
    }

    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "Empty response from xKiro.";
    return Response.json({ reply, raw: data }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error?.message || "Unable to reach xKiro." }, { status: 502 });
  }
}
