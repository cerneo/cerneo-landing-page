import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CTABand, HeroSection, Illustration, Manifesto, Section, Timeline, ValuesList } from "@cerneo/ui";
import type { IconName } from "@cerneo/ui";
import { pageMetadata } from "../../../src/lib/metadata";
import { href } from "../../../src/lib/site";

type Props = { params: Promise<{ locale: string }> };
type Item = { date?: string; title: string; description: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return pageMetadata(locale, "about", { title: t("title"), description: t("description") });
}

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;
const VALUE_ICONS: IconName[] = ["target", "zap", "eye", "trending-up"];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common.timeline");

  const milestones = t.raw("timeline.items") as Item[];
  const values = t.raw("values.items") as Item[];

  return (
    <>
      <HeroSection
        variant="split"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primaryAction={{ label: t("hero.primary"), href: href(locale, "contact") }}
        secondaryAction={{ label: t("hero.secondary"), href: "#milestones" }}
        media={<Illustration name="hero-ecossistema" size={640} motion="reveal" decorative />}
      />

      <Manifesto
        heading={t("story.heading")}
        tone="surface"
        size="heading"
        spacing="xl"
        lines={[t("story.line")]}
        body={[
          <p key="p1">{t.rich("story.p1", { strong })}</p>,
          <p key="p2">{t.rich("story.p2", { strong })}</p>,
        ]}
      />

      <Timeline
        id="milestones"
        orientation="horizontal"
        eyebrow={t("timeline.eyebrow")}
        title={t("timeline.title")}
        lead={t("timeline.lead")}
        currentLabel={tc("current")}
        scrollLabel={tc("scroll")}
        items={milestones.map((m, i) => ({ ...m, id: `m${i}`, current: i === milestones.length - 1 }))}
      />

      <Section tone="surface" headerSize="md" eyebrow={t("values.eyebrow")} title={t("values.title")}>
        <ValuesList
          layout="grid"
          columns={2}
          label={t("values.label")}
          items={values.map((v, i) => ({ ...v, id: `v${i}`, icon: VALUE_ICONS[i] }))}
        />
      </Section>

      <CTABand
        tone="ink"
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        description={t("cta.description")}
        primaryAction={{ label: t("cta.primary"), href: href(locale, "peopleCulture") }}
        secondaryAction={{ label: t("cta.secondary"), href: href(locale, "contact") }}
      />
    </>
  );
}
