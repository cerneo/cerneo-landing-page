#!/usr/bin/env node
/**
 * Os ícones do site, gerados do `Emblem` do Cerneo DS (o C oficial, versão
 * `cor`), nunca redesenhados aqui. Mesmo processo do Studios
 * (`studios-webui/scripts/gen-icons.mjs`). Saem em `public/`:
 *
 *   icon.svg                     o tile (C sobre ink, raio de 25%, o C em 2/3 do lado)
 *   favicon.ico                  16, 32 e 48 px (PNG dentro do ICO)
 *   apple-touch-icon.png         180 px, quadrado cheio (o iOS arredonda sozinho)
 *   icon-192.png · icon-512.png  para o manifest
 *   icon-maskable-512.png        área segura de 80% para Android
 *   manifest.webmanifest
 *
 * Cores e o C saem dos pacotes (`@cerneo/tokens/json`, `@cerneo/ui` Emblem). A
 * cada versão nova do DS: `node scripts/gen-icons.mjs` e commite o `public/`.
 * `sharp` vem com o Next (dependência opcional dele).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(raiz, "package.json"));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const tokens = require("@cerneo/tokens/json");
const { Emblem } = await import(pathToFileURL(join(raiz, "node_modules/@cerneo/ui/dist/brand/Emblem.js")).href);

const INK = tokens.primitives["color.ink"];
if (typeof INK !== "string") throw new Error("tokens sem color.ink");

/** O `<svg>` do C, como o DS o desenha (sem o `<span>` em volta). */
function simbolo() {
  const html = renderToStaticMarkup(React.createElement(Emblem, { tone: "cor", size: 276, title: "" }));
  const m = /<svg[\s\S]*<\/svg>/.exec(html);
  if (!m) throw new Error("Emblem não renderizou um <svg>");
  return m[0];
}

/** O tile: `lado` px, o C em `fracao` do lado e centrado. `raio` 0 = quadrado cheio. */
function tile(lado, raio, fracao = 2 / 3) {
  const c = lado * fracao;
  const o = (lado - c) / 2;
  const svg = simbolo()
    .replace(/<svg /, `<svg x="${o}" y="${o}" `)
    .replace(/width="[^"]*"/, `width="${c}"`)
    .replace(/height="[^"]*"/, `height="${c}"`)
    .replace(/ style="[^"]*"/, "")
    .replace(/ aria-hidden="true"/, "")
    .replace(/ focusable="false"/, "");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">` +
    `<title>Cerneo</title>` +
    `<rect width="${lado}" height="${lado}" rx="${raio}" fill="${INK}"/>` +
    svg +
    `</svg>`
  );
}

const png = (svg, lado) => sharp(Buffer.from(svg)).resize(lado, lado).png().toBuffer();

/** ICO com PNGs dentro (aceito por todo navegador desde o IE11). */
function ico(imagens) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(imagens.length, 4);
  let deslocamento = 6 + 16 * imagens.length;
  const entradas = imagens.map(({ lado, dado }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(lado >= 256 ? 0 : lado, 0);
    e.writeUInt8(lado >= 256 ? 0 : lado, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(dado.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += dado.length;
    return e;
  });
  return Buffer.concat([cabecalho, ...entradas, ...imagens.map((i) => i.dado)]);
}

const pub = join(raiz, "public");
mkdirSync(pub, { recursive: true });

const arredondado = tile(512, 128);
const cheio = tile(512, 0);
const mascaravel = tile(512, 0, 0.5);
writeFileSync(join(pub, "icon.svg"), `${arredondado}\n`);
writeFileSync(join(pub, "icon-192.png"), await png(arredondado, 192));
writeFileSync(join(pub, "icon-512.png"), await png(arredondado, 512));
writeFileSync(join(pub, "icon-maskable-512.png"), await png(mascaravel, 512));
writeFileSync(join(pub, "apple-touch-icon.png"), await png(cheio, 180));
writeFileSync(
  join(pub, "favicon.ico"),
  ico(await Promise.all([16, 32, 48].map(async (lado) => ({ lado, dado: await png(arredondado, lado) })))),
);
writeFileSync(
  join(pub, "manifest.webmanifest"),
  `${JSON.stringify(
    {
      name: "Cerneo",
      short_name: "Cerneo",
      description: "Produtos digitais e consultoria de tecnologia para negócios que não param.",
      start_url: "/",
      scope: "/",
      display: "browser",
      lang: "pt-BR",
      background_color: INK,
      theme_color: INK,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      ],
    },
    null,
    2,
  )}\n`,
);
console.log("ícones gerados em public/: icon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png, manifest.webmanifest");
