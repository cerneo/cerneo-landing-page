# Deploy no K3s e virada do cerneo.com.br (saída da Vercel)

Runbook da troca de hospedagem do site público: da Vercel para o K3s da Cerneo
(nó `kalender-k3s`, mesmo cluster do Studios e da NanaPet). **Nada disto foi
executado**: imagem não publicada, nada aplicado, DNS intocado. Cada passo é do
dono, nesta ordem.

| Peça | Onde |
| --- | --- |
| Imagem | `Dockerfile` deste repo → `ghcr.io/cerneo/cerneo-site:sha-<commit>` |
| Manifestos | `infra-cerneo`, branch `landing-k8s`: `apps/cerneo-site/` (namespace, Deployment, Service, Ingress, NetworkPolicy), `platform/ci-rbac/cerneo-site.yaml`, entradas no `kustomization.yaml` da raiz e no `deploy-service.yml` |
| Namespace | `cerneo-site` |
| Segredos | `cerneo-site/cerneo-site-resend` (chave `RESEND_API_KEY`) e `cerneo-site/ghcr-secret` |
| TLS | `cert-manager.io/cluster-issuer: kalender-letsencrypt` (DNS-01 na Cloudflare para `cerneo.com.br`), Secret `cerneo-site-tls` com os dois nomes |
| Canônico | `https://www.cerneo.com.br` (`src/lib/site.ts`); o apex responde 308 para o www, como a Vercel já faz |

## Variáveis de ambiente

Todas lidas em **runtime** (nenhuma `NEXT_PUBLIC_*`; a mesma imagem serve qualquer ambiente):

| Variável | Obrigatória | Origem no K8s | Uso |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | sim (sem ela `/api/contact` responde 500 `not_configured`) | Secret `cerneo-site-resend` | envio do formulário de contato |
| `CONTACT_TO_EMAIL` | não (padrão `contato@cerneo.com.br`) | valor no Deployment | destinatário |
| `CONTACT_FROM_EMAIL` | não (padrão `Cerneo Site <no-reply@notifications.cerneo.com.br>`) | valor no Deployment | remetente (domínio verificado no Resend) |
| `PORT` / `HOSTNAME` | já na imagem (`3000` / `0.0.0.0`); o Deployment repete `HOSTNAME` porque o kubelet o sobrescreve com o nome do pod | Deployment | `server.js` do standalone |
| `NODE_ENV`, `NEXT_TELEMETRY_DISABLED` | já na imagem | imagem | — |
| `DD_ENV`, `DD_SERVICE`, `DD_VERSION` | não | Deployment | tags do Datadog (logs) |

Só no **build**: `NPM_TOKEN` (GitHub Packages, `read:packages`), como secret do
BuildKit — nunca ARG/ENV, não fica em layer nenhum.

## 0. Antes de começar

- `kubectl config current-context` = `cerneo-k3s` (Tailscale/NetBird de pé) e
  credencial com permissão de criar namespace (o dono; o `github-deployer` do CI não cria).
- O `infra-cerneo` `main` está **atrás do cluster** (Studios, bucket, portal de
  marca). Aplique **só** `apps/cerneo-site/` e `platform/ci-rbac/cerneo-site.yaml`,
  nunca a raiz inteira (`kubectl apply -k .`).
- Revise e commite a branch `landing-k8s` do `infra-cerneo` (worktree
  `../infra-cerneo-landing-k8s`), que foi deixada sem commit.

## 1. Construir e publicar a imagem

Do Mac (o GitHub Actions está parado), no worktree desta branch:

```sh
cd cerneo-landing-page/.claude/worktrees/rebrand-ds   # ou o checkout que for ao ar
git status --short                                      # limpo: a tag é o commit
TAG="sha-$(git rev-parse --short=7 HEAD)"
IMAGE="ghcr.io/cerneo/cerneo-site:$TAG"

# login no ghcr sem eco (o token do gh tem write:packages)
gh auth token | docker login ghcr.io -u jmaciel33 --password-stdin

# build linux/amd64 (o nó é amd64) e push. O token vai pelo ambiente do
# processo direto para o secret do BuildKit; não aparece no comando nem na imagem.
NPM_TOKEN="$(gh auth token)" docker buildx build \
  --builder amd64builder --platform linux/amd64 \
  --secret id=npm_token,env=NPM_TOKEN \
  -t "$IMAGE" --push .
```

Notas:

- Commits só de `docs/` não mudam a imagem (`.dockerignore` exclui `docs/`);
  a tag pode continuar a do último commit de código.
