import { NextResponse } from "next/server";
import type { WebhookDebugInfo, WebhookSubmitResult } from "@/lib/webhook";
import { isWebhookDebugEnabled } from "@/lib/webhook";

/** Safe fields returned on every 502 — no URLs or PII. */
function publicFailureFields(debug: WebhookDebugInfo) {
  return {
    stage: debug.stage,
    webhookConfigured: debug.webhookConfigured,
    ...(debug.httpStatus !== undefined ? { httpStatus: debug.httpStatus } : {}),
    ...(debug.gsError ? { gsError: debug.gsError } : {}),
  };
}

export function webhookFailureResponse(label: "leads" | "hiring", result: WebhookSubmitResult) {
  const debug = result.debug;
  const payload: Record<string, unknown> = {
    error: "Failed to submit",
    ...publicFailureFields(debug),
  };

  if (isWebhookDebugEnabled()) {
    payload.debug = { label, ...debug };
  } else if (debug.stage === "skipped") {
    console.error(`[${label}] LEADS_WEBHOOK_URL is not set at runtime — submission was not forwarded`);
  }

  return NextResponse.json(payload, { status: 502 });
}

export function webhookSuccessResponse(
  result: Extract<WebhookSubmitResult, { success: true }>,
  extra?: Record<string, unknown>
) {
  const payload: Record<string, unknown> = { ok: true, ...extra };

  if (isWebhookDebugEnabled()) {
    payload.debug = result.debug;
  }

  return NextResponse.json(payload);
}
