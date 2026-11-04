import type { Metadata } from "next";
import "@cerneo/tokens/css";
import "@cerneo/ui/styles.css";
import "./globals.css";
import messages from "../messages/pt-BR.json";
import { NotFoundView } from "../src/components/NotFoundView";
import { routing } from "../src/i18n/routing";
import { fontVariables } from "../src/lib/fonts";
import { THEME_INIT_SCRIPT } from "../src/lib/theme";

/*
 * 404 fora de um locale (caminhos que o proxy não reescreve, como `/x.php`).
 * O layout raiz só repassa os filhos, então este arquivo traz o próprio <html>.
 */
export const metadata: Metadata = { title: messages.common.notFound.metaTitle, robots: { index: false } };

export default function RootNotFound() {
  const n = messages.common.notFound;
  const nav = messages.common.nav;
  return (
    <html lang="pt-BR" className={fontVariables} data-brand="cerneo" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main id="conteudo" className="site-main">
          <NotFoundView
            locale={routing.defaultLocale}
            copy={{ ...n, services: nav.services, peopleCulture: nav.peopleCulture, contact: nav.contact }}
          />
        </main>
      </body>
    </html>
  );
}
