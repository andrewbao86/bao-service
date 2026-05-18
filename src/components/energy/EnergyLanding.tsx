"use client";

import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EnergyEvidenceSection } from "./EnergyEvidenceSection";
import { EnergyFreeReportSection } from "./EnergyFreeReportSection";
import { EnergyProcessSection } from "./EnergyProcessSection";
import { EnergyServiceHero } from "./EnergyServiceHero";
import { EnergyTariffCallout } from "./EnergyTariffCallout";

function EnergyDemoSectionFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16" aria-hidden>
      <div className="min-h-[28rem] animate-pulse rounded-2xl bg-slate-200/80" />
    </div>
  );
}

const EnergyDemoSection = dynamic(
  () => import("./EnergyDemoSection").then((m) => m.EnergyDemoSection),
  { loading: () => <EnergyDemoSectionFallback /> }
);

export function EnergyLanding() {
  return (
    <div className="pb-8">
      <EnergyServiceHero />
      <EnergyTariffCallout />
      <ScrollReveal>
        <EnergyProcessSection />
      </ScrollReveal>
      <ScrollReveal>
        <EnergyEvidenceSection />
      </ScrollReveal>
      <ScrollReveal>
        <EnergyDemoSection />
      </ScrollReveal>
      <ScrollReveal>
        <EnergyFreeReportSection />
      </ScrollReveal>
    </div>
  );
}
