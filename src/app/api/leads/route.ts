import { after, NextResponse } from "next/server";
import { parseLeadPayload } from "@/lib/leads";
import { isWebhookDebugEnabled, submitViaWebhook } from "@/lib/webhook";
import { webhookFailureResponse, webhookSuccessResponse } from "@/lib/webhook-response";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;

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
  const webhookConfigured = Boolean(webhook?.trim());

  if (!webhookConfigured) {
    if (!isWebhookDebugEnabled()) {
      if (process.env.NODE_ENV === "development") {
        console.info("[leads] no webhook — dev-only accept", JSON.stringify(payload));
        return NextResponse.json({ ok: true });
      }
      console.error("[leads] LEADS_WEBHOOK_URL missing in production — row not saved");
    }

    const result = await submitViaWebhook("leads", webhook, payload);
    if (!result.success) {
      return webhookFailureResponse("leads", result);
    }

    return webhookSuccessResponse(result);
  }

  after(async () => {
    const result = await submitViaWebhook("leads", webhook, payload);
    if (!result.success) {
      console.error("[leads] background webhook failed", JSON.stringify(result.debug));
    }
  });

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
