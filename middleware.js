import { next } from "@vercel/functions";

const MODEL = "mistralai/mistral-medium-3.5";
const MAX_MESSAGES = 1000;
const SYSTEM_PROMPT = `Your name is Yasir AI. You are the AI assistant on Yasir's portfolio website (Yasir is a Full-Stack Developer who loves coding).
Identity rules:
- If asked your name or who you are, answer that you are Yasir AI. Always refer to yourself as Yasir AI.
- Never claim to be human. If asked which model or company is behind you, say you don't have that detail instead of guessing.
- Reply in the same language as the user (Indonesian if they write Indonesian).
On the FIRST assistant response of a brand-new chat only, start with exactly one folder title marker on its own line in this format:
<name folder>Short descriptive chat name</name folder>
The folder name must be 2-6 words and describe the conversation. Never emit that marker again once the chat already has a folder name.
Use Markdown freely: headings, bold, italic, inline code, fenced code blocks with a language tag, links, lists, blockquotes and tables when useful.
If the user sends an image, inspect it before answering and describe only what is actually visible.
Capabilities: you can chat and read images. You cannot generate video (the provider has no video generation); if asked, say so honestly and never invent a video link.`;

function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter(m => m && ["user", "assistant"].includes(m.role))
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

export const config = { matcher: ["/chat", "/tools/tiktok"] };

/* ---------------- TikTok downloader (server-side, tanpa route api) ---------------- */
const TT_PROVIDER = process.env.TIKTOK_API_URL || "https://www.tikwm.com/api/";
const TT_HOST = /^(www\.|vm\.|vt\.|m\.)?tiktok\.com$/;
const MEDIA_HOSTS = ["tikwm.com", "tiktokcdn.com", "tiktokcdn-us.com", "tiktokv.com", "tiktokv.us", "byteoversea.com", "muscdn.com"];
const hits = new Map();
function limited(request, max = 12, win = 60000) {
  const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now(), e = hits.get(ip);
  if (hits.size > 3000) hits.clear();
  if (!e || now - e.t > win) { hits.set(ip, { n: 1, t: now }); return false; }
  return ++e.n > max;
}
const mediaAllowed = u => u.protocol === "https:" && MEDIA_HOSTS.some(d => u.hostname === d || u.hostname.endsWith("." + d));
const toAbs = u => !u ? "" : /^https:\/\//.test(u) ? u : u.startsWith("/") ? "https://www.tikwm.com" + u : "";
const b64 = t => btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = t => atob(t.replace(/-/g, "+").replace(/_/g, "/"));
function link(raw, name) {
  const url = toAbs(raw); if (!url) return null;
  let ok = false; try { ok = mediaAllowed(new URL(url)); } catch {}
  return { url, dl: ok ? `/tools/tiktok?dl=${b64(url)}&n=${name}` : url };
}

async function tiktokPost(request) {
  if (limited(request)) return Response.json({ error: "Terlalu banyak request, coba lagi sebentar." }, { status: 429 });
  if (Number(request.headers.get("content-length") || 0) > 2000) return Response.json({ error: "Request terlalu besar." }, { status: 413 });
  let target = "";
  try {
    const b = await request.json();
    const u = new URL(String(b?.url ?? "").trim());
    if (u.protocol !== "https:" || !TT_HOST.test(u.hostname) || u.href.length > 400) throw 0;
    target = u.href;
  } catch { return Response.json({ error: "Link TikTok tidak valid. Contoh: https://www.tiktok.com/@user/video/123..." }, { status: 400 }); }
  try {
    const r = await fetch(TT_PROVIDER, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0" },
      body: new URLSearchParams({ url: target, hd: "1" }),
      signal: AbortSignal.timeout(20000)
    });
    const d = await r.json();
    if (d?.code !== 0 || !d.data) return Response.json({ error: "Video tidak ditemukan, privat, atau provider sedang gagal. Coba lagi." }, { status: 502 });
    const x = d.data;
    const links = { play: link(x.play, "video"), hd: link(x.hdplay, "video-hd"), wm: link(x.wmplay, "watermark"), mp3: link(x.music || x.music_info?.play, "music") };
    if (!links.play && !links.hd && !links.wm) return Response.json({ error: "Provider tidak mengembalikan link video." }, { status: 502 });
    return Response.json({ title: String(x.title ?? "").slice(0, 500), author: String(x.author?.nickname ?? x.author?.unique_id ?? ""), cover: toAbs(x.cover), links });
  } catch { return Response.json({ error: "Provider downloader tidak dapat dihubungi (timeout)." }, { status: 502 }); }
}

async function tiktokDownload(request) {
  if (limited(request, 30)) return new Response("Too many requests", { status: 429 });
  const q = new URL(request.url).searchParams;
  let u;
  try { u = new URL(unb64(String(q.get("dl") || ""))); } catch { return new Response("Bad request", { status: 400 }); }
  if (!mediaAllowed(u)) return new Response("Host not allowed", { status: 400 });
  const name = String(q.get("n") || "video").replace(/[^a-z0-9-]/gi, "").slice(0, 20) || "video";
  try {
    let r, cur = u.href;
    for (let i = 0; i < 4; i++) {
      r = await fetch(cur, { redirect: "manual", signal: AbortSignal.timeout(60000), headers: { "User-Agent": "Mozilla/5.0" } });
      if (r.status >= 300 && r.status < 400) {
        const loc = r.headers.get("location"); if (!loc) break;
        const nu = new URL(loc, cur); if (!mediaAllowed(nu)) return new Response("Redirect blocked", { status: 400 });
        cur = nu.href; continue;
      }
      break;
    }
    if (!r.ok || !r.body) return new Response("Upstream error", { status: 502 });
    const ct = r.headers.get("content-type") || "";
    const isAudio = name === "music";
    const type = /^(video|audio)\//.test(ct) ? ct : isAudio ? "audio/mpeg" : "video/mp4";
    const h = { "Content-Type": type, "Content-Disposition": `attachment; filename="yasir-tiktok-${name}.${isAudio ? "mp3" : "mp4"}"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    const len = r.headers.get("content-length"); if (len) h["Content-Length"] = len;
    return new Response(r.body, { headers: h });
  } catch { return new Response("Download failed", { status: 502 }); }
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (url.pathname === "/tools/tiktok") {
    if (request.method === "POST") return tiktokPost(request);
    if (request.method === "GET" && url.searchParams.has("dl")) return tiktokDownload(request);
    return next();
  }
  if (request.method !== "POST") return next();
  return chatHandler(request);
}

async function chatHandler(request) {

  if (Number(request.headers.get("content-length") || 0) > 6_000_000) return Response.json({ error: "Payload too large." }, { status: 413 });
  const apiKey = process.env.XKIRO_API_KEY;
  if (!apiKey) return Response.json({ error: "XKIRO_API_KEY is not configured on Vercel." }, { status: 500 });

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const messages = cleanMessages(body?.messages);
  if (!messages.length) return Response.json({ error: "messages is required." }, { status: 400 });

  const upstreamMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

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
