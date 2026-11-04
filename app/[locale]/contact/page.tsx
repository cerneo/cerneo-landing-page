import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FAQ, Link } from "@cerneo/ui";
import { ContactBlock } from "../../../src/components/ContactBlock";
import { pageMetadata } from "../../../src/lib/metadata";
import { CONTACT_EMAIL } from "../../../src/lib/site";

type Props = { params: Promise<{ locale: string }> };
type Question = { category: string; question: string; answer: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return pageMetadata(locale, "contact", { title: t("title"), description: t("description") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact.faq");
  const items = (t.raw("items") as Question[]).map((q, i) => ({ ...q, id: `q${i + 1}` }));

  return (
    <>
      <ContactBlock titleAs="h1" tone="surface" />
      <FAQ
        eyebrow={t("eyebrow")}
        title={t("title")}
        items={items}
        aside={
          <p>
            {t("asidePrefix")} <Link href={`mailto:${CONTACT_EMAIL}`}>{t("asideLink")}</Link>
          </p>
        }
      />
    </>
  );
}
