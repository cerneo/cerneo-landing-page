import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalLayout } from "../../../src/design-system/components/layout/LegalLayout";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");

  const sections = [
    "intro",
    "collection",
    "usage",
    "sharing",
    "storage",
    "rights",
    "contact",
  ] as const;

  const sectionsWithItems = ["collection", "usage", "rights"];

  return (
    <LegalLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-xl font-semibold text-charcoal mb-3">
            {t(`${section}.title`)}
          </h2>
          <p className="text-steel leading-relaxed mb-3">
            {t(`${section}.content`)}
          </p>
          {sectionsWithItems.includes(section) && (
            <ul className="list-disc pl-6 space-y-1">
              {(
                t.raw(`${section}.items`) as string[]
              ).map((item: string, index: number) => (
                <li key={index} className="text-steel">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </LegalLayout>
  );
}
