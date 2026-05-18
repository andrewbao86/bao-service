# Bao Service Website

Next.js marketing site for [baoservice.net](https://baoservice.net), deployed on **Firebase App Hosting**.

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
# Add Firebase keys to .env.local if testing analytics locally
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://baoservice.net`) |
| `LEADS_WEBHOOK_URL` | Optional webhook for contact form submissions |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config (public; see `.env.example`) |

Production values for App Hosting are defined in `apphosting.yaml`. Override secrets in the [Firebase console](https://console.firebase.google.com/project/bao-service/apphosting).

## Firebase App Hosting

Repository: [github.com/andrewbao86/bao-service](https://github.com/andrewbao86/bao-service)

1. In Firebase console → **App Hosting** → create backend `bao-service-web` (or link existing).
2. Connect the GitHub repo `andrewbao86/bao-service` (branch `main` or `master`).
3. Root directory: `/` — build command: `npm run build` (auto-detected for Next.js).
4. Set `LEADS_WEBHOOK_URL` in App Hosting environment if using the contact form webhook.

CLI deploy (optional):

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only apphosting
```

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
