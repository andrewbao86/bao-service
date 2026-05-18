import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnergyPage } from "@/components/energy/EnergyPage";
import { SITE_URL } from "@/lib/constants";
import { routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "energy" });
  const path = `/${locale}/energy-efficient`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: [
      "energy efficiency",
      "energy monitoring",
      "peak analysis",
      "Singapore",
      "Malaysia",
      "Indonesia",
      "Bao Service",
    ],
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}/energy-efficient`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}${path}`,
      siteName: "Bao Service",
      locale: locale === "zh" ? "zh_CN" : locale === "ms" ? "ms_MY" : "en_SG",
      images: [
        {
          url: `${SITE_URL}/ai/meters.jpg`,
          width: 1200,
          height: 630,
          alt: t("metaTitle"),
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [`${SITE_URL}/ai/meters.jpg`],
    },
  };
}

export default async function EnergyEfficientPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EnergyPage locale={locale as Locale} />;
}
