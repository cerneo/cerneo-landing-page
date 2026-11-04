import { Fragment } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "../lib/metadata";
import type { PageKey } from "../lib/site";
import { LegalProse } from "./LegalProse";

/** Cada documento legal: chave em `messages/*.json`, ordem das seções e data da última revisão. */
export const LEGAL_DOCS = {
  privacy: {
    ns: "privacy",
    updated: "2025-02-01",
    sections: ["intro", "collection", "usage", "sharing", "storage", "rights", "contact"],
  },
  terms: {
    ns: "terms",
    updated: "2025-02-01",
    sections: ["acceptance", "services", "responsibilities", "ip", "liability", "modifications", "governing", "contact"],
  },
  conduct: {
    ns: "conduct",
    updated: "2026-07-01",
    sections: ["commitment", "humanRights", "labor", "slavery", "discrimination", "harassment", "health", "minerals", "suppliers", "reporting"],
  },
  antiCorruption: {
    ns: "antiCorruption",
    updated: "2026-07-01",
    sections: ["commitment", "prohibited", "gifts", "thirdParties", "records", "reporting"],
  },
  whistleblowing: {
    ns: "whistleblowing",
    updated: "2026-07-01",
    sections: ["purpose", "scope", "how", "confidentiality", "nonRetaliation", "handling"],
  },
} as const satisfies Partial<Record<PageKey, { ns: string; updated: string; sections: readonly string[] }>>;

type LegalKey = keyof typeof LEGAL_DOCS;
type Props = { params: Promise<{ locale: string }> };

export function legalMetadata(page: LegalKey) {
  return async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "legal" });
    const m = await getTranslations({ locale, namespace: "legalMeta" });
    return pageMetadata(locale, page, { title: t(`${LEGAL_DOCS[page].ns}.title`), description: m(page) });
  };
}

/** Página legal: o texto de `legal.<doc>` dentro do `Prose` do DS. */
export function legalPage(page: LegalKey) {
  return async function LegalPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const doc = LEGAL_DOCS[page];
    const t = await getTranslations(`legal.${doc.ns}`);
    const m = await getTranslations("legalMeta");

    return (
      <LegalProse title={t("title")} lead={m(page)} updated={doc.updated} updatedText={t("lastUpdated")}>
        {doc.sections.map((s) => (
          <Fragment key={s}>
            <h2>{t(`${s}.title`)}</h2>
            <p>{t(`${s}.content`)}</p>
            {t.has(`${s}.items`) ? (
              <ul>
                {(t.raw(`${s}.items`) as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </Fragment>
        ))}
      </LegalProse>
    );
  };
}
