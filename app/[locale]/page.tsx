import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CTABand,
  FeatureGrid,
  HeroSection,
  Link,
  Manifesto,
  ProductLogo,
  ProductShowcase,
  Section,
} from "@cerneo/ui";
import type { FeatureItem } from "@cerneo/ui";
import { ContactBlock } from "../../src/components/ContactBlock";
import { HeroAtom } from "../../src/components/HeroAtom";
import { pageMetadata } from "../../src/lib/metadata";
import { ANCHORS, NANAPET_LOGO, NANAPET_URL, href } from "../../src/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return pageMetadata(locale, "home", { title: t("title"), description: t("description"), absoluteTitle: true });
}

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const contact = href(locale, "contact");

  const services: FeatureItem[] = [
    { id: "product", icon: "code", title: t("services.product.title"), description: t("services.product.description"), href: contact },
    { id: "consulting", icon: "workflow", title: t("services.consulting.title"), description: t("services.consulting.description"), href: contact },
    { id: "team", icon: "users", title: t("services.team.title"), description: t("services.team.description"), href: contact },
  ];

  const differentials: FeatureItem[] = [
    { id: "reliability", icon: "activity", size: "2x1", tone: "yellow", title: t("differentials.reliability.title"), description: t("differentials.reliability.description") },
    { id: "scalability", icon: "trending-up", title: t("differentials.scalability.title"), description: t("differentials.scalability.description") },
    { id: "evolution", icon: "refresh-cw", title: t("differentials.evolution.title"), description: t("differentials.evolution.description") },
    { id: "data", icon: "chart-column", title: t("differentials.data.title"), description: t("differentials.data.description") },
    { id: "security", icon: "shield-check", title: t("differentials.security.title"), description: t("differentials.security.description") },
    { id: "support", icon: "handshake", size: "2x1", title: t("differentials.support.title"), description: t("differentials.support.description") },
  ];

  const trust: FeatureItem[] = [
    { id: "privacy", icon: "lock", title: t("trust.privacy.title"), description: t("trust.privacy.description"), href: href(locale, "privacy") },
    { id: "conduct", icon: "handshake", title: t("trust.conduct.title"), description: t("trust.conduct.description"), href: href(locale, "conduct") },
    { id: "anti-corruption", icon: "scale", title: t("trust.antiCorruption.title"), description: t("trust.antiCorruption.description"), href: href(locale, "antiCorruption") },
    { id: "whistleblowing", icon: "megaphone", title: t("trust.whistleblowing.title"), description: t("trust.whistleblowing.description"), href: href(locale, "whistleblowing") },
  ];

  const bullets = (key: string) => t.raw(`products.${key}.bullets`) as string[];

  return (
    <>
      <HeroSection
        variant="aura"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primaryAction={{ label: t("hero.primary"), href: href(locale, "home", ANCHORS.services) }}
        secondaryAction={{ label: t("hero.secondary"), href: href(locale, "home", ANCHORS.products), iconRight: "arrow-right" }}
        media={<HeroAtom />}
      />

      <Manifesto
        heading={t("manifesto.heading")}
        lines={[t("manifesto.line")]}
        rings
        spacing="xl"
        body={[
          <p key="p1">{t.rich("manifesto.p1", { strong })}</p>,
          <p key="p2">{t.rich("manifesto.p2", { strong })}</p>,
        ]}
      />

      <Section
        id={ANCHORS.services}
        tone="surface"
        layout="split"
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        lead={t("services.lead")}
        actions={
          <Link variant="standalone" href={contact} iconRight="arrow-right">
            {t("services.action")}
          </Link>
        }
      >
        <FeatureGrid columns={3} items={services} linkLabel={t("services.linkLabel")} />
      </Section>

      <Section id={ANCHORS.products} eyebrow={t("products.eyebrow")} title={t("products.title")} lead={t("products.lead")}>
        <ProductShowcase
          layout="columns"
          products={[
            {
              product: "studios",
              endorsement: t("products.endorsement"),
              tagline: t("products.studios.tagline"),
              description: t("products.studios.description"),
              bullets: bullets("studios"),
              action: { label: t("products.studios.action"), href: contact },
            },
            {
              product: "forge",
              endorsement: t("products.endorsement"),
              tagline: t("products.forge.tagline"),
              description: t("products.forge.description"),
              bullets: bullets("forge"),
              action: { label: t("products.forge.action"), href: contact },
            },
            {
              product: "nanapet",
              logo: <ProductLogo src={NANAPET_LOGO.src} ratio={NANAPET_LOGO.ratio} name="NanaPet" highlight="Pet" height={64} />,
              endorsement: t("products.endorsement"),
              tagline: t("products.nanapet.tagline"),
              description: t("products.nanapet.description"),
              bullets: bullets("nanapet"),
              action: { label: t("products.nanapet.action"), href: NANAPET_URL, external: true, externalLabel: tc("link.external") },
            },
          ]}
        />
      </Section>

      <Section tone="surface" headerSize="md" eyebrow={t("differentials.eyebrow")} title={t("differentials.title")}>
        <FeatureGrid variant="bento" items={differentials} />
      </Section>

      <CTABand
        tone="yellow"
        align="center"
        eyebrow={t("culture.eyebrow")}
        title={t("culture.title")}
        description={t("culture.description")}
        primaryAction={{ label: t("culture.primary"), href: href(locale, "peopleCulture") }}
        secondaryAction={{ label: t("culture.secondary"), href: href(locale, "about") }}
      />

      <Section headerSize="md" spacing="md" eyebrow={t("trust.eyebrow")} title={t("trust.title")} lead={t("trust.lead")}>
        <FeatureGrid columns={4} appearance="plain" items={trust} linkLabel={t("trust.linkLabel")} />
      </Section>

      <ContactBlock id={ANCHORS.contact} tone="surface" />
    </>
  );
}
