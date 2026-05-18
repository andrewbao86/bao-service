"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { surface } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

const logos: { src: string; alt: string; imgClass: string }[] = [
  { src: "/logos/SIEMENS.jpg", alt: "Siemens", imgClass: "h-14 w-auto max-w-[150px] md:h-16 md:max-w-[170px]" },
  { src: "/logos/ABB.jpg", alt: "ABB", imgClass: "h-12 w-auto max-w-[100px] md:h-14 md:max-w-[120px]" },
  {
    src: "/logos/SCHNEIDER.png",
    alt: "Schneider Electric",
    imgClass: "h-14 w-auto max-w-[200px] md:h-[4.25rem] md:max-w-[240px]",
  },
  { src: "/logos/IEC.png", alt: "IEC Standards", imgClass: "h-14 w-auto max-w-[72px] md:h-16 md:max-w-[80px]" },
];

export function PartnersSection() {
  const t = useTranslations("home");
  return (
    <div id="partners" className={cn(surface.divider, "bg-section-alt py-16 md:py-20")}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{t("qualityTitle")}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600 max-w-2xl">{t("qualitySub")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {logos.map((l) => (
            <div
              key={l.alt}
              className={cn(
                "flex h-36 items-center justify-center px-6 md:h-40",
                surface.cardMuted,
                surface.cardHover,
                "transition-transform hover:scale-[1.02]"
              )}
            >
              <Image
                src={l.src}
                alt={l.alt}
                width={280}
                height={112}
                className={cn("object-contain object-center", l.imgClass)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
