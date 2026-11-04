"use client";

import { useLocale, useTranslations } from "next-intl";
import { ContactSection } from "@cerneo/ui";
import type { ContactSectionLabels, ContactValues } from "@cerneo/ui";
import { CONTACT_EMAIL, WHATSAPP, href } from "../lib/site";

const SUBJECTS = ["product", "consulting", "team", "products", "other"] as const;

const STRING_LABELS = [
  "emailTitle", "emailDescription", "emailAction", "whatsappTitle", "whatsappDescription", "whatsappAction",
  "copy", "copied", "copiedEmail", "copiedWhatsapp", "copyFailed", "formTitle", "name", "namePlaceholder",
  "email", "emailPlaceholder", "subject", "subjectPlaceholder", "message", "messagePlaceholder", "consent",
  "privacy", "consentLabel", "submit", "note", "nameRequired", "emailRequired", "emailInvalid", "subjectRequired",
  "messageRequired", "consentRequired", "successTitle", "successText", "again", "errorTitle", "retry",
] as const;

/**
 * O `ContactSection` do DS com a cópia do locale e o envio pela rota
 * `/api/contact` (Resend). O componente valida e cuida dos estados; aqui só o
 * `fetch`. Erro de rede ou de servidor vira o estado de erro do DS, que guarda o
 * que a pessoa digitou.
 */
export function ContactBlock({
  id,
  titleAs = "h2",
  tone = "canvas",
}: {
  id?: string;
  titleAs?: "h1" | "h2";
  tone?: "canvas" | "surface" | "yellow";
}) {
  const t = useTranslations("contact");
  const locale = useLocale();

  const labels: Partial<ContactSectionLabels> = {
    summary: (count: number) => t("labels.summary", { count }),
    errorText: (email: string) => t("labels.errorText", { email }),
  };
  for (const k of STRING_LABELS) (labels as Record<string, unknown>)[k] = t(`labels.${k}`);

  const subjects = SUBJECTS.map((value) => ({ value, label: t(`subjects.${value}`) }));

  const onSubmit = async (values: ContactValues) => {
    const subject = subjects.find((s) => s.value === values.subject)?.label ?? values.subject;
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, subject, locale }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  };

  return (
    <ContactSection
      id={id}
      titleAs={titleAs}
      tone={tone}
      eyebrow={t("eyebrow")}
      title={t("title")}
      lead={t("lead")}
      email={CONTACT_EMAIL}
      whatsapp={{ number: WHATSAPP.number, display: WHATSAPP.display, message: t("whatsappMessage") }}
      subjects={subjects}
      privacyHref={href(locale, "privacy")}
      onSubmit={onSubmit}
      labels={labels}
    />
  );
}
