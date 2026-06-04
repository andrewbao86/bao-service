const LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  contribution: 5000,
  valuePitch: 5000,
  proof: 5000,
  first30DaysIdea: 5000,
  cvLink: 500,
  portfolioLink: 500,
  sourcePage: 200,
  utmSource: 120,
  utmMedium: 120,
  utmCampaign: 120,
  referrer: 500,
  locale: 8,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;
const ALLOWED_LOCALES = new Set(["en", "zh", "ms"]);

export const HIRING_DIRECTIONS = [
  "electrical",
  "energy",
  "project-management",
  "multiple",
  "other",
] as const;

export const HIRING_STUDIED_MOST = [
  "electrical",
  "energy",
  "project-management",
  "multiple",
  "not-studied",
] as const;

export const HIRING_ENGAGEMENT = [
  "full-time",
  "part-time",
  "freelance",
  "commission",
  "internship",
  "partnership",
  "open",
] as const;

export type HiringDirection = (typeof HIRING_DIRECTIONS)[number];
export type HiringStudiedMost = (typeof HIRING_STUDIED_MOST)[number];
export type HiringEngagement = (typeof HIRING_ENGAGEMENT)[number];

export type HiringPayload = {
  name: string;
  email: string;
  phone: string;
  locale: string;
  direction: HiringDirection;
  contribution: string;
  valuePitch: string;
  proof: string;
  first30DaysIdea: string;
  preferredEngagement: HiringEngagement;
  cvLink: string;
  portfolioLink: string;
  studiedMostClosely: HiringStudiedMost;
  studiedSolutions: string[];
  cvAccessReminderAccepted: boolean;
  privacyConsentAccepted: boolean;
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingLocale: string;
  website: string;
  turnstileToken?: string;
  createdAt: string;
};

function trimString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEnum<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value);
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, 40))
    .slice(0, 10);
}

export function buildHiringWebhookPayload(payload: HiringPayload) {
  const {
    website: _website,
    turnstileToken: _turnstileToken,
    ...fields
  } = payload;
  void _website;
  void _turnstileToken;
  return { need: "hiring" as const, submissionType: "hiring" as const, ...fields };
}

export function parseHiringPayload(body: unknown): HiringPayload | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const raw = body as Record<string, unknown>;

  if (trimString(raw.website, 200)) return null;

  const name = trimString(raw.name, LIMITS.name);
  const email = trimString(raw.email, LIMITS.email);
  const phone = trimString(raw.phone, LIMITS.phone);
  const direction = trimString(raw.direction, 40);
  const contribution = trimString(raw.contribution, LIMITS.contribution);
  const valuePitch = trimString(raw.valuePitch, LIMITS.valuePitch);
  const proof = trimString(raw.proof, LIMITS.proof);
  const first30DaysIdea = trimString(raw.first30DaysIdea, LIMITS.first30DaysIdea);
  const preferredEngagement = trimString(raw.preferredEngagement, 40);
  const cvLink = trimString(raw.cvLink, LIMITS.cvLink);
  const portfolioLink = trimString(raw.portfolioLink, LIMITS.portfolioLink);
  const studiedMostClosely = trimString(raw.studiedMostClosely, 40);

  if (!name || !email || !EMAIL_RE.test(email)) return null;
  if (!contribution || !valuePitch || !proof || !first30DaysIdea) return null;
  if (!isEnum(direction, HIRING_DIRECTIONS)) return null;
  if (!isEnum(studiedMostClosely, HIRING_STUDIED_MOST)) return null;
  if (!isEnum(preferredEngagement, HIRING_ENGAGEMENT)) return null;
  if (!URL_RE.test(cvLink)) return null;
  if (portfolioLink && !URL_RE.test(portfolioLink)) return null;

  if (raw.cvAccessReminderAccepted !== true) return null;
  if (raw.privacyConsentAccepted !== true) return null;

  const localeRaw = trimString(raw.locale ?? raw.landingLocale, LIMITS.locale);
  const locale = ALLOWED_LOCALES.has(localeRaw) ? localeRaw : "en";

  const createdAt =
    typeof raw.createdAt === "string" && !Number.isNaN(Date.parse(raw.createdAt))
      ? new Date(raw.createdAt).toISOString()
      : new Date().toISOString();

  return {
    name,
    email,
    phone,
    locale,
    direction,
    contribution,
    valuePitch,
    proof,
    first30DaysIdea,
    preferredEngagement,
    cvLink,
    portfolioLink,
    studiedMostClosely,
    studiedSolutions: parseStringArray(raw.studiedSolutions),
    cvAccessReminderAccepted: true,
    privacyConsentAccepted: true,
    sourcePage: trimString(raw.sourcePage, LIMITS.sourcePage),
    utmSource: trimString(raw.utmSource, LIMITS.utmSource),
    utmMedium: trimString(raw.utmMedium, LIMITS.utmMedium),
    utmCampaign: trimString(raw.utmCampaign, LIMITS.utmCampaign),
    referrer: trimString(raw.referrer, LIMITS.referrer),
    landingLocale: trimString(raw.landingLocale, LIMITS.locale) || locale,
    website: "",
    turnstileToken: typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined,
    createdAt,
  };
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}
