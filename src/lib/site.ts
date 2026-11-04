/**
 * Endereços e caminhos do site, num lugar só. Sem "use client": vale para
 * Server e Client Components.
 */

export const SITE_URL = "https://www.cerneo.com.br";
export const CONTACT_EMAIL = "contato@cerneo.com.br";
export const WHATSAPP = { number: "5511952134621", display: "+55 11 95213-4621" } as const;
export const NANAPET_URL = "https://nanapet.com.br";

/** As rotas do site (o segmento depois do locale). */
export const PAGES = {
  home: "/",
  about: "/about",
  peopleCulture: "/people-culture",
  contact: "/contact",
  privacy: "/privacy-policy",
  terms: "/terms-of-use",
  conduct: "/code-of-conduct",
  antiCorruption: "/anti-corruption",
  whistleblowing: "/whistleblowing",
} as const;

export type PageKey = keyof typeof PAGES;

/** Âncoras da home. Mantêm os nomes do site antigo para links externos continuarem valendo. */
export const ANCHORS = { services: "services", products: "products", contact: "contact" } as const;

/**
 * Caminho com o prefixo do locale, para os blocos do DS (que renderizam `<a href>`).
 * `href("pt-BR", "about")` → `/pt-BR/about`; `href("en", "home", "services")` → `/en#services`.
 */
export function href(locale: string, page: PageKey, hash?: string): string {
  const path = PAGES[page] === "/" ? "" : PAGES[page];
  return `/${locale}${path}${hash ? `#${hash}` : ""}`;
}
