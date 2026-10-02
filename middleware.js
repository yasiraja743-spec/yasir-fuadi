import { next } from "@vercel/functions";

const MODEL = "minimax/minimax-m3:free";
const MAX_MESSAGES = 1000;
const SYSTEM_PROMPT = `You are Yasir AI, the assistant inside Yasir's portfolio.
Be helpful, natural, and remember the entire conversation supplied in the messages array.
On the FIRST assistant response of a brand-new chat only, start with exactly one folder title marker on its own line in this format:
<name folder>Short descriptive chat name</name folder>
The folder name should be concise (2-6 words) and describe the actual conversation.
Never emit that marker again after the chat already has a folder name.
Do not rename an existing chat.
Use Markdown freely: headings, bold, italic, inline code, fenced code blocks, links, lists, blockquotes, and tables when useful.
If the user sends an image, inspect it before answering and refer only to what you can actually see.
Do not claim to generate video. This MiniMax M3/xKiro chat model returns text; xKiro's current API supports image generation separately but does not provide video generation.`;

function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter(m => m && ["user", "assistant", "system"].includes(m.role))
    .map(m => {
      let content = m.content;
      if (typeof content === "string") return { role: m.role, content: content.slice(0, 200000) };
      if (Array.isArray(content)) {
        const parts = content.filter(p => {
          if (!p || typeof p !== "object") return false;
          if (p.type === "text") return typeof p.text === "string";
          if (p.type === "image_url") return typeof p.image_url?.url === "string";
          return false;
        }).map(p => p.type === "text"
          ? { type: "text", text: p.text.slice(0, 200000) }
          : { type: "image_url", image_url: { url: p.image_url.url } }
        );
        return { role: m.role, content: parts };
      }
      return null;
    })
    .filter(Boolean)
    .slice(-MAX_MESSAGES);
}

export const config = { matcher: "/chat" };

export default async function middleware(request) {
  if (request.method !== "POST") return next();

  const apiKey = process.env.XKIRO_API_KEY;
  if (!apiKey) return Response.json({ error: "XKIRO_API_KEY is not configured on Vercel." }, { status: 500 });

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const messages = cleanMessages(body?.messages);
  if (!messages.length) return Response.json({ error: "messages is required." }, { status: 400 });

  const hasSystem = messages.some(m => m.role === "system");
  const upstreamMessages = hasSystem ? messages : [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

  try {
    const upstream = await fetch("https://api.xkiro.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: upstreamMessages,
        max_tokens: 8192,
        reasoning_effort: "adaptive",
        stream: false
      })
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text || "xKiro returned invalid JSON." }; }

    if (!upstream.ok) {
      const message = data?.error?.message || data?.error || `xKiro HTTP ${upstream.status}`;
      return Response.json({ error: message }, { status: upstream.status });
    }

    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "Empty response from xKiro.";
    return Response.json({ reply, model: MODEL });
  } catch (error) {
    return Response.json({ error: error?.message || "Unable to reach xKiro." }, { status: 502 });
  }
}
