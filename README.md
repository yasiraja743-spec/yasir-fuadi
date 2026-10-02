# YASIR Portfolio — Neo-Brutalist AI

This is the Yasir portfolio rebuilt from the supplied portfolio source, with the chat workspace redesigned around the requested Neo-Brutalist look.

## AI features

- Text chat
- Photo upload to the AI/vision model
- Markdown rich text: headings, bold, italic, underline HTML, strikethrough, code, blockquotes, lists, links and tables
- `<name folder>...</name folder>` is parsed from the first AI reply and becomes the browser chat folder name; the tag is never shown in the message
- Per-conversation browser history
- Video generation button and video player/download UI
- API keys remain server-side in Vercel functions

## Provider configuration

Copy `.env.example` to your Vercel environment variables.

### Chat / vision

The default adapter uses:

`https://api.xkiro.com/v1/chat/completions`

with:

`XKIRO_MODEL=minimax/minimax-m3:free`

Set `XKIRO_API_KEY`.

The model/provider must support image input for photo understanding.

### Video

Video APIs differ in authentication, payloads, async jobs and response formats. `api/video.js` is deliberately an adapter.

Set:

- `VIDEO_API_URL`
- `VIDEO_API_KEY`
- `VIDEO_MODEL` (optional)

The adapter sends `{ model, prompt }` and accepts a video URL from common response fields. If the chosen provider uses an asynchronous job flow, edit only `api/video.js` to poll that provider.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
```

Deploy the project to Vercel and add the environment variables in the Vercel project settings.

Do not put API keys in `src/main.jsx` or any public file.
