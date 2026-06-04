"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
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

const localeConfig = [
  { code: "pt-BR", label: "PT", flag: "🇧🇷" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
] as const;

export function Navbar() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const currentLocale = localeConfig.find((l) => l.code === locale) ?? localeConfig[0];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLocaleSwitch(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
    setIsOpen(false);
  }

  return (
    <header
      data-component-name="Navbar"
      className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-gray-700/50 dark:bg-charcoal/80"
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
            <span className="text-xl font-bold text-charcoal dark:text-gray-100 tracking-tight uppercase">
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
                      ? "text-neo-600 bg-neo-50 dark:text-neo-400 dark:bg-neo-950"
                      : "text-steel hover:text-charcoal hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={classnames(
                  "p-2 rounded-lg cursor-pointer",
                  "text-steel hover:text-charcoal hover:bg-gray-50",
                  "dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5",
                  themeConfig.defaultTransition
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className={classnames(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                  "text-steel hover:text-charcoal hover:bg-gray-50",
                  "dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5",
                  themeConfig.defaultTransition
                )}
                aria-label="Change language"
              >
                <span className="text-base leading-none">{currentLocale.flag}</span>
                {currentLocale.label}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-slate-dark">
                  {localeConfig
                    .filter((l) => l.code !== locale)
                    .map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleLocaleSwitch(l.code)}
                        className={classnames(
                          "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer",
                          "text-steel hover:text-charcoal hover:bg-gray-50",
                          "dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5",
                          themeConfig.defaultTransition
                        )}
                      >
                        <span className="text-base leading-none">{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
            <Button size="sm" color="neo">
              {t("contact") ?? "Contato"}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-steel hover:text-charcoal dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 space-y-1">
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
                      ? "text-neo-600 bg-neo-50 dark:text-neo-400 dark:bg-neo-950"
                      : "text-steel hover:text-charcoal hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
            <div className="flex items-center gap-1 px-3 py-2">
              {localeConfig.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLocaleSwitch(l.code)}
                  disabled={l.code === locale}
                  className={classnames(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer",
                    themeConfig.defaultTransition,
                    l.code === locale
                      ? "text-neo-600 bg-neo-50 dark:text-neo-400 dark:bg-neo-950 cursor-default"
                      : "text-steel hover:text-charcoal hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  {l.label}
                </button>
              ))}
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={classnames(
                    "p-2 rounded-lg cursor-pointer",
                    "text-steel hover:text-charcoal hover:bg-gray-50",
                    "dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5",
                    themeConfig.defaultTransition
                  )}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
            </div>
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
