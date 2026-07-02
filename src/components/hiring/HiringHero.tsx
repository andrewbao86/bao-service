"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { HiringHeroUpdates } from "./HiringHeroUpdates";
import { HiringMissionBackground } from "./HiringMissionBackground";

type HiringHeroProps = {
  onStudyClick: () => void;
  onPitchClick: () => void;
};

export function HiringHero({ onStudyClick, onPitchClick }: HiringHeroProps) {
  const t = useTranslations("hiring");
  const reduced = usePrefersReducedMotion();

  const lines = [t("heroLine1"), t("heroLine2"), t("heroLine3")];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-900 via-brand-900 to-slate-900 text-white">
      <HiringMissionBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 md:py-36 lg:py-40">
        <div className="max-w-3xl lg:max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-300/90">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-6 max-w-4xl">
            {lines.map((line, i) => (
              <motion.span
                key={`hero-line-${i}`}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`block text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl ${
                  i === 1 ? "text-teal-300" : ""
                }`}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {t("heroSub")}
          </p>
          <div className="mt-6 max-w-xs lg:absolute lg:right-4 lg:top-1/2 lg:z-20 lg:mt-0 lg:w-56 lg:-translate-y-1/2 sm:right-6 xl:right-8 xl:w-60">
            <HiringHeroUpdates className="w-full" />
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" onClick={onStudyClick}>
              {t("heroStudyCta")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/10"
              onClick={onPitchClick}
            >
              {t("heroPitchCta")}
            </Button>
          </div>
          <button
            type="button"
            onClick={onStudyClick}
            className="mt-16 flex items-center gap-2 text-sm text-slate-400 hover:text-teal-300 transition-colors"
            aria-label={t("heroStudyCta")}
          >
            <ChevronDown className="h-5 w-5 animate-bounce max-md:animate-none" />
          </button>
        </div>
      </div>
    </section>
  );
}
