"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { hiringStudyLinks } from "@/lib/content/hiring";
import { getStudiedSolutions, markStudied, type StudiedSolutionKey } from "@/lib/hiring/tracking";
import { cn } from "@/lib/utils";

type HiringProgressChipsProps = {
  locale: Locale;
};

export function HiringProgressChips({ locale }: HiringProgressChipsProps) {
  const t = useTranslations("hiring.chips");
  const [visited, setVisited] = useState<StudiedSolutionKey[]>([]);

  const refresh = useCallback(() => setVisited(getStudiedSolutions()), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => refresh());
    window.addEventListener("hiring-studied-changed", refresh);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hiring-studied-changed", refresh);
    };
  }, [refresh]);

  const ready = visited.length > 0;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-300">{t("label")}</p>
      <div className="flex flex-wrap gap-2">
        {hiringStudyLinks.map(({ key, href }) => {
          const isVisited = visited.includes(key);
          return (
            <Link
              key={key}
              href={href(locale)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markStudied(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isVisited
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-200 ring-1 ring-white/10 hover:bg-slate-700"
              )}
            >
              {isVisited ? <Check className="h-4 w-4" aria-hidden /> : null}
              {t(key)}
            </Link>
          );
        })}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium",
            ready ? "ready-pitch-chip" : "bg-slate-800/50 text-slate-500 ring-1 ring-white/5"
          )}
        >
          {t("ready")}
        </span>
      </div>
    </div>
  );
}
