# Pedidos da landing ao Cerneo DS

O que faltou no Cerneo DS (pedidos abertos com `@cerneo/ui` 0.1.1 + `@cerneo/tokens` 0.2.1; a landing hoje usa 0.1.2 + 0.2.2) ao montar o cerneo.com.br. Nada disto foi copiado para cá: onde houve contorno, ele está descrito e sai quando o DS resolver.

Ordem: primeiro o que dá erro, depois o que força contorno, depois conforto.

## Erros

1. ~~**`Accordion` passa `inert=""`**~~ **Atendido no DS 0.2.2** (`@cerneo/ui` 0.1.2, build local ainda sem release). `Accordion` e `Testimonial` passam a usar um valor de `inert` aceito pelo React 19; o aviso sumiu do console no Contato e nas cinco páginas legais (tour de 03/11: 0 erros em 120 capturas). Era: o painel fechado recebia `inert=""` e o React 19 em dev acusava `Received an empty string for a boolean attribute inert`.

## Contornos que a landing faz hoje

2. **`SiteHeader` sem encaixe para o seletor de tema.** O botão de tema (IconButton sol/lua) vai junto do CTA, num nó próprio passado em `cta`; por isso aparece na barra e no rodapé da gaveta. Pedido: um slot `utilities` (ou `themeSwitch`) entre o idioma e o CTA, repetido na gaveta.
3. **Blocos renderizam `<a href>` e não aceitam o `Link` do Next.** `SiteHeader`, `NavMenu`, `Footer`, `FeatureGrid`, `CTABand`, `HeroSection`, `ErrorPage` e `ProductShowcase` montam âncoras próprias. A landing intercepta os cliques internos no `document` (`src/components/SiteChrome.tsx`, `NavTransitions`) para usar o roteador e a View Transition. Pedido: um provedor (`<CerneoLinkProvider as={NextLink}>`) que os blocos usem em todo link interno.
4. **View Transition de site.** O DS só nomeia `cn-main` em `.cn-appshell__main`. A landing repete a regra do kit (`[data-vt=nav] .site-main { view-transition-name: cn-main }`). Pedido: uma classe pública (`.cn-vt-main`) e um helper `navigateWithTransition(apply)` que já respeite `--cn-motion-distance`.
5. ~~**`ProductShowcase` só aceita `studios | forge | originals`.**~~ **Atendido no DS 0.2.3** (`@cerneo/ui` 0.1.3, commit local no DS, ainda sem release). `product: "nanapet"` + `logo={<ProductLogo … />}` + `endorsement`; `layout="grid"` (duas colunas; um card sozinho ocupa a largura); `layout="portfolio"` + `seal` (o selo Cerneo Originals ao lado das marcas que ele endossa); `action.external` (nova aba + "abre em nova aba" no nome acessível, trocável por `externalLabel`). O `featured` deixou de esticar a faixa de gradiente (cerca de 550 px vazios no card do Studios). **Na home (04/11, pedido do dono):** Originals não é produto, é o selo das marcas e obras próprias. `#products` mostra só Studios e Forge (`grid`); a seção nova `#originals` usa `portfolio` com o lockup Cerneo Originals, "Roteiro e direção / Gravação e edição / Estreia e distribuição" e o card da NanaPet ("Uma marca Cerneo Originals", logo oficial em `public/brands/nanapet/logo-768.webp`, CTA para `NANAPET_URL` em nova aba). O menu ganhou "Originals" e o rodapé, a coluna "Cerneo Originals" com a NanaPet. O `Footer` sem a carta não deixa mais a terceira trilha vazia (DS 0.2.3).
6. **`Footer` não aceita item com `onClick`.** (O texto oculto de link externo foi atendido no DS 0.2.3: `Footer externalLabel`, que a landing passa com `common.link.external`.) O "Cookies" que reabre as preferências é um `href="#cookies"` ouvido por `hashchange`. Pedido: `externalLabel` repassado ao `Link` e `onClick` em `FooterLink`.
7. **`ContactSection` sem campo opcional e sem honeypot.** O formulário antigo tinha "Empresa (opcional)" e um campo-isca contra robôs; o do DS não tem nenhum dos dois. A rota `/api/contact` ainda aceita `company` e o honeypot `website`, mas o formulário não os envia. Pedido: `extraFields` (texto curto opcional) e `honeypot` embutido.
8. **`CookieConsent` nasce aberto no SSR** (`defaultOpen = true`) e só fecha depois de ler o `localStorage`: quem já escolheu vê a barra piscar. A landing controla `open` e só abre depois da hidratação. Pedido: começar fechado e abrir no mount quando não houver escolha gravada.

