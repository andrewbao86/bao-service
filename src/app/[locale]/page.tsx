import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/home/HomePage";
import { SITE_URL } from "@/lib/constants";
import { routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      images: [{ url: `${SITE_URL}/ai/hero.jpg` }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}`])),
    },
  };
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage locale={locale as Locale} />;
}
