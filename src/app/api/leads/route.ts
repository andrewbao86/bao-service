import { NextResponse } from "next/server";
import { parseLeadPayload } from "@/lib/leads";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const WEBHOOK_TIMEOUT_MS = 10_000;

async function forwardToWebhook(webhook: string, payload: object): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  const body = JSON.stringify(payload);

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": String(Buffer.byteLength(body)),
      },
      body,
      signal: controller.signal,
      redirect: "follow",
    });

    if (!res.ok && process.env.NODE_ENV === "development") {
      console.warn("[leads] webhook non-OK", res.status, await res.text().catch(() => ""));
    }

    return res;
  } finally {
    clearTimeout(timeout);
  }
}

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

  const payload = parseLeadPayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Invalid lead data" }, { status: 400 });
  }

  const webhook = process.env.LEADS_WEBHOOK_URL;
  try {
    if (webhook) {
      const res = await forwardToWebhook(webhook, payload);
      if (!res.ok) throw new Error("webhook failed");
    } else if (process.env.NODE_ENV === "development") {
      console.info("[leads]", JSON.stringify(payload));
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[leads] webhook error", err);
    }
    return NextResponse.json({ error: "Failed to submit" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
