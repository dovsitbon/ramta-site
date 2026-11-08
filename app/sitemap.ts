import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { defaultLocale, locales } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((lang) => ({
    url: `${site.url}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: lang === defaultLocale ? 1 : 0.8,
    alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`])), "x-default": `${site.url}/${defaultLocale}` } },
  }));
}
