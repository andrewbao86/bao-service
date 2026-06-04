import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HiringPage } from "@/components/hiring/HiringPage";
import { fetchHiringUpdates } from "@/lib/hiring/updates";
import { SITE_URL } from "@/lib/constants";
import { type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hiring" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/hiring`,
    },
  };
}

export default async function HiringRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialUpdates = await fetchHiringUpdates();
  return <HiringPage locale={locale as Locale} initialUpdates={initialUpdates} />;
}
