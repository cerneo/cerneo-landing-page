import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import tokens from "@cerneo/tokens/json";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const P = tokens.primitives;
const DARK = tokens.resolved.dark.cerneo;

const asset = (file: string) => readFile(join(process.cwd(), "src/og", file));

/**
 * Imagem de Open Graph da Cerneo: fundo ink, assinatura oficial para fundo
 * escuro, título em Plus Jakarta Sans e a faixa do gradiente Cerneo a 110°.
 */
export async function ogImage({ eyebrow, title, tagline }: { eyebrow?: string; title: string; tagline: string }) {
  const [bold, medium, logo] = await Promise.all([
    asset("fonts/pjs-700.woff"),
    asset("fonts/pjs-500.woff"),
    asset("cerneo-assinatura-cor-fundo-escuro.svg"),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: P["color.ink"],
          color: P["color.paper"],
          fontFamily: "Plus Jakarta Sans",
          padding: "64px 72px 0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori só desenha <img> */}
        <img src={logoSrc} width={300} height={98} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
          {eyebrow ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: DARK["text.muted"] }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, background: P["color.yellow.200"] }} />
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: title.length > 48 ? 64 : 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>{title}</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: DARK["text.muted"] }}>{tagline}</div>
        </div>
        <div style={{ display: "flex", height: 20, margin: "0 -72px", background: P["gradient.cerneo"] }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Plus Jakarta Sans", data: bold, weight: 700, style: "normal" },
        { name: "Plus Jakarta Sans", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
