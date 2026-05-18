import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-3 max-w-md text-slate-600">{t("body")}</p>
      <Link
        href="/en"
        className="mt-8 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        {t("home")}
      </Link>
    </main>
  );
}
