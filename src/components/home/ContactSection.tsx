"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export function ContactSection({ onGetStarted }: { onGetStarted: () => void }) {
  const t = useTranslations("home");
  const tCta = useTranslations("cta");

  return (
    <section id="contact" className={cn("py-20 md:py-28", section.dark)}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{t("contactTitle")}</h2>
        <p className={cn(text.onDarkMuted, "mt-4 text-base md:text-lg leading-relaxed")}>{t("contactSub")}</p>
        <div className="mt-8 flex flex-col gap-6 bg-white shadow-lg rounded-2xl p-8 text-center">
          <Button size="lg" className="w-full" onClick={onGetStarted}>
            {tCta("book30Min")}
          </Button>
          <a
            href={whatsappLink(WHATSAPP_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
            data-event="wa_click"
            data-loc="contact_form"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full hover:scale-105 transition-all duration-300 text-slate-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {tCta("bookConsultation")}
            </Button>
          </a>
        </div>
        <div className={cn("mt-6 text-sm space-y-2", text.onDarkMuted)}>
          <p>✔ {t("contactTrust1")}</p>
          <p>✔ {t("contactTrust2")}</p>
          <p>✔ {t("contactTrust3")}</p>
        </div>
      </div>
    </section>
  );
}
