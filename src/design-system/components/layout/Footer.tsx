import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/navigation";
import { Container } from "./Container";

const productLinks = [
  { label: "Cerneo AI", href: "#" },
  { label: "Cerneo CRM", href: "#" },
  { label: "Cerneo Clinic", href: "#" },
  { label: "Cerneo Kalender", href: "#" },
];

const companyLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "peopleCulture", href: "/people-culture" },
];

const legalLinks = [
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/terms-of-use" },
];

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer
      data-component-name="Footer"
      className="bg-charcoal text-gray-300"
    >
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logo-cerneo.png"
                  alt="Cerneo"
                  width={24}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-white tracking-tight uppercase">
                  Cerneo
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                {t("footer.brand")}
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t("footer.products")}
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neo-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t("footer.company")}
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neo-400 transition-colors duration-300"
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t("footer.legal")}
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neo-400 transition-colors duration-300"
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Cerneo Tecnologia Ltda. {t("footer.rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
