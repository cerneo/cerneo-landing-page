import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABand, FeatureGrid, HeroSection, Manifesto, Section, ValuesList } from "@cerneo/ui";
import type { IconName } from "@cerneo/ui";
import { Doodle } from "@cerneo/ui/doodles";
import { pageMetadata } from "../../../src/lib/metadata";
import { href } from "../../../src/lib/site";

type Props = { params: Promise<{ locale: string }> };
type Item = { title: string; description: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "peopleCulture.meta" });
  return pageMetadata(locale, "peopleCulture", { title: t("title"), description: t("description") });
}

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;
const PRINCIPLE_ICONS: IconName[] = ["target", "award", "users", "book-open", "eye", "coffee"];
const PRACTICE_ICONS: IconName[] = ["globe", "file-text", "git-branch", "book-open"];

export default async function PeopleCulturePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("peopleCulture");

  const principles = t.raw("values.items") as Item[];
  const practices = t.raw("howWeWork.items") as Item[];

  return (
    <>
      <HeroSection
        variant="doodle"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        media={<Doodle name="connecting" size={400} motion="reveal" />}
        primaryAction={{ label: t("hero.primary"), href: href(locale, "contact") }}
        secondaryAction={{ label: t("hero.secondary"), href: "#how-we-work" }}
      />

      <Manifesto
        heading={t("philosophy.heading")}
        tone="surface"
        spacing="xl"
        lines={t.raw("philosophy.lines") as string[]}
        body={[
          <p key="p1">{t.rich("philosophy.p1", { strong })}</p>,
          <p key="p2">{t.rich("philosophy.p2", { strong })}</p>,
        ]}
      />

      <Section layout="split" eyebrow={t("values.eyebrow")} title={t("values.title")} lead={t("values.lead")}>
        <ValuesList
          layout="grid"
          columns={3}
          label={t("values.label")}
          items={principles.map((v, i) => ({ ...v, id: `p${i}`, icon: PRINCIPLE_ICONS[i] }))}
        />
      </Section>

      <Section id="how-we-work" tone="surface" headerSize="md" eyebrow={t("howWeWork.eyebrow")} title={t("howWeWork.title")}>
        <FeatureGrid
          columns={4}
          appearance="plain"
          items={practices.map((v, i) => ({ ...v, id: `w${i}`, icon: PRACTICE_ICONS[i] }))}
        />
      </Section>

      <CTABand
        tone="yellow"
        align="center"
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        description={t("cta.description")}
        primaryAction={{ label: t("cta.primary"), href: href(locale, "contact") }}
      />
    </>
  );
}
