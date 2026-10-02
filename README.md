# Yasir Portfolio (Vite + React, Vercel)

- Chat AI: model `minimax/minimax-m3:free` (xKiro, free, vision, reasoning). Dipanggil server-side lewat `middleware.js` (POST /chat), tanpa folder/URL api.
- Persona: "Yasir AI" (lihat SYSTEM_PROMPT di `middleware.js`).
- Video generation: tidak ada di xKiro (hanya teks, suara, gambar), jadi fitur video dihapus.

## Deploy
1. Push ke GitHub, import di Vercel.
2. Tambahkan env `XKIRO_API_KEY`, lalu Deploy.
