"use client";

/**
 * A casca do site, montada só com blocos do Cerneo DS: SiteHeader, Footer e
 * CookieConsent. Mais a troca de página pela View Transition do DS e o botão
 * de tema. Nada de layout feito à mão.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname as useRawPathname, useRouter as useRawRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button, CookieConsent, Footer, IconButton, Link, SiteHeader } from "@cerneo/ui";
import type { NavMenuItem } from "@cerneo/ui";
import { routing } from "../i18n/routing";
import { usePathname, useRouter } from "../i18n/navigation";
import { ANCHORS, COMPANY, CONTACT_EMAIL, NANAPET_URL, href } from "../lib/site";
import { applyTheme, ensureTheme, type Theme } from "../lib/theme";

const LANG_LABEL: Record<string, string> = { "pt-BR": "PT", en: "EN", es: "ES" };
const CURRENT: Record<string, string> = { "/about": "about", "/people-culture": "peopleCulture" };

/* ---------- Tema ---------- */

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

/** Alterna claro/escuro no `data-theme` do `<html>` e grava a escolha. */
function ThemeToggle() {
  const t = useTranslations("common.header");
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? t("themeDark") : t("themeLight");
  const icon = theme === "dark" ? "sun" : "moon";
  return <IconButton icon={icon} label={label} onClick={() => applyTheme(next)} />;
}

/* ---------- Barra ---------- */

export function SiteHeaderBar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const items: NavMenuItem[] = [
    {
      id: "services",
      label: t("nav.services"),
      items: [
        { id: "s-product", label: t("nav.servicesProduct"), description: t("nav.servicesProductDesc"), icon: "rocket", href: href(locale, "home", ANCHORS.services) },
        { id: "s-consulting", label: t("nav.servicesConsulting"), description: t("nav.servicesConsultingDesc"), icon: "workflow", href: href(locale, "home", ANCHORS.services) },
        { id: "s-team", label: t("nav.servicesTeam"), description: t("nav.servicesTeamDesc"), icon: "users", href: href(locale, "home", ANCHORS.services) },
      ],
    },
    { id: "products", label: t("nav.products"), href: href(locale, "home", ANCHORS.products) },
    { id: "about", label: t("nav.about"), href: href(locale, "about") },
    { id: "peopleCulture", label: t("nav.peopleCulture"), href: href(locale, "peopleCulture") },
  ];

  /*
   * O SiteHeader aceita um nó próprio no lugar do CTA; ele aparece na barra
   * (≥ 600 px) e no rodapé da gaveta. O botão de tema vai junto, porque a barra
   * não tem outro encaixe (pedido ao DS em docs/pedidos-landing-ds.md).
   */
  const cta = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--cn-space-2)", flexWrap: "wrap", width: "100%" }}>
      <ThemeToggle />
      <Button variant="primary" href={href(locale, "contact")}>
        {t("header.cta")}
      </Button>
    </span>
  );

  return (
    <SiteHeader
      transparent={pathname === "/"}
      homeHref={href(locale, "home")}
      homeLabel={t("header.homeLabel")}
      items={items}
      current={CURRENT[pathname]}
      cta={cta}
      languages={routing.locales.map((l) => ({ value: l, label: LANG_LABEL[l], name: t(`languages.${l}`) }))}
      language={locale}
      onLanguageChange={(next) => router.replace(pathname, { locale: next as (typeof routing.locales)[number] })}
      languageLabel={t("header.language")}
      skipLabel={t("header.skip")}
      menuLabel={t("header.menu")}
      menuTitle={t("header.menu")}
      navLabel={t("header.navLabel")}
    />
  );
}

/* ---------- Rodapé ---------- */

export function SiteFooter({ year }: { year: number }) {
  const t = useTranslations("common");
  const locale = useLocale();
  return (
    <Footer
      label={t("footer.label")}
      externalLabel={t("link.external")}
      tagline={t("footer.tagline")}
      columns={[
        {
          label: t("footer.services"),
          links: [
            { label: t("nav.servicesProduct"), href: href(locale, "home", ANCHORS.services) },
            { label: t("nav.servicesConsulting"), href: href(locale, "home", ANCHORS.services) },
            { label: t("nav.servicesTeam"), href: href(locale, "home", ANCHORS.services) },
          ],
        },
        {
          label: t("footer.products"),
          links: [
            { label: "Studios", href: href(locale, "home", ANCHORS.products) },
            { label: "Forge", href: href(locale, "home", ANCHORS.products) },
            { label: "NanaPet", href: NANAPET_URL, external: true },
          ],
        },
        {
          label: t("footer.company"),
          links: [
            { label: t("nav.about"), href: href(locale, "about") },
            { label: t("nav.peopleCulture"), href: href(locale, "peopleCulture") },
            { label: t("nav.contact"), href: href(locale, "contact") },
          ],
        },
        {
          label: t("footer.legal"),
          links: [
            { label: t("nav.privacy"), href: href(locale, "privacy") },
            { label: t("nav.terms"), href: href(locale, "terms") },
            { label: t("nav.conduct"), href: href(locale, "conduct") },
            { label: t("nav.antiCorruption"), href: href(locale, "antiCorruption") },
            { label: t("nav.whistleblowing"), href: href(locale, "whistleblowing") },
          ],
        },
      ]}
      address={[
        COMPANY.legalName,
        `CNPJ ${COMPANY.cnpj}`,
        COMPANY.street,
        COMPANY.city,
        `CEP ${COMPANY.cep}`,
        <Link key="email" href={`mailto:${CONTACT_EMAIL}`} tone="muted">
          {CONTACT_EMAIL}
        </Link>,
      ]}
      legal={t("footer.rights", { year, company: COMPANY.legalName })}
      legalLinks={[
        { label: t("footer.privacy"), href: href(locale, "privacy") },
        { label: t("footer.terms"), href: href(locale, "terms") },
        { label: t("footer.cookies"), href: "#cookies" },
      ]}
    />
  );
}

