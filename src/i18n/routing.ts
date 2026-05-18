import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh", "ms"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
