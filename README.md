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
| `LEADS_WEBHOOK_URL` | Google Apps Script `/exec` URL — forwards modal leads to Google Sheets (see below) |
| `NEXT_PUBLIC_FIREBASE_*` | Optional Firebase Analytics (see `.env.example`) |

## AWS Amplify

Repository: [github.com/andrewbao86/bao-service](https://github.com/andrewbao86/bao-service)

1. [Amplify console](https://console.aws.amazon.com/amplify/) → **Create new app** → **Host web app**.
2. Connect **GitHub** → `andrewbao86/bao-service`, branch **`main`**.
3. Build settings: use **`amplify.yml`** at repo root (already configured for Next.js SSR).
4. **Framework preset:** Next.js - SSR (Amplify should detect this from `amplify.yml`).
5. Add environment variables (table above), then deploy.
6. Attach custom domain `baoservice.net` under **Domain management** when ready.

Build uses `npm run build:amplify` (webpack) on Amplify to avoid known Next.js 16 Turbopack bundling issues.

## Google Sheets leads (contact modal)

Modal submissions (`Get Started`, `Book 30-Min Consultation`) POST to `/api/leads`, validate server-side, then forward JSON to `LEADS_WEBHOOK_URL`.

### 1. Google Sheet + Apps Script

1. Create a sheet with row 1 headers: **Timestamp | Name | Email | Phone | Message | Locale | Need**
2. Copy the script from [`docs/google-apps-script/leads-webhook.gs`](docs/google-apps-script/leads-webhook.gs) into **Extensions → Apps Script**
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the **/exec** deployment URL (keep it out of git)

Opening the URL in a browser may show `doGet` output (`Leads webhook ready`) or an error if only `doPost` exists — the site uses **POST**, not browser GET.

### 2. Test the webhook (POST)

```bash
curl -L -X POST "YOUR_APPS_SCRIPT_EXEC_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","message":"Hello","locale":"en","need":"","createdAt":"2026-01-01T00:00:00.000Z"}'
```

A new row should appear in the sheet.

### 3. AWS Amplify

In **Amplify console → Hosting → Environment variables** (branch `main`):

| Variable | Value |
|----------|--------|
| `LEADS_WEBHOOK_URL` | Your Apps Script `/exec` URL |

Save and **redeploy**. Without this variable, production accepts submissions but does not store them anywhere.

Local dev: set `LEADS_WEBHOOK_URL` in `.env.local` (same URL) and run `npm run dev`.

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
