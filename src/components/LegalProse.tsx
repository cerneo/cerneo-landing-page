"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Prose } from "@cerneo/ui";

/**
 * Página legal no `Prose` do DS: sumário gerado dos `h2`, medida de leitura e
 * "Voltar ao topo". As funções de rótulo moram aqui porque um Server Component
 * não passa função para um Client Component.
 */
export function LegalProse({
  title,
  lead,
  updated,
  updatedText,
  children,
}: {
  title: string;
  lead?: string;
  updated: string;
  updatedText: string;
  children: ReactNode;
}) {
  const t = useTranslations("common.legalPage");
  const locale = useLocale();
  return (
    <Prose
      eyebrow={t("eyebrow")}
      title={title}
      lead={lead}
      updated={updated}
      updatedLabel={() => updatedText}
      locale={locale}
      tocLabel={t("toc")}
      tocCountLabel={(count) => t("tocCount", { count })}
      backToTopLabel={t("backToTop")}
      stickyOffset={96}
    >
      {children}
    </Prose>
  );
}