/* ---------- Cookies e análise ---------- */

const CONSENT_KEY = "cerneo-cookies";
type Consent = Record<string, boolean>;
const consentListeners = new Set<() => void>();
let consentCache: { raw: string | null; value: Consent | null } = { raw: null, value: null };

function readConsent(): Consent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    raw = null;
  }
  if (raw !== consentCache.raw) {
    let value: Consent | null = null;
    try {
      value = raw ? (JSON.parse(raw) as Consent) : null;
    } catch {
      value = null;
    }
    consentCache = { raw, value };
  }
  return consentCache.value;
}
function subscribeConsent(cb: () => void) {
  consentListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    consentListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const noopSubscribe = () => () => {};

/**
 * LGPD: a barra aparece na primeira visita, depois da hidratação (quem já
 * escolheu não vê a barra piscar). A categoria "Análise" continua na barra e
 * gravada no consentimento, mas hoje nada a usa: a Vercel Analytics saiu com a
 * ida para o K3s e a substituta ainda não foi escolhida
 * (docs/pedidos-landing-ds.md). Quem vier deve carregar só com
 * `consent?.analytics`. "Cookies" no rodapé (`#cookies`) reabre as preferências.
 */
export function SiteConsent() {
  const t = useTranslations("common.cookies");
  const locale = useLocale();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash !== "#cookies") return;
      history.replaceState(null, "", window.location.pathname + window.location.search);
      setReopened(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = hydrated && (reopened || consent === null);

  return (
    <>
      <CookieConsent
        open={open}
        onOpenChange={(v) => {
          if (!v) setReopened(false);
        }}
        onChange={() => consentListeners.forEach((cb) => cb())}
        storageKey={CONSENT_KEY}
        defaultValue={consent ?? undefined}
        categories={[
          { id: "necessary", label: t("necessary"), description: t("necessaryDesc"), locked: true },
          { id: "analytics", label: t("analytics"), description: t("analyticsDesc") },
        ]}
        title={t("title")}
        description={t("description")}
        policyHref={href(locale, "privacy")}
        policyLabel={t("policy")}
        acceptLabel={t("accept")}
        rejectLabel={t("reject")}
        customizeLabel={t("customize")}
        saveLabel={t("save")}
        dialogTitle={t("dialogTitle")}
        dialogDescription={t("dialogDescription")}
        lockedLabel={t("locked")}
      />
    </>
  );
}

/* ---------- Troca de página ---------- */

/**
 * Os blocos do DS renderizam `<a href>`. Este ouvinte leva todo link interno
 * para o roteador do Next (sem recarregar) e cruza o conteúdo pela View
 * Transition do DS (`cn-main`). Sem suporte ou com movimento reduzido, a troca
 * é direta. Depois da troca, o foco vai ao `h1` da página nova.
 */
export function NavTransitions() {
  const router = useRawRouter();
  const pathname = useRawPathname();
  const settle = useRef<(() => void) | null>(null);
  const focusNext = useRef(false);

  useEffect(() => {
    settle.current?.();
    settle.current = null;
    if (!focusNext.current) return;
    focusNext.current = false;
    if (window.location.hash) return;
    const h = document.querySelector<HTMLElement>("#conteudo h1");
    if (!h) return;
    if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
    h.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    ensureTheme();
    const go = (to: string) => {
      focusNext.current = true;
      const still =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        getComputedStyle(root).getPropertyValue("--cn-motion-distance").trim() === "0";
      if (!document.startViewTransition || still) {
        router.push(to);
        return;
      }
      root.dataset.vt = "nav";
      const vt = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            settle.current = resolve;
            router.push(to);
            window.setTimeout(resolve, 1200);
          }),
      );
      vt.finished.finally(() => {
        delete root.dataset.vt;
      });
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/api/")) return;
      // Mesma página: só a âncora, o navegador resolve.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      go(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
