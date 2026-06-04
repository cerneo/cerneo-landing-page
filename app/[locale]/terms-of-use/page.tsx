import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalLayout } from "../../../src/design-system/components/layout/LegalLayout";

export default async function TermsOfUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.terms");

  const sections = [
    "acceptance",
    "services",
    "responsibilities",
    "ip",
    "liability",
    "modifications",
    "governing",
    "contact",
  ] as const;

  const sectionsWithItems = ["responsibilities"];

  return (
    <LegalLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-xl font-semibold text-charcoal dark:text-gray-100 mb-3">
            {t(`${section}.title`)}
          </h2>
          <p className="text-steel dark:text-gray-400 leading-relaxed mb-3">
            {t(`${section}.content`)}
          </p>
          {sectionsWithItems.includes(section) && (
            <ul className="list-disc pl-6 space-y-1">
              {(
                t.raw(`${section}.items`) as string[]
              ).map((item: string, index: number) => (
                <li key={index} className="text-steel dark:text-gray-400">
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
