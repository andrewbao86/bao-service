import type { StudiedSolutionKey } from "@/lib/content/hiring";

export type { StudiedSolutionKey };

const STORAGE_KEY = "hiring-tracking";

export type HiringTracking = {
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingLocale: string;
};

export function captureHiringTracking(locale: string): HiringTracking {
  if (typeof window === "undefined") {
    return {
      sourcePage: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      referrer: "",
      landingLocale: locale,
    };
  }

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as HiringTracking;
    } catch {
      /* fall through */
    }
  }

  const params = new URLSearchParams(window.location.search);
  const tracking: HiringTracking = {
    sourcePage: params.get("source") || window.location.pathname,
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    referrer: document.referrer.slice(0, 500),
    landingLocale: locale,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
  return tracking;
}

export const STUDIED_STORAGE_KEYS = {
  electrical: "hiring-studied-electrical",
  energy: "hiring-studied-energy",
  pm: "hiring-studied-pm",
} as const;

export function markStudied(key: StudiedSolutionKey): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDIED_STORAGE_KEYS[key], "1");
  window.dispatchEvent(new CustomEvent("hiring-studied-changed"));
}

export function getStudiedSolutions(): StudiedSolutionKey[] {
  if (typeof window === "undefined") return [];
  return (Object.keys(STUDIED_STORAGE_KEYS) as StudiedSolutionKey[]).filter(
    (k) => localStorage.getItem(STUDIED_STORAGE_KEYS[k]) === "1"
  );
}
