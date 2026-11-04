import { ErrorPage } from "@cerneo/ui";
import { ANCHORS, href } from "../lib/site";

export type NotFoundCopy = {
  eyebrow: string;
  title: string;
  description: string;
  home: string;
  back: string;
  linksLabel: string;
  services: string;
  servicesDesc: string;
  aboutLabel: string;
  aboutDesc: string;
  peopleCulture: string;
  cultureDesc: string;
  contact: string;
  contactDesc: string;
};

/** O 404 do site: `ErrorPage` do DS em tom ink, com o spot `not-found` e quatro caminhos. */
export function NotFoundView({ locale, copy, titleAs = "h1" }: { locale: string; copy: NotFoundCopy; titleAs?: "h1" | "h2" }) {
  return (
    <ErrorPage
      kind="404"
      tone="ink"
      titleAs={titleAs}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      primaryAction={{ label: copy.home, href: href(locale, "home") }}
      backLabel={copy.back}
      linksLabel={copy.linksLabel}
      links={[
        { label: copy.services, href: href(locale, "home", ANCHORS.services), description: copy.servicesDesc, icon: "briefcase" },
        { label: copy.aboutLabel, href: href(locale, "about"), description: copy.aboutDesc, icon: "book-open" },
        { label: copy.peopleCulture, href: href(locale, "peopleCulture"), description: copy.cultureDesc, icon: "users" },
        { label: copy.contact, href: href(locale, "contact"), description: copy.contactDesc, icon: "mail" },
      ]}
    />
  );
}
