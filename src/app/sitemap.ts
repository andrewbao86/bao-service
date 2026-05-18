import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";

const paths = ["", "/energy-efficient", "/project-management", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
