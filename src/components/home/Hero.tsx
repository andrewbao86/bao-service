"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroHighlights } from "@/lib/content/heroHighlights";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { heroGradient } from "@/lib/ui-classes";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/routing";

const needChips: { param: string; key: string }[] = [
  { param: "switchgear", key: "switchgear" },
  { param: "transformers", key: "transformers" },
  { param: "motor-control", key: "motorControl" },
  { param: "power-meters", key: "powerMeters" },
  { param: "protection-relays", key: "protectionRelays" },
  { param: "other-equipment", key: "other" },
];

type HeroProps = {
  locale: Locale;
  onGetStarted: () => void;
};

export function Hero({ locale, onGetStarted }: HeroProps) {
  const t = useTranslations("home");
  const te = useTranslations("home.equipment");
  const tCta = useTranslations("cta");
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % heroHighlights.length);
        setExiting(false);
      }, 150);
    }, 1600);
    return () => clearInterval(interval);
  }, [reduced]);

  const highlight = heroHighlights[index % heroHighlights.length];

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className={`absolute inset-0 -z-10 ${heroGradient}`} aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-28 md:py-32 lg:py-36 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">{t("heroTitle")}</h1>
          <div className="mt-4 text-2xl font-semibold flex items-center justify-start">
            <div className="inline-block font-bold text-accent-highlight overflow-hidden h-8 flex items-center">
              <span
                className={`inline-block transition-all duration-300 ease-out ${
                  exiting ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                {highlight}.
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-100/90">{t("heroSub")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onGetStarted}>
              {tCta("getMyQuote")}
            </Button>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noreferrer"
              data-event="wa_click"
              data-loc="hero_secondary"
            >
              <Button size="lg" variant="whatsapp">
                <MessageCircle className="w-4 h-4 mr-2" />
                {tCta("whatsappChat")}
              </Button>
            </a>
          </div>
          <div className="mt-6">
            <div className="text-sm uppercase tracking-wide text-slate-100/80 mb-3">{t("needToday")}</div>
            <div className="flex flex-wrap gap-2">
              {needChips.map(({ param, key }) => (
                <Link
                  key={param}
                  href={`/${locale}?need=${param}#contact`}
                  className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
                  data-need={param}
                >
                  {te(key)}
                </Link>
              ))}
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-3 text-xs text-slate-100/90">
            <li className="px-2 py-1 rounded bg-white/10 border border-white/10">{t("trust1")}</li>
            <li className="px-2 py-1 rounded bg-white/10 border border-white/10">{t("trust2")}</li>
            <li className="px-2 py-1 rounded bg-white/10 border border-white/10">{t("trust3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
