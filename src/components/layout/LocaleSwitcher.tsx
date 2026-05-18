"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ms: "Bahasa",
};

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const locales: Locale[] = ["en", "zh", "ms"];

  return (
    <div className="flex gap-1 text-xs md:text-sm flex-shrink-0">
      {locales.map((loc) => {
        const href = pathname.replace(`/${locale}`, `/${loc}`);
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={href}
            className={cn(
              "px-2 py-1 rounded-full transition-colors whitespace-nowrap",
              active
                ? "font-medium text-white bg-brand-600 shadow-sm"
                : "text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800"
            )}
            aria-current={active ? "page" : undefined}
          >
            {labels[loc]}
          </Link>
        );
      })}
    </div>
  );
}
