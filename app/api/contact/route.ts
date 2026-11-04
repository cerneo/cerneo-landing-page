import { NextResponse } from "next/server";
import { Resend } from "resend";
import tokens from "@cerneo/tokens/json";
import { validateContactPayload, type ContactPayload } from "../../../src/lib/contact";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const FONT_STACK = "'Plus Jakarta Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

/* Cores do Cerneo DS, do pacote de tokens (e-mail não lê CSS var). */
const P = tokens.primitives;
const L = tokens.resolved.light.cerneo;
const C = {
  ink: P["color.ink"],
  paper: P["color.paper"],
  yellow: P["color.yellow.200"],
  surface: L["surface.default"],
  muted: L["text.muted"],
  subtle: L["text.subtle"],
  border: L["border.subtle"],
  sunken: L["surface.sunken"],
};
const LOGO_URL = "https://assets.cerneo.com.br/brand/email/cerneo-assinatura-cor-fundo-escuro-320px.png";

function renderContactEmail(payload: ContactPayload): string {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const firstName = escapeHtml(payload.name.trim().split(/\s+/)[0]);
  const receivedAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const detailRow = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${C.border};">
        <span style="display:block;font:700 11px ${FONT_STACK};letter-spacing:1px;text-transform:uppercase;color:${C.subtle};padding-bottom:4px;">${label}</span>
        <span style="font:400 16px/1.4 ${FONT_STACK};color:${C.ink};">${value}</span>
      </td>
    </tr>`;

  return `
  <div style="display:none;max-height:0;overflow:hidden;">Nova mensagem de ${name} pelo site da Cerneo</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;border-collapse:collapse;">

          <tr>
            <td style="background:${C.ink};border-radius:24px 24px 0 0;padding:28px 36px;">
              <img src="${LOGO_URL}" width="160" alt="Cerneo" style="display:block;border:0;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${C.yellow};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="background:${C.surface};padding:36px 36px 8px;">
              <span style="display:block;font:700 12px ${FONT_STACK};letter-spacing:1px;text-transform:uppercase;color:${C.muted};padding-bottom:10px;">Novo contato pelo site</span>
              <span style="display:block;font:700 24px/1.3 ${FONT_STACK};color:${C.ink};">${name}</span>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;">
                ${detailRow("E-mail", `<a href="mailto:${email}" style="color:${C.ink};text-decoration:underline;">${email}</a>`)}
                ${payload.subject ? detailRow("Assunto", escapeHtml(payload.subject)) : ""}
                ${payload.company ? detailRow("Empresa", escapeHtml(payload.company)) : ""}
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:${C.surface};padding:24px 36px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="background:${C.sunken};border-left:4px solid ${C.yellow};border-radius:0 12px 12px 0;padding:20px 24px;">
                    <span style="display:block;font:700 11px ${FONT_STACK};letter-spacing:1px;text-transform:uppercase;color:${C.subtle};padding-bottom:8px;">Mensagem</span>
                    <span style="font:400 16px/1.65 ${FONT_STACK};color:${C.ink};white-space:pre-wrap;">${escapeHtml(payload.message)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="background:${C.surface};padding:28px 36px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="background:${C.yellow};border-radius:999px;">
                    <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Contato pelo site da Cerneo`)}"
                       style="display:inline-block;padding:14px 32px;font:600 15px ${FONT_STACK};color:${C.ink};text-decoration:none;">
                      Responder para ${firstName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:${C.surface};border-top:1px solid ${C.border};border-radius:0 0 24px 24px;padding:20px 36px;">
              <span style="font:400 12px/1.6 ${FONT_STACK};color:${C.muted};">
                Recebido pelo formul&aacute;rio de contato de
                <a href="https://www.cerneo.com.br" style="color:${C.ink};text-decoration:underline;">www.cerneo.com.br</a><br />
                ${receivedAt} (hor&aacute;rio de Bras&iacute;lia) &middot; idioma do visitante: ${escapeHtml(payload.locale ?? "-")}
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>`;
}

function renderContactText(payload: ContactPayload): string {
  return [
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    ...(payload.subject ? [`Assunto: ${payload.subject}`] : []),
    ...(payload.company ? [`Empresa: ${payload.company}`] : []),
    "",
    "Mensagem:",
    payload.message,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field — pretend success, send nothing
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContactPayload(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "invalid_payload", fields: Object.keys(result.errors) },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const { payload } = result;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Cerneo Site <no-reply@notifications.cerneo.com.br>",
      to: process.env.CONTACT_TO_EMAIL ?? "contato@cerneo.com.br",
      replyTo: payload.email,
      subject: `[Site] ${payload.subject ? `${payload.subject}: ` : ""}Contato de ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
      html: renderContactEmail(payload),
      text: renderContactText(payload),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "send_failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[contact] Unexpected error sending email:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
