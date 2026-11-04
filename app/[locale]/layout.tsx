import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@cerneo/tokens/css";
import "@cerneo/ui/styles.css";
import "../globals.css";
import { routing } from "../../src/i18n/routing";
import { fontVariables } from "../../src/lib/fonts";
import { SITE_URL } from "../../src/lib/site";
import { THEME_CANVAS, THEME_INIT_SCRIPT } from "../../src/lib/theme";
import { NavTransitions, SiteConsent, SiteFooter, SiteHeaderBar } from "../../src/components/SiteChrome";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "common.meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: "%s · Cerneo", default: "Cerneo" },
    description: t("description"),
    applicationName: "Cerneo",
    // Gerados do Emblem do DS por `scripts/gen-icons.mjs`.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_CANVAS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_CANVAS.dark },
  ],
};

// Só os três locales existem: qualquer outro primeiro segmento (`/x.php`) é 404 direto.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    /*
     * `suppressHydrationWarning` só no <html>: o script do <head> escreve
     * `data-theme`, a classe e o `color-scheme` antes da hidratação, de propósito.
     * `data-scroll-behavior` deixa o Next desligar a rolagem suave na troca de rota.
     */
    <html
      lang={locale}
      className={fontVariables}
      data-brand="cerneo"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <SiteHeaderBar />
          <main id="conteudo" tabIndex={-1} className="site-main">
            {children}
          </main>
          <SiteFooter year={new Date().getFullYear()} />
          <SiteConsent />
          <NavTransitions />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
