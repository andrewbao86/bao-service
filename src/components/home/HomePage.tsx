"use client";

import { Suspense, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { GetStartedModal } from "@/components/shared/GetStartedModal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { WhatsAppFab } from "@/components/motion/WhatsAppFab";
import { Hero } from "@/components/home/Hero";
import { ServicesProjectsSection } from "@/components/home/ServicesProjectsSection";
import {
  ProductsCarouselSection,
  ProductsSectionIntro,
} from "@/components/home/ProductsCarouselSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { HowWeDeliverIntro, HowWeDeliverSection } from "@/components/home/HowWeDeliverSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactSection } from "@/components/home/ContactSection";
import type { Locale } from "@/i18n/routing";

export function HomePage({ locale }: { locale: Locale }) {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} onGetStarted={openModal} />
      <div className="pt-16">
        <Hero locale={locale} onGetStarted={openModal} />
        <ScrollReveal>
          <ServicesProjectsSection />
        </ScrollReveal>
        <ScrollReveal className="bg-gradient-to-b from-white to-section-alt">
          <ProductsSectionIntro />
          <ProductsCarouselSection />
          <PartnersSection />
        </ScrollReveal>
        <ScrollReveal className="bg-white">
          <HowWeDeliverIntro />
          <HowWeDeliverSection onGetStarted={openModal} />
        </ScrollReveal>
        <ScrollReveal>
          <FaqSection />
        </ScrollReveal>
        <ScrollReveal variant="subtle">
          <ContactSection onGetStarted={openModal} />
        </ScrollReveal>
      </div>
      <WhatsAppFab />
      <Footer locale={locale} />
      <Suspense fallback={null}>
        <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} locale={locale} />
      </Suspense>
    </main>
  );
}
