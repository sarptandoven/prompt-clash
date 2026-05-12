# Prompt Clash

Next.js app for prompt battles: generate prompt ideas with OpenAI, render images with Replicate, and score matchups.

## Quick start

```bash
npm install
cp env.example .env.local
# Fill in OPENAI_API_KEY and REPLICATE_API_TOKEN
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Key | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Used by `/api/generate-prompt` to create prompt variants. |
| `REPLICATE_API_TOKEN` | Yes | Used by `/api/generate` and `/api/score` for image generation/scoring. |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL for local/dev deployments. Defaults to `http://localhost:3000`. |

## Scripts

```bash
npm run dev      # start local Next.js dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # lint, if supported by installed Next.js version
```

## Notes

- Do not commit `.env.local` or real API keys.
- The app currently has no Prisma/Supabase schema in the repository; database setup is not required for the checked-in code path.
