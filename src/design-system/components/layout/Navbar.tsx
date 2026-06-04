"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Globe, Menu, X } from "lucide-react";
import classnames from "classnames";
import { Link, usePathname, useRouter } from "../../../i18n/navigation";
import { Button } from "../ui/Button";
import { Container } from "./Container";
import { themeConfig } from "../../config/theme.config";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/people-culture", key: "peopleCulture" },
] as const;

export function Navbar() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const nextLocale = locale === "pt-BR" ? "en" : "pt-BR";
  const switchLabel = locale === "pt-BR" ? "EN" : "PT";

  function handleLocaleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <header
      data-component-name="Navbar"
      className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg"
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo-cerneo.png"
              alt="Cerneo"
              width={28}
              height={36}
              className={classnames("h-9 w-auto", themeConfig.defaultTransition, "group-hover:opacity-80")}
            />
            <span className="text-xl font-bold text-charcoal tracking-tight uppercase">
              Cerneo
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={classnames(
                    "px-3 py-2 text-sm font-medium rounded-lg",
                    themeConfig.defaultTransition,
                    isActive
                      ? "text-neo-600 bg-neo-50"
                      : "text-steel hover:text-charcoal hover:bg-gray-50"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <button
              type="button"
              onClick={handleLocaleSwitch}
              className={classnames(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                "text-steel hover:text-charcoal hover:bg-gray-50",
                themeConfig.defaultTransition
              )}
              aria-label={`Switch to ${nextLocale}`}
            >
              <Globe className="h-4 w-4" />
              {switchLabel}
            </button>
            <Button size="sm" color="neo">
              {t("contact") ?? "Contato"}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-steel hover:text-charcoal cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={classnames(
                    "block px-3 py-2 text-sm font-medium rounded-lg",
                    themeConfig.defaultTransition,
                    isActive
                      ? "text-neo-600 bg-neo-50"
                      : "text-steel hover:text-charcoal hover:bg-gray-50"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                handleLocaleSwitch();
                setIsOpen(false);
              }}
              className={classnames(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer w-full",
                "text-steel hover:text-charcoal hover:bg-gray-50",
                themeConfig.defaultTransition
              )}
              aria-label={`Switch to ${nextLocale}`}
            >
              <Globe className="h-4 w-4" />
              {switchLabel}
            </button>
            <div className="pt-2 px-3">
              <Button size="sm" color="neo" fullWidth>
                {t("contact") ?? "Contato"}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
