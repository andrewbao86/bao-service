const LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  message: 5000,
  need: 100,
  locale: 8,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_LOCALES = new Set(["en", "zh", "ms"]);

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
  need: string;
  createdAt: string;
};

function trimString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const raw = body as Record<string, unknown>;
  const name = trimString(raw.name, LIMITS.name);
  const email = trimString(raw.email, LIMITS.email);
  const phone = trimString(raw.phone, LIMITS.phone);
  const message = trimString(raw.message, LIMITS.message);
  const need = trimString(raw.need, LIMITS.need);
  const localeRaw = trimString(raw.locale, LIMITS.locale);
  const locale = ALLOWED_LOCALES.has(localeRaw) ? localeRaw : "en";

  if (!name || !email || !EMAIL_RE.test(email)) return null;

  const createdAt =
    typeof raw.createdAt === "string" && !Number.isNaN(Date.parse(raw.createdAt))
      ? new Date(raw.createdAt).toISOString()
      : new Date().toISOString();

  return { name, email, phone, message, locale, need, createdAt };
}
