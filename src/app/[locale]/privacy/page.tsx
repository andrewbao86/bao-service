import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { privacySections } from "@/lib/content/legal";
import { EMAIL, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t("privacyTitle")} | Bao Service`,
    alternates: { canonical: `${SITE_URL}/${locale}/privacy` },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPageLayout locale={locale as Locale} title={t("privacyTitle")} lastUpdated={t("lastUpdated")}>
      <p className="lead">
        This Privacy Policy explains how Bao Service (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects,
        uses, discloses, and safeguards personal data in connection with our website and services. We operate in
        Singapore and follow the spirit of the Personal Data Protection Act (PDPA). If you have any questions, contact{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
      {privacySections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{section.body}</p>
          )}
        </section>
      ))}
      <h2>Contact</h2>
      <p>
        Bao Service · 21 Bukit Batok Crescent, #03-79, Singapore 658065 · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · +65
        8511 9195
      </p>
    </LegalPageLayout>
  );
}
