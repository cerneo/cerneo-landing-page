import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Flame,
  CheckCircle,
  UsersRound,
  TrendingUp,
  Eye,
  Scale,
  Wifi,
  FileText,
  GitPullRequest,
  GraduationCap,
} from "lucide-react";
import { Hero } from "../../../src/design-system/components/marketing/Hero";
import { FeatureGrid } from "../../../src/design-system/components/marketing/FeatureGrid";
import { CTA } from "../../../src/design-system/components/marketing/CTA";
import { Section } from "../../../src/design-system/components/layout/Section";
import { Container } from "../../../src/design-system/components/layout/Container";
import { Button } from "../../../src/design-system/components/ui/Button";

export default async function PeopleCulturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("peopleCulture");

  const coreValues = [
    { key: "ownership", icon: <Flame className="h-5 w-5" /> },
    { key: "quality", icon: <CheckCircle className="h-5 w-5" /> },
    { key: "collaboration", icon: <UsersRound className="h-5 w-5" /> },
    { key: "growth", icon: <TrendingUp className="h-5 w-5" /> },
    { key: "transparency", icon: <Eye className="h-5 w-5" /> },
    { key: "balance", icon: <Scale className="h-5 w-5" /> },
  ];

  const howWeWork = [
    { key: "remote", icon: <Wifi className="h-5 w-5" /> },
    { key: "async", icon: <FileText className="h-5 w-5" /> },
    { key: "reviews", icon: <GitPullRequest className="h-5 w-5" /> },
    { key: "learning", icon: <GraduationCap className="h-5 w-5" /> },
  ];

  return (
    <>
      <Hero
        variant="page"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      {/* Philosophy */}
      <Section variant="default">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("philosophy.title")}
            </h2>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-steel">
              <p>{t("philosophy.paragraph1")}</p>
              <p>{t("philosophy.paragraph2")}</p>
              <p>{t("philosophy.paragraph3")}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Values */}
      <Section variant="mist">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("values.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">{t("values.subtitle")}</p>
          </div>
          <FeatureGrid
            columns={3}
            features={coreValues.map((v) => ({
              icon: v.icon,
              title: t(`values.${v.key}.title`),
              description: t(`values.${v.key}.description`),
            }))}
          />
        </Container>
      </Section>

      {/* How We Work */}
      <Section variant="default">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("howWeWork.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">
              {t("howWeWork.subtitle")}
            </p>
          </div>
          <FeatureGrid
            columns={2}
            features={howWeWork.map((item) => ({
              icon: item.icon,
              title: t(`howWeWork.${item.key}.title`),
              description: t(`howWeWork.${item.key}.description`),
            }))}
          />
        </Container>
      </Section>

      {/* CTA */}
      <CTA
        variant="centered"
        background="gradient"
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      >
        <Button
          variant="solid"
          color="white"
          size="lg"
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
        >
          {t("cta.button")}
        </Button>
      </CTA>
    </>
  );
}
