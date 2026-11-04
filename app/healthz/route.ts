/**
 * Sonda do Kubernetes (liveness, readiness e startup). Só diz que o processo
 * Node responde: não chama o Resend nem nada de fora, para uma queda de
 * terceiro não reiniciar o site. Fora do proxy do next-intl (`proxy.ts`), então
 * não ganha prefixo de locale.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("ok\n", {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
