const MODEL = process.env.XKIRO_MODEL || "minimax/minimax-m3:free";
const ENDPOINT = process.env.XKIRO_API_URL || "https://api.xkiro.com/v1/chat/completions";
const MAX_MESSAGES = 1000;

const SYSTEM_PROMPT = `You are Yasir AI, the assistant inside Yasir's portfolio.
Remember the entire conversation supplied in the messages array.
On the FIRST assistant response of a brand-new chat only, start with exactly one folder title marker on its own line:
<name folder>Short descriptive chat name</name folder>
The folder name must be concise (2-6 words) and describe the actual conversation. Never emit it again after a folder already exists.
Use Markdown freely: headings, bold, italic, underline HTML, strikethrough, inline code, fenced code blocks, links, lists, blockquotes and tables when useful.
If the user sends an image, inspect it before answering and describe only what is actually visible.
If the user asks to generate a video, explain that the portfolio has a separate video generation action; do not fabricate a generated video URL.`;

function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  return input.filter(m => m && ["user","assistant"].includes(m.role)).map(m => {
    if (typeof m.content === "string") return {role:m.role, content:m.content.slice(0,200000)};
    if (Array.isArray(m.content)) {
      const parts=m.content.filter(p => p && typeof p==="object" &&
        ((p.type==="text" && typeof p.text==="string") ||
         (p.type==="image_url" && typeof p.image_url?.url==="string")))
        .map(p => p.type==="text"
          ? {type:"text",text:p.text.slice(0,200000)}
          : {type:"image_url",image_url:{url:p.image_url.url}});
      return {role:m.role,content:parts};
    }
    return null;
  }).filter(Boolean).slice(-MAX_MESSAGES);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  const apiKey=process.env.XKIRO_API_KEY;
  if(!apiKey) return res.status(500).json({error:"XKIRO_API_KEY is not configured."});

  let body;
  try { body=typeof req.body==="string"?JSON.parse(req.body):req.body; }
  catch { return res.status(400).json({error:"Invalid JSON body."}); }

  const messages=cleanMessages(body?.messages);
  if(!messages.length) return res.status(400).json({error:"messages is required."});

  try {
    const upstream=await fetch(ENDPOINT,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${apiKey}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:MODEL,
        messages:[{role:"system",content:SYSTEM_PROMPT},...messages],
        max_tokens:8192,
        reasoning_effort:"adaptive",
        stream:false
      })
    });
    const text=await upstream.text();
    let data; try{data=JSON.parse(text)}catch{data={error:text||"Invalid provider response."}}
    if(!upstream.ok){
      const message=data?.error?.message||data?.error||`Provider HTTP ${upstream.status}`;
      return res.status(upstream.status).json({error:message});
    }
    const reply=data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";
    return res.status(200).json({reply,model:MODEL});
  } catch(e) {
    return res.status(502).json({error:e?.message||"Unable to reach AI provider."});
  }
}
