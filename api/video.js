const ENDPOINT = process.env.VIDEO_API_URL || "";
const KEY = process.env.VIDEO_API_KEY || "";
const MODEL = process.env.VIDEO_MODEL || "";

function findUrl(data) {
  return data?.url || data?.video_url || data?.output?.url ||
    data?.output?.video_url || data?.data?.[0]?.url ||
    data?.result?.url || data?.result?.video_url || "";
}

export default async function handler(req,res) {
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  if(!ENDPOINT || !KEY) return res.status(503).json({
    error:"Video generation is not configured. Set VIDEO_API_URL, VIDEO_API_KEY and optionally VIDEO_MODEL."
  });
  const prompt=String(req.body?.prompt||"").trim();
  if(!prompt) return res.status(400).json({error:"Video prompt is required."});

  try {
    const upstream=await fetch(ENDPOINT,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({model:MODEL,prompt})
    });
    const text=await upstream.text();
    let data; try{data=JSON.parse(text)}catch{data={error:text}};
    if(!upstream.ok) return res.status(upstream.status).json({
      error:data?.error?.message||data?.error||`Video provider HTTP ${upstream.status}`
    });
    const url=findUrl(data);
    if(!url) return res.status(502).json({
      error:"Video provider responded without a video URL. Adapt api/video.js to the provider response format."
    });
    return res.status(200).json({url});
  } catch(e) {
    return res.status(502).json({error:e?.message||"Unable to reach video provider."});
  }
}
