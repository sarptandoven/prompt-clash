# Godot-Kontext Character Generator

Powerful local server designed to connect your Godot Engine (lora the explorer - evolits) directly with the Flux Kontext Pro image generation API. It provides a simple yet advanced interface for generating character sprites, textures, and assets on-the-fly. By running this server locally, you can send prompts and parameters from your Godot game via HTTP requests and receive high-quality images in real-time, enabling dynamic and procedural content creation for your game characters and environments.

---
## ⚡ Quick Start

```bash
# 1. clone & install
pnpm i # or npm i / yarn

# 2. copy env variables
cp env.example .env.local
# fill in the values described below

# 3. generate Prisma client
npx prisma generate

# 4. run locally
npm run dev
```

Open http://localhost:3000 – sign-in with Google, finish onboarding and battle!

---
##  🔑 Environment variables (`.env.local`)
| key | source | description |
|-----|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | **anon** public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | service role key (used only in server routes) |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (include `?sslmode=require`) | postgres connection for Prisma |
| `REPLICATE_API_TOKEN` | https://replicate.com/account | personal token |
| `NEXT_PUBLIC_APP_URL` | e.g. `https://promptclash.vercel.app` | used for OAuth redirect |

---
## 🗄 Supabase setup (5 min)
1. Create new project → enable **Google** provider.
2. SQL editor → run `prisma/schema.prisma` or paste the SQL from it to create the two tables (`User`, `Battle`). *(Prisma migrations can also be used but this is fastest).*  
3. **Storage › Buckets** → create a bucket named `selfies` and make it **Public**.

---
## 🤖 Replicate setup  (1 min)
1. Grab your API token from [replicate.com/account](https://replicate.com/account).  
2. Add it to `.env.local`.

No model deployment is needed – the code calls:
- `blackforestlabs/flux-kontext` for avatar generation.
- `laion/clip-vit-large-patch14` for scoring.

---
## 🚀 Deploy on Vercel (3 min)
1. Push this repo to GitHub.
2. In Vercel, **New Project** → import the repo.
3. Add the **same env vars** on the *Environment Variables* tab.
4. Hit **Deploy** – done!

---
## 🏗 Tech Stack
- **Next.js 14** (App Router, React server components)
- **shadcn/ui** + **Tailwind CSS** for styling
- **Supabase** for auth (Google OAuth), Postgres, and Storage
- **Prisma** ORM (connected to Supabase's Postgres)
- **Replicate** hosted ML models (Flux Kontext & CLIP)

---
## ✨ Feature Overview
| path | purpose |
|------|---------|
| `/` | Landing – single *"Sign in with Google"* button |
| `/onboard` | 2-step flow: upload selfie, type *Ability Prompt*, generate avatar |
| `/dashboard` | shows your avatar · *Battle Now* button |
| `/leaderboard` | Top 10 gladiators sorted by Elo |
| `/battle/[id]` | Arena banner + two avatars, scores & winner badge |

Serverless routes live under `app/api/*`:
* `save-avatar` – persists avatar & ability to DB
* `battle` – full battle pipeline (pick opponent, CLIP scoring, Elo update)

---
## 🧩 Folder Structure (important bits)
```txt
src/
  app/
    [routes]
  components/
    AvatarCard.tsx
  utils/
    elo.ts  replicate.ts  supabase-*.ts  cn.ts
  lib/
    prisma.ts
prisma/
  schema.prisma
```

Feel free to PR/issue for improvements – this is an MVP built in ±1 hour ⚡
