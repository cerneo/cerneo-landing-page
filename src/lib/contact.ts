export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  company?: string;
  message: string;
  locale?: string;
}

export type TContactField = "name" | "email" | "subject" | "company" | "message" | "consent";
export type TContactFieldError = "required" | "invalid" | "tooShort" | "tooLong";
export type TContactErrors = Partial<Record<TContactField, TContactFieldError>>;

/** Os mesmos limites do `ContactSection` do DS, mais os tetos do servidor. */
export const CONTACT_LIMITS = {
  name: { max: 100 },
  email: { max: 200 },
  subject: { max: 120 },
  company: { max: 100 },
  message: { min: 10, max: 5000 },
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactValidationResult =
  | { ok: true; payload: ContactPayload }
  | { ok: false; errors: TContactErrors };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * Validação do servidor para `POST /api/contact`. Espelha a do formulário do DS
 * (nome, e-mail, assunto, mensagem de 10+ caracteres e consentimento LGPD).
 */
export function validateContactPayload(data: unknown): ContactValidationResult {
  const errors: TContactErrors = {};
  const raw = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;

  const name = str(raw.name);
  const email = str(raw.email);
  const subject = str(raw.subject);
  const company = str(raw.company);
  const message = str(raw.message);
  const locale = typeof raw.locale === "string" ? raw.locale.slice(0, 10) : undefined;

  if (!name) errors.name = "required";
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = "tooLong";

  if (!email) errors.email = "required";
  else if (!EMAIL_REGEX.test(email) || email.length > CONTACT_LIMITS.email.max) errors.email = "invalid";

  if (!subject) errors.subject = "required";
  else if (subject.length > CONTACT_LIMITS.subject.max) errors.subject = "tooLong";

  if (company.length > CONTACT_LIMITS.company.max) errors.company = "tooLong";

  if (!message) errors.message = "required";
  else if (message.length < CONTACT_LIMITS.message.min) errors.message = "tooShort";
  else if (message.length > CONTACT_LIMITS.message.max) errors.message = "tooLong";

  if (raw.consent !== true) errors.consent = "required";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    payload: { name, email, subject, company: company || undefined, message, locale },
  };
}