- O `Dockerfile` faz cross-build: `deps` e `builder` rodam na arquitetura do Mac
  (`--platform=$BUILDPLATFORM`) e só o runtime é amd64. Em 03/11 o `next build`
  sob qemu amd64 morria com `qemu: uncaught target signal 11` e o build travava
  (nos builders `nana` e `amd64builder`). Com o cross-build, o build amd64 leva
  o mesmo tempo do nativo; qualquer builder com `linux/amd64` serve.
- Na primeira publicação o pacote `cerneo-site` nasce **privado** na org; é o
  que o `ghcr-secret` espera. Opcional: ligar o pacote ao repositório
  (`Package settings → Connect repository`).
- Conferência de que o token não está na imagem (feita em 03/11 na imagem
  local, 0 ocorrências):

  ```sh
  docker history --no-trunc "$IMAGE" | grep -c NPM_TOKEN          # 0
  docker image inspect "$IMAGE" --format '{{json .Config.Env}}'   # sem NPM_TOKEN
  ```

## 2. Namespace, RBAC do CI e segredos

No worktree do infra (`infra-cerneo-landing-k8s`, branch `landing-k8s`):

```sh
kubectl apply -f apps/cerneo-site/namespace.yaml
kubectl apply -f platform/ci-rbac/cerneo-site.yaml   # para o deploy-service.yml quando o Actions voltar
```

**ghcr-secret** — copia o que já funciona no `cerneo-studios` (nada vai para o terminal):

```sh
kubectl get secret ghcr-secret -n cerneo-studios -o json \
  | jq '{apiVersion, kind, type, data, metadata: {name: .metadata.name, namespace: "cerneo-site"}}' \
  | kubectl apply -f -
```

**Chave do Resend** — recomendado: criar uma chave **nova** no painel do Resend
(permissão *Sending access*, domínio `notifications.cerneo.com.br`), em vez de
reaproveitar a da Vercel; assim a da Vercel é revogada no fim sem afetar o K3s.
Grave-a num arquivo sem quebra de linha e crie o Secret a partir dele:

```sh
umask 077
pbpaste | tr -d '\n' > /tmp/resend_api_key       # cole a chave copiada do painel
kubectl create secret generic cerneo-site-resend -n cerneo-site \
  --from-file=RESEND_API_KEY=/tmp/resend_api_key \
  --dry-run=client -o yaml | kubectl apply -f -
rm -f /tmp/resend_api_key
kubectl get secret cerneo-site-resend -n cerneo-site -o jsonpath='{.data.RESEND_API_KEY}' | wc -c   # > 0, sem mostrar
```

Quando o Actions voltar, cadastre o mesmo valor no GitHub Secret
`CERNEO_SITE_RESEND_API_KEY` do `infra-cerneo` (`gh secret set CERNEO_SITE_RESEND_API_KEY < arquivo`):
o step "Sync cerneo-site secrets" do `deploy-service.yml` passa a repô-lo.

## 3. Aplicar

```sh
NAMESPACE=cerneo-site SERVICES=cerneo-site IMAGE_TAG="$TAG" \
  /opt/homebrew/bin/bash scripts/deploy-service.sh
```

O script fixa a tag em `apps/cerneo-site/cerneo-site/kustomization.yaml`,
aplica `kubectl apply -k apps/cerneo-site/cerneo-site/`, espera o rollout das
2 réplicas e faz `rollout undo` se falhar. Commite a tag fixada depois.

```sh
kubectl -n cerneo-site get deploy,pods,svc,ingress,netpol
kubectl -n cerneo-site logs deploy/cerneo-site --tail=20
```

## 4. TLS (antes do DNS)

O Ingress traz `cert-manager.io/cluster-issuer: kalender-letsencrypt`; o
cert-manager cria o Certificate `cerneo-site-tls` com `www.cerneo.com.br` e
`cerneo.com.br`. A zona `cerneo.com.br` está no seletor **DNS-01 (Cloudflare)**
do ClusterIssuer, então o certificado sai **com o DNS ainda na Vercel** — não
depende da porta 80 nem de para onde o record aponta.

```sh
kubectl -n cerneo-site get certificate cerneo-site-tls -w      # READY True (1–3 min)
kubectl -n cerneo-site describe certificate cerneo-site-tls     # se travar: Order/Challenge
kubectl -n cerneo-site get challenges
```

Não há CAA na zona `cerneo.com.br`, então o Let's Encrypt pode emitir.
**Não troque o DNS antes de `READY True`**: a Vercel manda HSTS de 2 anos, o
navegador recusa qualquer certificado inválido.

## 5. Verificar antes do DNS

Direto no Service (sem Ingress):

