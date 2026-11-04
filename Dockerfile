# syntax=docker/dockerfile:1.7

# Site público da Cerneo (cerneo.com.br) para o K3s. Next em `output: standalone`
# (next.config.ts): a imagem roda `node server.js` sem o node_modules inteiro.
#
# O REGISTRY PRIVADO. `@cerneo/tokens` e `@cerneo/ui` vêm do GitHub Packages
# privado; o `.npmrc` lê `${NPM_TOKEN}`. O token entra SÓ como secret do
# BuildKit, montado em /run/secrets/npm_token durante o `npm ci` e nunca escrito
# em disco: nada de ARG/ENV, então nenhum layer nem o `docker history` o carregam.
#   docker buildx build --secret id=npm_token,env=NPM_TOKEN ...
# (ver docs/deploy-k8s.md).
#
# Nenhum `NEXT_PUBLIC_*` nem segredo no build: `RESEND_API_KEY`,
# `CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL` são lidos em runtime pela rota
# /api/contact, a cada pedido. A mesma imagem serve qualquer ambiente.
#
# CROSS-BUILD. `deps` e `builder` rodam na arquitetura da MÁQUINA
# ($BUILDPLATFORM): no Mac arm64, o `next build` (Turbopack) sob qemu amd64
# morre com `qemu: uncaught target signal 11` e o build trava (03/11, nos
# builders `nana` e `amd64builder`). O que sai do build é JS + wasm; o único
# binário nativo que o standalone carrega é o `sharp` (otimização do
# `next/image`, que o site não usa: `images.unoptimized` no next.config.ts), e
# ele é removido abaixo. O `node` do runtime vem da imagem da plataforma alvo.

FROM --platform=$BUILDPLATFORM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_token,required=true \
    NPM_TOKEN="$(cat /run/secrets/npm_token)" \
    npm ci --no-audit --no-fund \
 && rm -f .npmrc

FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` direto, e não `npm run build`: o npm leria o `.npmrc` e
# reclamaria do `${NPM_TOKEN}` que, de propósito, não existe aqui.
RUN rm -f .npmrc && node_modules/.bin/next build \
 && rm -rf .next/standalone/node_modules/sharp .next/standalone/node_modules/@img \
 && if find .next/standalone -name '*.node' | grep -q .; then \
      echo 'binário nativo no standalone: o cross-build não serve mais' >&2; \
      find .next/standalone -name '*.node' >&2; exit 1; \
    fi

# --- Runtime ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Arquivos do app são do root e só leitura para o processo; o único lugar
# gravável é o cache do Next (no K8s, um emptyDir com readOnlyRootFilesystem).
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN set -e; \
    if [ ! -f server.js ]; then echo 'server.js não está na raiz do standalone: o layout mudou' >&2; exit 1; fi; \
    if [ ! -f src/og/fonts/pjs-700.woff ]; then echo 'src/og não entrou no standalone (outputFileTracingIncludes)' >&2; exit 1; fi; \
    mkdir -p .next/cache; chown node:node .next/cache

# `node` (uid 1000) já existe na imagem oficial.
USER 1000:1000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "server.js"]
