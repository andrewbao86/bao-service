import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { termsSections } from "@/lib/content/legal";
import { EMAIL, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t("termsTitle")} | Bao Service`,
    alternates: { canonical: `${SITE_URL}/${locale}/terms` },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPageLayout locale={locale as Locale} title={t("termsTitle")} lastUpdated={t("lastUpdated")}>
      <p>By accessing and using this website, you agree to these Terms. If you do not agree, please do not use the site.</p>
      {termsSections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <h2>Contact</h2>
      <p>
        For questions about these Terms, contact <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPageLayout>
  );
}
