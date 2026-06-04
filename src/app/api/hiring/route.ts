import { NextResponse } from "next/server";
import { buildHiringWebhookPayload, parseHiringPayload, verifyTurnstileToken } from "@/lib/hiring";
import { getClientIp, isRateLimited, recordRateLimitHit } from "@/lib/rate-limit";
import { forwardToWebhook } from "@/lib/webhook";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 24_576;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    body = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = parseHiringPayload(body);
  if (!payload) {
    if (body && typeof body === "object" && !Array.isArray(body)) {
      const honeypot = (body as Record<string, unknown>).website;
      if (typeof honeypot === "string" && honeypot.trim()) {
        return NextResponse.json({ ok: true });
      }
    }
    return NextResponse.json({ error: "Invalid hiring data" }, { status: 400 });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = payload.turnstileToken;
    if (!token || !(await verifyTurnstileToken(token))) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
  }

  const ip = getClientIp(request);
  const rateKey = `hiring:${ip}:${payload.email.toLowerCase()}`;
  if (isRateLimited(rateKey)) {
    return NextResponse.json({ error: "Too many submissions" }, { status: 429 });
  }

  const webhookPayload = buildHiringWebhookPayload(payload);
  const webhook = process.env.LEADS_WEBHOOK_URL;

  try {
    if (webhook) {
      const res = await forwardToWebhook(webhook, webhookPayload);
      if (!res.ok) throw new Error("webhook failed");
    } else if (process.env.NODE_ENV === "development") {
      console.info("[hiring]", JSON.stringify(webhookPayload));
    }
    recordRateLimitHit(rateKey);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[hiring] webhook error", err);
    }
    return NextResponse.json({ error: "Failed to submit" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
