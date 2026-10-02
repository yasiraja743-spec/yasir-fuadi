# Yasir Portfolio

React + Vite portfolio with a clean neubrutalist look, a small canvas-style AI chat surface, original games, projects and tools.

## Included

- Intro screen + responsive mobile navigation
- `/chat` AI chat powered by xKiro through a server-side Vercel Routing Middleware handler
- `/games/block-blast` — 10×10 Block Blast-style placement puzzle with 3-piece tray, line clearing, score and best score
- `/games/space-shooter` — original canvas shooter with keyboard, touch buttons and drag-to-move controls
- `/projects` — AM Premium, Telegram Bot and original games
- `/tools/tiktok` — downloader UI ready for a provider integration
- No copyrighted game sprites or external game engine
- No public `/api/*` route is used for the AI chat

## Environment variable

Set this in Vercel Project Settings → Environment Variables:

```env
XKIRO_API_KEY=your_real_xkiro_key
```

The browser only calls `POST /chat`. The xKiro key is read server-side from `XKIRO_API_KEY` and is never placed in the React bundle.

## Deploy

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add `XKIRO_API_KEY` to the Production/Preview environments you want.
4. Redeploy after adding or changing the variable.

Vercel's Routing Middleware handles the `/chat` POST and forwards the request to xKiro. The Vite frontend keeps the clean page routes through `vercel.json` rewrites.
