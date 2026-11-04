import { getTranslations } from "next-intl/server";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "../../../src/og/image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Cerneo";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return ogImage({ eyebrow: t("peopleCulture.hero.eyebrow"), title: t("peopleCulture.hero.title"), tagline: t("og.tagline") });
}
