/**
 * Endereços e caminhos do site, num lugar só. Sem "use client": vale para
 * Server e Client Components.
 */

export const SITE_URL = "https://www.cerneo.com.br";
export const CONTACT_EMAIL = "contato@cerneo.com.br";
export const WHATSAPP = { number: "5511952134621", display: "+55 11 95213-4621" } as const;
export const NANAPET_URL = "https://nanapet.com.br";

/** Arte oficial da NanaPet (768×512, sem fundo), servida pelo próprio site. Cópia de `assets/brands/nanapet/` do Cerneo DS. */
export const NANAPET_LOGO = { src: "/brands/nanapet/logo-768.webp", ratio: 768 / 512 } as const;

/**
 * Dados da empresa para o rodapé (`Footer address`). Iguais nos três idiomas:
 * "CNPJ" e "CEP" não se traduzem.
 */
export const COMPANY = {
  legalName: "Cerneo Tecnologia LTDA",
  cnpj: "50.545.668/0001-92",
  street: "Av. Eng. Luiz Carlos Berrini, 1748 – Conj. 1710",
  city: "Cidade Monções, São Paulo – SP",
  cep: "04571-000",
} as const;

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
