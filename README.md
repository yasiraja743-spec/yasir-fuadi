# Yasir Portfolio

A custom React/Vite portfolio with a bold neubrutalist visual system and two original browser games.

## Included
- Responsive portfolio
- Intro animation
- Hamburger navigation
- Original Block Blast-style puzzle implemented from scratch
- Original canvas space shooter implemented from scratch
- Projects and tools pages
- Chat UI
- Vercel-ready static frontend
- `.env.example` for server-side secrets

## Important
The frontend does not contain API keys. If you connect xKiro or a TikTok provider, put credentials in Vercel Environment Variables and implement the provider call server-side.

No copyrighted game sprites/assets are included.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy
Import the repository into Vercel and deploy. Add secrets through Vercel Project Settings → Environment Variables.

The current frontend is intentionally free of public `/api/*` routes.
