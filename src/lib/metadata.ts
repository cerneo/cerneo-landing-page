import type { Metadata } from "next";
import { routing } from "../i18n/routing";
import { PAGES, SITE_URL, type PageKey } from "./site";

const OG_LOCALE: Record<string, string> = { "pt-BR": "pt_BR", en: "en_US", es: "es_ES" };

/**
 * Metadados de uma página: título, descrição, canônico, hreflang e Open Graph.
 * A imagem de OG vem do `opengraph-image.tsx` de cada rota.
 */
export function pageMetadata(
  locale: string,
  page: PageKey,
  { title, description, absoluteTitle }: { title: string; description: string; absoluteTitle?: boolean },
): Metadata {
  const path = PAGES[page] === "/" ? "" : PAGES[page];
  const url = (l: string) => `${SITE_URL}/${l}${path}`;
  const fullTitle = absoluteTitle ? `Cerneo · ${title}` : `${title} · Cerneo`;
  return {
    title: absoluteTitle ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: url(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
        "x-default": url(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Cerneo",
      title: fullTitle,
      description,
      url: url(locale),
      locale: OG_LOCALE[locale] ?? "pt_BR",
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