15. **Dados da empresa no rodapé.** **Atendido no DS 0.2.3:** `Footer address` (um `<address>`, uma linha por item). A landing passa razão social, CNPJ, endereço, CEP e e-mail de `COMPANY`/`CONTACT_EMAIL` (`src/lib/site.ts`), como o rodapé do site antigo; a linha legal volta a dizer "Cerneo Tecnologia LTDA". As páginas legais já citavam a razão social (o site antigo não punha CNPJ nelas).

## Pendente: release do DS 0.2.3

A validação local usa os tarballs gerados do DS (`vendor/cerneo-tokens-0.2.3.tgz` e `vendor/cerneo-ui-0.1.3.tgz`, fora do git). O `package.json` e o `package-lock.json` que apontam para `file:vendor/…` **não foram commitados**: no git, eles continuam no registry (0.2.2/0.1.2) até o release. Depois que o dono publicar `@cerneo/tokens@0.2.3` e `@cerneo/ui@0.1.3` no GitHub Packages:

```sh
rm -rf vendor
NPM_TOKEN="$(gh auth token)" npm i @cerneo/tokens@0.2.3 @cerneo/ui@0.1.3 --save-exact
git add package.json package-lock.json && git commit -m "DS 0.2.3 do registry"
```

O lock volta a resolver em `npm.pkg.github.com` e o `Dockerfile` original funciona sem mudança.

## Idiomas

9. **Textos padrão só em pt-BR.** O site tem pt-BR, en e es; para cada bloco a landing passa todos os rótulos (ContactSection: 38 chaves e 2 funções; CookieConsent: 13; SiteHeader: 6; Prose, Timeline, ErrorPage, Footer). Pedido: um `locale` no provedor do DS com as strings de en e es, mantendo as props para ajuste.
10. **`Link` externo** diz "abre em nova aba" por padrão, e os blocos que o usam por dentro (Footer, ContactSection "Abrir conversa") não deixam trocar.

## Peso e entrega

11. **`styles.css` tem 516 KB** (sem gzip). O CSS por grupo existe, mas o `base` (elementos, foco, `.cn-mark`) só vem dentro do `styles.css`. Pedido: exportar `@cerneo/ui/base.css` para um site importar só base + `core`, `forms`, `feedback`, `navigation`, `brand`, `blocks`, `marketing`, `motion`, `content`, `doodles`.
12. **Ícones e OG.** O Studios e a landing têm cada um uma cópia do `scripts/gen-icons.mjs` (favicon, apple-touch, manifest a partir do `Emblem`). A landing também monta a imagem de Open Graph à mão (`src/og/image.tsx`: ink, assinatura, título em Plus Jakarta Sans, faixa do gradiente a 110°). Pedido: os dois como ferramenta do pacote (`npx cerneo-icons`, `ogTemplate()`), com a fonte WOFF que o Satori lê.
13. **Tarball no repositório público.** A landing é pública e o `vendor/` com `cerneo-ui-*.tgz` publica o DS inteiro (privado, UNLICENSED). Pedido: um registry privado (GitHub Packages) ou uma decisão explícita de que o pacote compilado pode ser público.
   **Atendido (03/11):** pacotes no GitHub Packages privado (`npm.pkg.github.com`, escopo `@cerneo`); `.npmrc` lê `NPM_TOKEN` (token com `read:packages`). No K3s ele entra só no build da imagem, como secret do BuildKit (`docs/deploy-k8s.md`).

## Fora do DS: decisões da ida para o K3s

14. **Analytics sem substituta.** A `@vercel/analytics` saiu (03/11) porque só funciona hospedada na Vercel. A barra de cookies continua igual — categoria "Análise" opcional, gravada em `localStorage` (`SiteConsent`, `src/components/SiteChrome.tsx`) —, mas hoje nada carrega quando ela é aceita. **Decisão pendente do dono:** escolher a substituta (por exemplo Plausible ou Umami auto-hospedados no cluster, ambos sem cookie) e ligá-la só com `consent?.analytics`. Enquanto isso o site não mede visitas. Se a escolha não usar cookie nem identificar o visitante, reavaliar se a categoria "Análise" e o texto da política de privacidade (`privacy.*` em `messages/`, que cita "analytics") continuam fazendo sentido.