```sh
kubectl -n cerneo-site port-forward svc/cerneo-site 3477:3000 &
curl -s localhost:3477/healthz                                  # ok
curl -s -o /dev/null -w '%{http_code}\n' localhost:3477/pt-BR   # 200
kill %1
```

Pelo ingress-nginx, com o Host e o SNI de produção (prova o Ingress, o
certificado e o redirect do apex):

```sh
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8443:443 &
R="--resolve www.cerneo.com.br:8443:127.0.0.1 --resolve cerneo.com.br:8443:127.0.0.1"
curl -sI $R https://www.cerneo.com.br:8443/          # 307 -> /pt-BR (locale)
curl -sI $R https://cerneo.com.br:8443/pt-BR         # 308 -> https://www.cerneo.com.br/pt-BR
for p in pt-BR en es pt-BR/about en/contact es/privacy-policy pt-BR/nao-existe; do
  printf '%-22s ' $p; curl -s -o /dev/null -w '%{http_code}\n' $R https://www.cerneo.com.br:8443/$p
done                                                 # 200 ... e 404 no último
echo | openssl s_client -connect 127.0.0.1:8443 -servername cerneo.com.br 2>/dev/null \
  | openssl x509 -noout -issuer -ext subjectAltName  # Let's Encrypt, os dois nomes
# formulário: só validação, sem enviar e-mail
curl -s -X POST $R -H 'content-type: application/json' --data '{}' \
  https://www.cerneo.com.br:8443/api/contact         # 400 invalid_payload
kill %1
```

Opcional, pelo IP público (se o firewall da origem aceitar fora das faixas da Cloudflare):
`curl -sI --resolve www.cerneo.com.br:443:201.23.85.219 https://www.cerneo.com.br/pt-BR`.

Teste de envio real (um e-mail para `contato@`) só se o dono quiser, depois do DNS.

## 6. DNS

**Achados (03/11/2026, DNS público):**

- A zona é da **Cloudflare** (`NS cass.ns.cloudflare.com`, `kellen.ns.cloudflare.com`)
  e é **inteira gerenciada por OpenTofu** em `infra-cerneo/dns/zones/cerneo-com-br/`
  (state `gs://kalender-tofu-state/dns/cerneo-com-br`). Não edite no painel: o próximo apply desfaz.
- Hoje, apontando para a Vercel (DNS only, cinza):

  | Nome | Tipo | Conteúdo | TTL | Recurso tofu |
  | --- | --- | --- | --- | --- |
  | `cerneo.com.br` | CNAME (achatado; resolve `64.29.17.65`, `216.198.79.65`) | `cdefe16034b3b4d6.vercel-dns-017.com` | 600 | `cloudflare_record.cname_root` (`static.tf`) |
  | `www` | CNAME | `cdefe16034b3b4d6.vercel-dns-017.com` | 600 | `cloudflare_record.cname_www` (`static.tf`) |
  | `_vercel` | TXT ×3 | `vc-domain-verify=...` | 600 | `txt__vercel`, `_2`, `_3` |

- O resto da zona (MX/SPF/DKIM/DMARC do Google, verificações do Google,
  Facebook e TikTok em `www` TXT) **não muda**. `www` TXT convive com `www` A.
- O IP do cluster é `201.23.85.219` (`terraform.tfvars`, o mesmo de `auth.cerneo.com.br`).
- Hoje a Vercel responde `cerneo.com.br` → 308 → `www.cerneo.com.br` → 307 → `/pt-BR`; o Ingress reproduz o mesmo.

**A troca** (os dois nomes viram A para o cluster, pelo mapa `records`, que já
segue o IP nas migrações mensais da Magalu):

1. `dns/zones/cerneo-com-br/static.tf`: apagar `cloudflare_record.cname_root` e
   `cloudflare_record.cname_www` (manter os `_vercel` até o fim do passo 8 — servem ao rollback).
2. `dns/zones/cerneo-com-br/variables.tf`, no `default` de `records`:

   ```hcl
       # Site publico (apps/cerneo-site), saiu da Vercel. Proxied como studios/app:
       # o Ingress responde o apex com 308 para o www; o certificado e DNS-01.
       "cerneo.com.br" = { proxied = true }
       www             = { proxied = true }
   ```

   Resultado: `cerneo.com.br A 201.23.85.219` e `www A 201.23.85.219`, proxied
   (TTL automático). Proxied é o que se recomenda (esconde o IP da origem,
   SSL `strict` da zona valida o certificado LE, renovação por DNS-01 não sofre).
   Se o dono preferir DNS only: `proxied = false` (TTL 60).
