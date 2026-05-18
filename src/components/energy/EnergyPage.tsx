"use client";

import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/motion/WhatsAppFab";
import { whatsappEnergyLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { EnergyLanding } from "./EnergyLanding";
import { useTnbAnalysisMailto } from "./EnergyTnbMailCta";
import type { Locale } from "@/i18n/routing";

export function EnergyPage({ locale }: { locale: Locale }) {
  const t = useTranslations("energy");
  const tnbMailto = useTnbAnalysisMailto();
  const energyWhatsApp = whatsappEnergyLink(WHATSAPP_MESSAGES.energyTnbReport);

  return (
    <main className="min-h-screen">
      <SiteHeader
        locale={locale}
        linkToHome
        getStartedHref={tnbMailto}
        getStartedLabel={t("ctaFreeReport")}
        whatsappHref={energyWhatsApp}
      />
      <div className="pt-16 min-h-screen bg-gradient-to-b from-white to-section-alt">
        <EnergyLanding />
        <OrganizationJsonLd />
        <BreadcrumbJsonLd locale={locale} />
      </div>
      <WhatsAppFab href={energyWhatsApp} />
      <Footer locale={locale} />
    </main>
  );
}

function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bao Service",
    alternateName: "Bao Service Electrical & Automation Solutions",
    url: "https://baoservice.net",
    logo: "https://baoservice.net/logo.svg",
    description:
      "Engineering design, product & material supply, and onsite services for industrial clients in Singapore, Malaysia, and Indonesia.",
    foundingDate: "2009",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SG",
      addressRegion: "Singapore",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+65-8511-9195",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese", "Malay"],
      areaServed: ["SG", "MY", "ID"],
    },
    sameAs: ["https://wa.me/6585119195"],
    areaServed: [
      { "@type": "Country", name: "Singapore", identifier: "SG" },
      { "@type": "Country", name: "Malaysia", identifier: "MY" },
      { "@type": "Country", name: "Indonesia", identifier: "ID" },
    ],
    serviceType: [
      "Electrical Equipment Supply",
      "Industrial Automation",
      "Project Management",
      "Data-driven energy cost reduction and TNB bill analysis",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function BreadcrumbJsonLd({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `/${locale}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Energy Efficiency",
        item: `/${locale}/energy-efficient`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
