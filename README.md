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
npm run dev
```

Local env vars are read from `.env.example` (Amplify / production env vars override when set).

Open [http://localhost:3000/en](http://localhost:3000/en).

## Environment variables

Set these in the **Amplify console** → App → Environment variables (for each branch):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://baoservice.net`) |
| `LEADS_WEBHOOK_URL` | Google Apps Script `/exec` URL — forwards contact modal leads and hiring pitches to Google Sheets (see below) |
| `HIRING_UPDATES_URL` | Optional GET-only Apps Script `/exec` URL — hiring hero bullet carousel (see below) |
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

## Google Sheets (contact modal + hiring page)

Contact modal submissions POST to `/api/leads`. Hiring pitch form submissions POST to `/api/hiring`. Both forward JSON to the same `LEADS_WEBHOOK_URL`.

### 1. Google Sheet + Apps Script

Use **one spreadsheet** with two tabs:

**Leads** (row 1 headers):

`Timestamp | Name | Email | Phone | Message | Locale | Need`

**Hiring** (row 1 headers):

`Timestamp | Name | Email | Phone | Locale | Direction | StudiedMostClosely | StudiedSolutions | PreferredEngagement | Contribution | ValuePitch | Proof | First30DaysIdea | CVLink | PortfolioLink | SourcePage | UtmSource | UtmMedium | UtmCampaign | Referrer | LandingLocale`

Setup:

1. Copy the script from [`docs/google-apps-script/leads-webhook.gs`](docs/google-apps-script/leads-webhook.gs) into **Extensions → Apps Script**
2. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Copy the **/exec** deployment URL (keep it out of git)
4. After any script edit: **Deploy → Manage deployments → Edit → New version → Deploy**

   Saving in the editor alone does **not** update the live web app. If hiring rows still appear on **Leads** (with `need=hiring` in column G and empty Message), the live deployment is still the old script — repeat step 4.

The script routes by `need` / `submissionType`: `hiring` → **Hiring** tab; everything else → **Leads** tab. Cell values starting with `=`, `+`, `-`, or `@` are sanitized. If the **Hiring** tab is missing, the script creates it with headers.

Opening the URL in a browser should mention `isHiringSubmission routing` in the `doGet` message. Submissions use **POST**, not browser GET.

### 2. Test the webhook (POST)

**Lead (contact modal):**

```bash
curl -L -X POST "YOUR_APPS_SCRIPT_EXEC_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","message":"Hello","locale":"en","need":"","createdAt":"2026-01-01T00:00:00.000Z"}'
```

A new row should appear on the **Leads** tab.

**Hiring pitch:**

```bash
curl -L -X POST "YOUR_APPS_SCRIPT_EXEC_URL" \
  -H "Content-Type: application/json" \
  -d '{"need":"hiring","name":"Test","email":"test@example.com","phone":"123","locale":"en","direction":"energy","studiedMostClosely":"energy","studiedSolutions":["energy"],"preferredEngagement":"freelance","contribution":"Help with sales","valuePitch":"10 years experience","proof":"5 accounts closed","first30DaysIdea":"Map 20 factories","cvLink":"https://linkedin.com/in/test","portfolioLink":"","sourcePage":"/en/hiring","landingLocale":"en","createdAt":"2026-01-01T00:00:00.000Z"}'
```

A new row should appear on the **Hiring** tab with one column per field.

### 3. AWS Amplify

In **Amplify console → Hosting → Environment variables** (branch `main`):

| Variable | Value |
|----------|--------|
| `LEADS_WEBHOOK_URL` | Your Apps Script `/exec` URL |

Save and **redeploy**. Without this variable, production accepts submissions but does not store them anywhere.

Local dev: set `LEADS_WEBHOOK_URL` in `.env.example` and run `npm run dev`.

## Hiring hero updates (Google Sheet carousel)

The `/en/hiring` hero shows a rolling bullet carousel fed by a **separate spreadsheet** (not the Leads/Hiring submission sheet).

### 1. Google Sheet

Use either layout on tab **`HiringUpdates`**, **`updates_bullet`**, or the first tab:

**Simple (easiest)** — one bullet per row in column A, no headers:

| A |
|---|
| Test Bullet 1 |
| Test Bullet 2 |

**Structured (optional)** — row 1 headers for sort/active toggles:

| Sort | Active | Text |
|------|--------|------|
| 1 | TRUE | Now hiring: energy sales with factory walkthrough experience |
| 2 | TRUE | Priority: candidates who studied our PM dashboard demo |

- **Sort** — display order (lower first); structured layout only
- **Active** — `TRUE` / `FALSE`; inactive rows are hidden; structured layout only
- **Text** — English bullet copy (shown on all locales)

### 2. Apps Script

1. Copy [`docs/google-apps-script/hiring-updates-feed.gs`](docs/google-apps-script/hiring-updates-feed.gs) into **Extensions → Apps Script** on that spreadsheet
2. **Deploy → New deployment → Web app** (Execute as: **Me**, Who has access: **Anyone**)
3. Copy the **`/exec` URL**
4. After edits: **Deploy → Manage deployments → New version → Deploy**

Test in browser — should return JSON:

```json
{"ok":true,"items":[{"text":"Now hiring: ..."}]}
```

### 3. Environment variable

Set `HIRING_UPDATES_URL` to the `/exec` URL in `.env.example` (local) and **Amplify → Environment variables** (production). Redeploy after changing.

If unset, the carousel shows an empty-state message and the page still works.

## Routes

- `/` → redirects to `/en`
- `/{locale}` — home
- `/{locale}/energy-efficient` — energy monitoring demo
- `/{locale}/project-management` — PM services
- `/{locale}/hiring` — hiring / pitch yourself
- `/{locale}/privacy`, `/{locale}/terms`

Locales: `en`, `zh`, `ms`

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build
npm run lint     # ESLint
npm run check    # lint + build
```
