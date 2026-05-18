"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParallaxGridBackground } from "@/components/motion/ParallaxGridBackground";
import { processSteps, strengths } from "@/lib/content/process";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { section, surface, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function HowWeDeliverIntro() {
  const t = useTranslations("home");
  return (
    <div className="pt-20 md:pt-28 pb-8">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className={cn("text-3xl md:text-4xl font-semibold mb-4", text.heading)}>{t("deliverTitle")}</h2>
        <p className={cn("text-lg md:text-xl max-w-3xl mx-auto", text.body)}>{t("deliverSub")}</p>
      </div>
    </div>
  );
}

export function HowWeDeliverSection({ onGetStarted }: { onGetStarted: () => void }) {
  const t = useTranslations("home");
  const tCta = useTranslations("cta");

  return (
    <section id="how-we-deliver" className={cn("relative py-20 md:py-28", section.default)}>
      <ParallaxGridBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mb-14"
        >
          <h3 className={cn("text-2xl font-semibold", text.heading)}>{t("processTitle")}</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {processSteps.map((s) => (
              <div key={s.step} className={cn(surface.card, "p-5 relative overflow-hidden")}>
                <div className="absolute -top-2 -right-2 text-6xl font-black text-slate-100 select-none">{s.step}</div>
                <div className="font-medium text-slate-900">{s.title}</div>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.5, ease: "easeOut" } },
          }}
          className="mt-14"
        >
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">{t("strengthTitle")}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className={cn(surface.card, surface.cardHover, "p-5 hover:scale-105")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100/80 ring-1 ring-slate-900/[0.05]">
                      <Icon className="h-5 w-5 text-slate-700" aria-hidden />
                    </div>
                    <h4 className="font-semibold text-slate-900">{s.title}</h4>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-wrap gap-3"
        >
          <Button size="lg" onClick={onGetStarted}>
            {tCta("getMyQuote")}
          </Button>
          <a href={whatsappLink(WHATSAPP_MESSAGES.general)} target="_blank" rel="noreferrer">
            <Button size="lg" variant="whatsapp">
              <MessageCircle className="w-4 h-4 mr-2" />
              {tCta("bookConsultation")}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
