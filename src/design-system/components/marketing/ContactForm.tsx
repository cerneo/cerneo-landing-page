"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Label } from "../form/Label";
import { Input } from "../form/Input";
import { Textarea } from "../form/Textarea";
import {
  validateContactPayload,
  type TContactErrors,
  type TContactField,
} from "../../../lib/contact";

interface ContactFormProps {
  onSuccess?: () => void;
}

type TFormStatus = "idle" | "loading" | "success" | "error";

const initialValues = { name: "", email: "", company: "", message: "", website: "" };

export function ContactForm({ onSuccess }: ContactFormProps) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<TContactErrors>({});
  const [status, setStatus] = useState<TFormStatus>("idle");

  const errorMessage = (field: TContactField): string | undefined => {
    const reason = errors[field];
    if (!reason) return undefined;
    if (field === "name") return t("validation.nameRequired");
    if (field === "email")
      return reason === "required" ? t("validation.emailRequired") : t("validation.emailInvalid");
    return t("validation.messageRequired");
  };

  const setValue = (field: keyof typeof initialValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field !== "website" && errors[field as TContactField]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (field: TContactField) => {
    const result = validateContactPayload(values);
    setErrors((prev) => ({ ...prev, [field]: result.ok ? undefined : result.errors[field] }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validateContactPayload(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.payload, locale, website: values.website }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div data-component-name="ContactForm" className="py-6 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-success" />
        <h3 className="mt-4 text-lg font-semibold text-charcoal dark:text-gray-100">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-steel dark:text-gray-400">{t("successMessage")}</p>
        <Button type="button" color="neo" className="mt-6" onClick={onSuccess}>
          {t("close")}
        </Button>
      </div>
    );
  }

  return (
    <form data-component-name="ContactForm" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Honeypot — invisible to humans, bots fill it in */}
        <input
          type="text"
          name="website"
          value={values.website}
          onChange={(e) => setValue("website", e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div>
          <Label htmlFor="name" required>
            {t("name")}
          </Label>
          <Input
            name="name"
            value={values.name}
            onChange={(e) => setValue("name", e.target.value)}
            onBlur={() => validateField("name")}
            placeholder={t("namePlaceholder")}
            error={errorMessage("name")}
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="email" required>
            {t("email")}
          </Label>
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            onBlur={() => validateField("email")}
            placeholder={t("emailPlaceholder")}
            error={errorMessage("email")}
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="company">
            {t("company")}{" "}
            <span className="font-normal text-steel dark:text-gray-400">
              ({t("companyOptional")})
            </span>
          </Label>
          <Input
            name="company"
            value={values.company}
            onChange={(e) => setValue("company", e.target.value)}
            placeholder={t("companyPlaceholder")}
            autoComplete="organization"
          />
        </div>

        <div>
          <Label htmlFor="message" required>
            {t("message")}
          </Label>
          <Textarea
            name="message"
            value={values.message}
            onChange={(e) => setValue("message", e.target.value)}
            onBlur={() => validateField("message")}
            placeholder={t("messagePlaceholder")}
            error={errorMessage("message")}
            rows={5}
          />
        </div>

        {status === "error" && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error dark:bg-red-950"
          >
            {t("errorMessage")}
          </p>
        )}

        <Button type="submit" color="neo" fullWidth isLoading={status === "loading"}>
          {status === "loading" ? t("sending") : t("submit")}
        </Button>

        <p className="text-center text-xs text-steel dark:text-gray-400">
          {t("directPrefix")}{" "}
          <a
            href="mailto:contato@cerneo.com.br"
            className="font-medium text-neo-600 hover:underline dark:text-neo-400"
          >
            contato@cerneo.com.br
          </a>
        </p>
      </div>
    </form>
  );
}
