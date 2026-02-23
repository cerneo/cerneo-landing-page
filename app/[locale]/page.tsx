import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Brain,
  Users,
  Activity,
  Calendar,
  Hexagon,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  BarChart3,
  Lock,
  Headphones,
} from "lucide-react";
import { Hero } from "../../src/design-system/components/marketing/Hero";
import { ProductCard } from "../../src/design-system/components/marketing/ProductCard";
import { FeatureGrid } from "../../src/design-system/components/marketing/FeatureGrid";
import { CTA } from "../../src/design-system/components/marketing/CTA";
import { Section } from "../../src/design-system/components/layout/Section";
import { Container } from "../../src/design-system/components/layout/Container";
import { Button } from "../../src/design-system/components/ui/Button";
import { Link } from "../../src/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCta = await getTranslations("common.cta");

  const products = [
    { key: "ai", icon: <Brain className="h-6 w-6 text-product-ai" />, accent: "bg-product-ai" },
    { key: "crm", icon: <Users className="h-6 w-6 text-product-crm" />, accent: "bg-product-crm" },
    { key: "clinic", icon: <Activity className="h-6 w-6 text-product-clinic" />, accent: "bg-product-clinic" },
    { key: "kalender", icon: <Calendar className="h-6 w-6 text-product-kalender" />, accent: "bg-product-kalender", logoSrc: "/images/product-logo/kalender-logo.png" },
  ];

  const differentials = [
    { key: "reliability", icon: <ShieldCheck className="h-5 w-5" /> },
    { key: "scalability", icon: <TrendingUp className="h-5 w-5" /> },
    { key: "agility", icon: <Clock className="h-5 w-5" /> },
    { key: "datadriven", icon: <BarChart3 className="h-5 w-5" /> },
    { key: "security", icon: <Lock className="h-5 w-5" /> },
    { key: "support", icon: <Headphones className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* 1. Hero */}
      <Hero
        variant="home"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      >
        <Link href="#products">
          <Button color="neo" size="lg">
            {t("hero.cta1")}
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" color="white" size="lg">
            {t("hero.cta2")}
          </Button>
        </Link>
      </Hero>

      {/* 2. Manifesto */}
      <Section variant="default">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("manifesto.title")}
            </h2>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-steel">
              <p>{t("manifesto.paragraph1")}</p>
              <p>{t("manifesto.paragraph2")}</p>
              <p>{t("manifesto.paragraph3")}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Logo Hex */}
      <Section variant="mist">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-12">
            <Hexagon className="mx-auto h-16 w-16 text-neo-500 mb-6" />
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("logo.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">{t("logo.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neo-50">
                  <Hexagon className="h-6 w-6 text-neo-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">
                  {t(`logo.item${i}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">
                  {t(`logo.item${i}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Products */}
      <Section variant="default" id="products">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("products.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">{t("products.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {products.map((product) => (
              <ProductCard
                key={product.key}
                name={t(`products.${product.key}.name`)}
                description={t(`products.${product.key}.description`)}
                icon={product.icon}
                accentColor={product.accent}
                logoSrc={product.logoSrc}
                comingSoon
                comingSoonLabel={t("products.comingSoon")}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Differentials */}
      <Section variant="mist">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("differentials.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">
              {t("differentials.subtitle")}
            </p>
          </div>
          <FeatureGrid
            columns={3}
            features={differentials.map((f) => ({
              icon: f.icon,
              title: t(`differentials.${f.key}.title`),
              description: t(`differentials.${f.key}.description`),
            }))}
          />
        </Container>
      </Section>

      {/* 6. Culture Teaser */}
      <CTA
        variant="centered"
        background="charcoal"
        title={t("culture.title")}
        subtitle={t("culture.subtitle")}
      >
        <Link href="/people-culture">
          <Button color="neo" size="lg" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            {t("culture.cta")}
          </Button>
        </Link>
      </CTA>

    </>
  );
}
