export type HiringUpdate = {
  text: string;
};

const MAX_ITEMS = 20;
const MAX_TEXT_LENGTH = 280;
const FETCH_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 60;

type UpdatesFeedResponse = {
  ok?: boolean;
  items?: unknown;
};

function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_TEXT_LENGTH);
}

function parseItems(raw: unknown): HiringUpdate[] {
  if (!Array.isArray(raw)) return [];

  const items: HiringUpdate[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const text = sanitizeText((entry as { text?: unknown }).text);
    if (text) items.push({ text });
    if (items.length >= MAX_ITEMS) break;
  }
  return items;
}

export async function fetchHiringUpdates(): Promise<HiringUpdate[]> {
  const url = process.env.HIRING_UPDATES_URL?.trim();
  if (!url) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as UpdatesFeedResponse;
    if (!data.ok) return [];

    return parseItems(data.items);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
