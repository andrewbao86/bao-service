"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Factory, Server, Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/content/caseStudies";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { section, surface, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

const caseStudyButtonClass =
  "h-12 w-full px-6 text-base font-semibold sm:w-auto md:h-14 md:px-8 md:text-lg";

const industries = [
  { key: "oilGas" as const, icon: Factory },
  { key: "substation" as const, icon: Zap },
  { key: "water" as const, icon: Droplets },
  { key: "dataCenter" as const, icon: Server },
];

export function ServicesProjectsSection() {
  const locale = useLocale();
  const t = useTranslations("home");
  const ti = useTranslations("home.industries");
  const tCta = useTranslations("cta");

  return (
    <section id="services-projects" className={cn("py-20 md:py-28", section.alt)}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={cn("text-3xl md:text-4xl font-semibold mb-6", text.heading)}>{t("industriesTitle")}</h2>
        <p className={cn("text-base md:text-lg leading-relaxed mb-12 max-w-3xl", text.body)}>{t("industriesSub")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {industries.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className={cn(surface.card, surface.cardHover, "p-6 text-center hover:scale-105")}
            >
              <Icon className="w-8 h-8 mx-auto mb-3 text-brand-500" />
              <h3 className={cn("font-semibold", text.heading)}>{ti(key)}</h3>
            </div>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {caseStudies.map((cs) => (
            <article
              key={cs.id}
              className={cn(surface.card, surface.cardHover, "overflow-hidden hover:scale-105")}
            >
              <div className="relative h-48 w-full">
                <Image src={cs.image} alt={cs.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-5">
                <h3 className={cn("text-xl font-semibold mb-2", text.heading)}>{cs.title}</h3>
                <p className={cn("text-sm leading-relaxed", text.body)}>{cs.description}</p>
                <div className="mt-6">
                  {cs.href ? (
                    <Link href={`/${locale}${cs.href}`} className="inline-block w-full sm:w-auto">
                      <Button className={caseStudyButtonClass}>{tCta("knowMoreDetails")}</Button>
                    </Link>
                  ) : (
                    <a
                      href={whatsappLink(WHATSAPP_MESSAGES.project(cs.title))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto"
                    >
                      <Button className={caseStudyButtonClass}>{tCta("requestSupport")}</Button>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
