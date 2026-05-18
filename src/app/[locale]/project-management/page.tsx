import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectManagementPage } from "@/components/project-management/ProjectManagementPage";
import { SITE_URL } from "@/lib/constants";
import { type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pm" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/project-management`,
    },
  };
}

export default async function ProjectManagementRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectManagementPage locale={locale as Locale} />;
}
