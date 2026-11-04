import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent directory makes Turbopack infer
  // the wrong workspace root, breaking module resolution in dev.
  turbopack: {
    root: __dirname,
  },
  // Imagem Docker do K3s (Dockerfile): `.next/standalone` traz o server.js e só
  // os node_modules que o runtime usa. A raiz do tracing é a mesma do
  // Turbopack, pelo mesmo motivo (o package-lock.json do diretório pai).
  output: "standalone",
  outputFileTracingRoot: __dirname,
  // As imagens de Open Graph leem as fontes e a assinatura com
  // `readFile(process.cwd() + "/src/og/...")`, que o tracing não enxerga.
  outputFileTracingIncludes: {
    "/**": ["./src/og/**/*"],
  },
};

export default withNextIntl(nextConfig);
