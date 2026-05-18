"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { GetStartedModal } from "@/components/shared/GetStartedModal";
import { BrandHero } from "@/components/motion/BrandHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { WhatsAppFab } from "@/components/motion/WhatsAppFab";
import { Button } from "@/components/ui/button";
import { pmChallenges, pmResults, pmServices, pmStats, pmSteps, testimonials } from "@/lib/content/projectManagement";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { section, surface } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function ProjectManagementPage({ locale }: { locale: Locale }) {
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("pm");

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} onGetStarted={() => setModalOpen(true)} linkToHome />
      <PmContent t={t} onGetStarted={() => setModalOpen(true)} />
      <WhatsAppFab />
      <Footer locale={locale} />
      <Suspense fallback={null}>
        <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} locale={locale} />
      </Suspense>
    </main>
  );
}

function PmContent({
  t,
  onGetStarted,
}: {
  t: ReturnType<typeof useTranslations<"pm">>;
  onGetStarted: () => void;
}) {
  const wa = whatsappLink(WHATSAPP_MESSAGES.pm);
  return (
    <div className="pt-16">
      <BrandHero align="center">
        <p className="text-sm uppercase tracking-wider text-slate-100/80">🏗 Project Management Services</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{t("heroTitle")}</h1>
        <p className="mt-2 text-xl text-slate-100/90">{t("heroSub")}</p>
        <p className="mt-6 text-slate-100/80 leading-relaxed">{t("heroBody")}</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted}>
              Book 30-min Consultation
            </Button>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp">
                <MessageCircle className="w-4 h-4 mr-2" />
                Talk to a Project Specialist
              </Button>
            </a>
          </div>
          <div className="mt-8 flex justify-center gap-8">
            {pmStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-slate-200/80">{s.label}</div>
              </div>
            ))}
          </div>
      </BrandHero>

      <ScrollReveal>
      <section className={cn("py-12", section.alt)}>
        <div className="mx-auto max-w-6xl px-4">
          <div className={cn(surface.panel, "p-6")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Project Dashboard</h3>
              <span className="text-xs bg-whatsapp-soft text-whatsapp px-2 py-1 rounded-full font-medium">Live</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Progress", value: "65.9%", delta: "+2.1%" },
                { label: "Critical Issues", value: "5", delta: "-2" },
                { label: "Budget Utilization", value: "86.0%", delta: "+0.5%" },
                { label: "Risk Level", value: "13.5%", delta: "-1.2%" },
              ].map((kpi) => (
                <div key={kpi.label} className={cn(surface.inset, "p-4")}>
                  <div className="text-xs text-slate-500">{kpi.label}</div>
                  <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                  <div className="text-xs text-success mt-1">{kpi.delta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold mb-8">Common Project Challenges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pmChallenges.map((c) => (
              <PmChallengeCard key={c.title} c={c} />
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className={cn("py-16", section.alt)}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold mb-8">What We Do</h2>
          <PmServicesGrid />
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold mb-8">Three-Step Process</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pmSteps.map((s) => (
              <div key={s.step} className={cn(surface.card, "p-6")}>
                <div className="text-brand-600 font-bold text-2xl">{s.step}</div>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className={cn("py-16", section.alt)}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold mb-8">Measurable Results</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {pmResults.map((r) => (
              <div key={r.title} className={cn(surface.card, "p-6")}>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-8">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="border-l-4 border-brand-500 pl-6 py-2">
                <p className="text-slate-700 italic">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm">
                  <strong>{t.name}</strong> — {t.role}, {t.company}, {t.location}
                </footer>
              </blockquote>
            ))}
          </div>
          <video className="mt-12 w-full rounded-xl" controls preload="none" poster="/ai/AT.jpg">
            <source src="/cta.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className={cn("py-16 text-center", section.dark)}>
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-semibold">Ready to Strengthen Your Project Team?</h2>
          <p className="mt-4 text-slate-300">Let&apos;s discuss how we can support your next project — discreetly, professionally, and with measurable results.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted}>
              Book 30-min Consultation
            </Button>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp">
                <MessageCircle className="w-4 h-4 mr-2" />
                Share Your Project Situation
              </Button>
            </a>
          </div>
          <p className="mt-8 text-sm text-slate-400">We don&apos;t replace your team. We reinforce it.</p>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}

function PmChallengeCard({ c }: { c: (typeof pmChallenges)[0] }) {
  return (
    <div className={cn(surface.card, "p-6")}>
      <h3 className="font-semibold">{c.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{c.description}</p>
    </div>
  );
}

function PmServicesGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pmServices.map((s) => (
        <div key={s.title} className={cn(surface.card, "p-6")}>
          <h3 className="font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{s.description}</p>
        </div>
      ))}
    </div>
  );
}

