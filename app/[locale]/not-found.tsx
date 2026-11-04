import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { NotFoundView } from "../../src/components/NotFoundView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.notFound");
  return { title: t("metaTitle"), robots: { index: false } };
}

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("common");
  return (
    <NotFoundView
      locale={locale}
      copy={{
        eyebrow: t("notFound.eyebrow"),
        title: t("notFound.title"),
        description: t("notFound.description"),
        home: t("notFound.home"),
        back: t("notFound.back"),
        linksLabel: t("notFound.linksLabel"),
        services: t("nav.services"),
        servicesDesc: t("notFound.servicesDesc"),
        aboutLabel: t("notFound.aboutLabel"),
        aboutDesc: t("notFound.aboutDesc"),
        peopleCulture: t("nav.peopleCulture"),
        cultureDesc: t("notFound.cultureDesc"),
        contact: t("nav.contact"),
        contactDesc: t("notFound.contactDesc"),
      }}
    />
  );
}