3. Aplicar **em dois tempos** — a Cloudflare recusa criar `A` num nome que ainda
   tem `CNAME`, e o tofu não garante a ordem destruir-antes-de-criar entre recursos diferentes.
   Com o Actions parado, do Mac (`CLOUDFLARE_API_TOKEN` no ambiente e `gcloud auth application-default login` para o state):

   ```sh
   cd infra-cerneo/dns/zones/cerneo-com-br
   tofu init
   tofu plan                                         # esperado: 2 destroy (CNAME), 2 add (A)
   tofu apply -target=cloudflare_record.cname_root -target=cloudflare_record.cname_www
   tofu apply                                        # cria os dois A
   ```

   Entre os dois applies o site fica sem resposta por segundos. Com o Actions de volta, o
   mesmo é o `deploy-dns.yml` (zona `cerneo-com-br`), rodado duas vezes se o primeiro falhar no A.
4. Conferir:

   ```sh
   dig +short cerneo.com.br @1.1.1.1; dig +short www.cerneo.com.br @1.1.1.1   # IPs da Cloudflare (104.21.x / 172.67.x)
   curl -sI https://cerneo.com.br | grep -iE '^HTTP|^location|^server'        # 308 -> www, server cloudflare
   curl -sI https://www.cerneo.com.br/pt-BR | grep -iE '^HTTP|^server|x-vercel'  # 200, sem x-vercel-*
   ```

   Resolvedores com o CNAME antigo em cache levam até 10 min (TTL 600).

## 7. Rollback para a Vercel

Enquanto o projeto da Vercel tiver os domínios e os `_vercel` TXT existirem, é só DNS:

1. Reverter o commit do passo 6 (volta `cname_root` e `cname_www`, sai `cerneo.com.br`/`www` do `records`).
2. Os mesmos dois tempos: `tofu apply -target='cloudflare_record.cluster["cerneo.com.br"]' -target='cloudflare_record.cluster["www"]'`, depois `tofu apply`.
3. A Vercel volta a servir em minutos (se o certificado dela tiver vencido nesse meio-tempo, ela reemite sozinha).

Atenção: a produção da Vercel é o **site antigo** (o que estiver em produção lá),
não esta branch. O rollback devolve o visual antigo.

O cluster pode ficar como está (Ingress sem tráfego) ou sair com
`kubectl delete -k apps/cerneo-site/cerneo-site/`.

## 8. Na Vercel, depois (só com o K3s estável, 1–2 semanas)

1. Projeto → *Settings → Git*: desconectar o repositório (cada push deixaria de virar deploy).
2. *Settings → Domains*: remover `cerneo.com.br` e `www.cerneo.com.br`.
3. *Settings → Environment Variables*: apagar `RESEND_API_KEY` e `NPM_TOKEN`;
   **revogar** no Resend a chave que a Vercel usava e, no GitHub, o token que
   foi posto lá como `NPM_TOKEN`.
4. Pausar ou apagar o projeto.
5. No tofu, apagar `txt__vercel`, `txt__vercel_2` e `txt__vercel_3` (`static.tf`) e aplicar.
   Daqui em diante não há mais rollback para a Vercel.
6. Analytics: a Vercel Analytics já saiu do código; a substituta é decisão
   pendente (`docs/pedidos-landing-ds.md`, item 14).

## Referências do que foi verificado em 03/11 (imagem `sha-3f7ed60`, linux/amd64, 222 MB)

- Build: `node:22-alpine`, standalone (`/app` com 57 MB, sem nenhum `.node`), processo
  `next-server` como `node` (uid 1000); roda com `--read-only`, `--cap-drop ALL`,
  `no-new-privileges` e só `/app/.next/cache` e `/tmp` graváveis; `HEALTHCHECK` da imagem `healthy`.
- 91 verificações do smoke test, 0 falhas.
- 27 páginas (9 rotas × 3 locales) e as 27 imagens de OG em 200; `/` → 307 `/pt-BR`
  (ou `/en` por `Accept-Language`); páginas inexistentes 404; os 17 assets de
  `/_next/static` da home em 200 com `immutable`; `/healthz` 200.
- `/api/contact`: JSON inválido 400 `invalid_json`; campos faltando 400
  `invalid_payload`; honeypot 200 sem envio; payload válido sem chave 500 `not_configured`; GET 405.
- `NPM_TOKEN`: 0 ocorrências em `docker history`, no `Config.Env` e no conteúdo de todos os layers.
- Ruído conhecido: um caminho com ponto que não existe (`/robots.txt`, `/x.png`) responde 404
  certo, mas o Next 16 registra `Error: Internal: NoFallbackError` no log — vai aparecer no
  Datadog. O site não tem `robots.txt` nem `sitemap.xml` (o antigo também não: respondia HTML).
