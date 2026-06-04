"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { hiringStudyLinks, type StudyCardId } from "@/lib/content/hiring";
import { markStudied } from "@/lib/hiring/tracking";
import { cn } from "@/lib/utils";

const cardMeta: Record<StudyCardId, { accent: string; glow: string }> = {
  electrical: {
    accent: "border-l-brand-400",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.5)]",
  },
  energy: {
    accent: "border-l-teal-400",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(45,212,191,0.45)]",
  },
  pm: {
    accent: "border-l-amber-400",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.4)]",
  },
};

const studyHrefById = Object.fromEntries(
  hiringStudyLinks.map(({ key, href }) => [key, href])
) as Record<StudyCardId, (locale: Locale) => string>;

type HiringStudyCardProps = {
  id: StudyCardId;
  locale: Locale;
};

export function HiringStudyCard({ id, locale }: HiringStudyCardProps) {
  const t = useTranslations("hiring.studyCards");
  const meta = cardMeta[id];

  function handleClick() {
    markStudied(id);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-sm",
        "border-l-4 transition-all duration-300 max-md:shadow-md",
        "md:hover:-translate-y-1",
        meta.accent,
        meta.glow
      )}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">{t(`${id}.index`)}</p>
      <h3 className="mt-3 text-xl font-bold text-white">{t(`${id}.title`)}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{t(`${id}.description`)}</p>
      <p className="mt-4 text-sm font-medium text-teal-200/90">{t(`${id}.prompt`)}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{t(`${id}.talent`)}</p>
      <Link
        href={studyHrefById[id](locale)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-teal-200"
      >
        {t(`${id}.cta`)}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <span
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-teal-400/60 transition-transform duration-300 group-hover:scale-x-100 max-md:hidden"
        aria-hidden
      />
    </article>
  );
}
