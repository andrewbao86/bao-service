# Bao Service Website

Next.js marketing site for [baoservice.net](https://baoservice.net), deployed on **AWS Amplify Hosting** (SSR).

## Stack

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS v4
- next-intl (en, zh, ms)
- framer-motion, lucide-react
- Firebase Analytics (optional, via env)

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

## Environment variables

Set these in the **Amplify console** → App → Environment variables (for each branch):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://baoservice.net`) |
| `LEADS_WEBHOOK_URL` | Optional webhook for contact form submissions |
| `NEXT_PUBLIC_FIREBASE_*` | Optional Firebase Analytics (see `.env.example`) |

## AWS Amplify

Repository: [github.com/andrewbao86/bao-service](https://github.com/andrewbao86/bao-service)

1. [Amplify console](https://console.aws.amazon.com/amplify/) → **Create new app** → **Host web app**.
2. Connect **GitHub** → `andrewbao86/bao-service`, branch **`main`**.
3. Build settings: use **`amplify.yml`** at repo root (already configured for Next.js SSR).
4. **Framework preset:** Next.js - SSR (Amplify should detect this from `amplify.yml`).
5. Add environment variables (table above), then deploy.
6. Attach custom domain `baoservice.net` under **Domain management** when ready.

Build uses `npm run build -- --webpack` on Amplify to avoid known Next.js 16 Turbopack bundling issues.

## Routes

- `/` → redirects to `/en`
- `/{locale}` — home
- `/{locale}/energy-efficient` — energy monitoring demo
- `/{locale}/project-management` — PM services
- `/{locale}/privacy`, `/{locale}/terms`

Locales: `en`, `zh`, `ms`

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build
npm run lint     # ESLint
npm run check    # lint + build
```
