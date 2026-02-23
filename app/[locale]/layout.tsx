import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "../../src/i18n/routing";
import { Navbar } from "../../src/design-system/components/layout/Navbar";
import { Footer } from "../../src/design-system/components/layout/Footer";
import "../globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Cerneo",
    default: "Cerneo | A Nova Base da Tecnologia",
  },
  description:
    "Holding de tecnologia que combina engenharia de excelência com inovação para construir produtos que transformam negócios.",
  icons: {
    icon: [
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Cerneo",
    title: "Cerneo | A Nova Base da Tecnologia",
    description:
      "Holding de tecnologia que combina engenharia de excelência com inovação para construir produtos que transformam negócios.",
  },
};

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
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={urbanist.variable}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
