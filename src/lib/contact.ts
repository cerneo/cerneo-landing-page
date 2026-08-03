export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
  locale?: string;
}

export type TContactField = "name" | "email" | "company" | "message";
export type TContactFieldError = "required" | "invalid" | "tooShort" | "tooLong";
export type TContactErrors = Partial<Record<TContactField, TContactFieldError>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  company: { max: 100 },
  message: { min: 10, max: 5000 },
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactValidationResult =
  | { ok: true; payload: ContactPayload }
  | { ok: false; errors: TContactErrors };

export function validateContactPayload(data: unknown): ContactValidationResult {
  const errors: TContactErrors = {};
  const raw = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const company = typeof raw.company === "string" ? raw.company.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const locale = typeof raw.locale === "string" ? raw.locale : undefined;

  if (!name) errors.name = "required";
  else if (name.length < CONTACT_LIMITS.name.min) errors.name = "tooShort";
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = "tooLong";

  if (!email) errors.email = "required";
  else if (!EMAIL_REGEX.test(email) || email.length > CONTACT_LIMITS.email.max)
    errors.email = "invalid";

  if (company.length > CONTACT_LIMITS.company.max) errors.company = "tooLong";

  if (!message) errors.message = "required";
  else if (message.length < CONTACT_LIMITS.message.min) errors.message = "tooShort";
  else if (message.length > CONTACT_LIMITS.message.max) errors.message = "tooLong";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: { name, email, company: company || undefined, message, locale },
  };
}
