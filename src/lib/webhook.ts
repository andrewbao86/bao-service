const WEBHOOK_TIMEOUT_MS = 10_000;

export type WebhookDebugInfo = {
  stage: "skipped" | "fetch_error" | "http_error" | "non_json" | "app_error" | "ok";
  webhookConfigured: boolean;
  webhookHint?: string;
  httpStatus?: number;
  gsOk?: boolean;
  gsError?: string;
  routed?: string;
  responsePreview?: string;
  durationMs?: number;
};

export type WebhookSubmitResult =
  | { success: true; routed?: string; debug: WebhookDebugInfo }
  | { success: false; debug: WebhookDebugInfo };

type GsWebhookBody = {
  ok?: boolean;
  error?: string;
  routed?: string;
};

export function isWebhookDebugEnabled(): boolean {
  const value = process.env.WEBHOOK_DEBUG?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

/** Safe identifier for logs/responses — host + last 12 chars of deployment path. */
export function webhookUrlHint(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname}…${pathname.slice(-12)}`;
  } catch {
    return "(invalid-url)";
  }
}

function previewText(text: string, max = 240): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

function logWebhookEvent(label: string, debug: WebhookDebugInfo): void {
  console.info(`[webhook:${label}]`, JSON.stringify(debug));
}

export async function submitViaWebhook(
  label: "leads" | "hiring",
  webhook: string | undefined,
  payload: object
): Promise<WebhookSubmitResult> {
  const started = Date.now();

  if (!webhook?.trim()) {
    const debug: WebhookDebugInfo = {
      stage: "skipped",
      webhookConfigured: false,
      durationMs: Date.now() - started,
    };
    logWebhookEvent(label, debug);
    return { success: false, debug };
  }

  const webhookHint = webhookUrlHint(webhook);
  const body = JSON.stringify(payload);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      signal: controller.signal,
      redirect: "follow",
    });

    const responseText = await res.text().catch(() => "");
    const durationMs = Date.now() - started;

    if (!res.ok) {
      const debug: WebhookDebugInfo = {
        stage: "http_error",
        webhookConfigured: true,
        webhookHint,
        httpStatus: res.status,
        responsePreview: previewText(responseText),
        durationMs,
      };
      logWebhookEvent(label, debug);
      return { success: false, debug };
    }

    let parsed: GsWebhookBody | null = null;
    try {
      parsed = responseText ? (JSON.parse(responseText) as GsWebhookBody) : null;
    } catch {
      const debug: WebhookDebugInfo = {
        stage: "non_json",
        webhookConfigured: true,
        webhookHint,
        httpStatus: res.status,
        responsePreview: previewText(responseText),
        durationMs,
      };
      logWebhookEvent(label, debug);
      return { success: false, debug };
    }

    if (parsed && parsed.ok === false) {
      const debug: WebhookDebugInfo = {
        stage: "app_error",
        webhookConfigured: true,
        webhookHint,
        httpStatus: res.status,
        gsOk: false,
        gsError: typeof parsed.error === "string" ? parsed.error : "unknown",
        routed: typeof parsed.routed === "string" ? parsed.routed : undefined,
        durationMs,
      };
      logWebhookEvent(label, debug);
      return { success: false, debug };
    }

    const debug: WebhookDebugInfo = {
      stage: "ok",
      webhookConfigured: true,
      webhookHint,
      httpStatus: res.status,
      gsOk: parsed?.ok ?? true,
      routed: typeof parsed?.routed === "string" ? parsed.routed : undefined,
      durationMs,
    };
    logWebhookEvent(label, debug);
    return { success: true, routed: debug.routed, debug };
  } catch (err) {
    const debug: WebhookDebugInfo = {
      stage: "fetch_error",
      webhookConfigured: true,
      webhookHint,
      gsError: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - started,
    };
    logWebhookEvent(label, debug);
    return { success: false, debug };
  } finally {
    clearTimeout(timeout);
  }
}

/** @deprecated Use submitViaWebhook — kept for any direct callers. */
export async function forwardToWebhook(webhook: string, payload: object): Promise<Response> {
  const result = await submitViaWebhook("leads", webhook, payload);
  const status = result.success ? 200 : 502;
  const body = result.success
    ? JSON.stringify({ ok: true, routed: result.routed })
    : JSON.stringify({ ok: false, error: result.debug.gsError ?? result.debug.stage });
  return new Response(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
