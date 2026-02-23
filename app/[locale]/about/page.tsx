import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Award,
  Lightbulb,
  Eye,
  Target,
} from "lucide-react";
import { Hero } from "../../../src/design-system/components/marketing/Hero";
import { FeatureGrid } from "../../../src/design-system/components/marketing/FeatureGrid";
import { CTA } from "../../../src/design-system/components/marketing/CTA";
import { Section } from "../../../src/design-system/components/layout/Section";
import { Container } from "../../../src/design-system/components/layout/Container";
import { Button } from "../../../src/design-system/components/ui/Button";
import {
  Timeline,
  TimelineItem,
} from "../../../src/design-system/components/ui/Timeline";
import { Link } from "../../../src/i18n/navigation";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = [
    { key: "excellence", icon: <Award className="h-5 w-5" /> },
    { key: "innovation", icon: <Lightbulb className="h-5 w-5" /> },
    { key: "transparency", icon: <Eye className="h-5 w-5" /> },
    { key: "impact", icon: <Target className="h-5 w-5" /> },
  ];

  const timelineItems = [
    { key: "item1" },
    { key: "item2" },
    { key: "item3" },
    { key: "item4" },
  ];

  return (
    <>
      <Hero
        variant="page"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      {/* Story */}
      <Section variant="default">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("story.title")}
            </h2>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-steel">
              <p>{t("story.paragraph1")}</p>
              <p>{t("story.paragraph2")}</p>
              <p>{t("story.paragraph3")}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section variant="mist">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl mb-12">
              {t("timeline.title")}
            </h2>
            <Timeline>
              {timelineItems.map((item) => (
                <TimelineItem
                  key={item.key}
                  year={t(`timeline.${item.key}.year`)}
                  title={t(`timeline.${item.key}.title`)}
                >
                  {t(`timeline.${item.key}.description`)}
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section variant="default">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              {t("values.title")}
            </h2>
            <p className="mt-4 text-lg text-steel">{t("values.subtitle")}</p>
          </div>
          <FeatureGrid
            columns={2}
            features={values.map((v) => ({
              icon: v.icon,
              title: t(`values.${v.key}.title`),
              description: t(`values.${v.key}.description`),
            }))}
          />
        </Container>
      </Section>

      {/* CTA */}
      <CTA
        variant="centered"
        background="neo"
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      >
        <Link href="/people-culture">
          <Button
            variant="solid"
            color="white"
            size="lg"
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            {t("cta.button")}
          </Button>
        </Link>
      </CTA>
    </>
  );
}
