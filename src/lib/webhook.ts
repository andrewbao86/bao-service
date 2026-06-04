const WEBHOOK_TIMEOUT_MS = 10_000;

export async function forwardToWebhook(webhook: string, payload: object): Promise<Response> {
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
      console.warn("[webhook] non-OK", res.status, await res.text().catch(() => ""));
    }

    return res;
  } finally {
    clearTimeout(timeout);
  }
}
