"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { hiringFaqKeys } from "@/lib/content/hiring";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function HiringFaq() {
  const t = useTranslations("hiring.faq");
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<string | null>("faq1");

  return (
    <ScrollReveal>
      <section className={cn("py-20 md:py-28", section.alt)}>
        <div className="mx-auto max-w-3xl px-4">
          <h2 className={cn("text-3xl font-bold md:text-4xl", text.heading)}>{t("title")}</h2>
          <div className="mt-8 divide-y divide-slate-200/80">
            {hiringFaqKeys.map((key) => {
              const isOpen = open === key;
              return (
                <div key={key} className={cn(isOpen && "border-l-2 border-teal-500 pl-4 -ml-4")}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-900">{t(`${key}.q`)}</span>
                    <ChevronDown
                      className={cn("h-5 w-5 shrink-0 text-slate-500 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-slate-600 leading-relaxed">{t(`${key}.a`)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
