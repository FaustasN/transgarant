"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

const fieldLimits = {
  name: 120,
  email: 254,
  phone: 11,
  message: 500,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\p{M}\s]+$/u;
const phonePattern = /^\+?\d{9,10}$/;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function getFieldErrors(fields, validation) {
  const errors = {};

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (!fields[field]) {
      errors[field] = validation.required;
    } else if (fields[field].length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = validation.email;
  }

  if (fields.name && fields.name.replace(/\s/g, "").length < 3) {
    errors.name = validation.nameMin;
  } else if (fields.name && !namePattern.test(fields.name)) {
    errors.name = validation.nameFormat;
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = validation.phone;
  }

  if (fields.message && fields.message.length < 10) {
    errors.message = validation.messageMin;
  } else if (fields.message && controlCharacterPattern.test(fields.message)) {
    errors.message = validation.invalidText;
  }

  return errors;
}

function ValidationMessage({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} role="alert" className="font-normal text-red-700">
      {message}
    </span>
  );
}

export default function ContactForm({ content }) {
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [messageLength, setMessageLength] = useState(0);

  function handleFieldChange(event) {
    const { name, value } = event.currentTarget;

    if (name === "message") {
      setMessageLength(value.length);
    }

    if (fieldErrors[name]) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [name]: undefined,
      }));
    }

    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = {
      name: String(formData.get("name") ?? "")
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " "),
      email: String(formData.get("email") ?? "").normalize("NFKC").trim(),
      phone: String(formData.get("phone") ?? "").normalize("NFKC").trim(),
      message: String(formData.get("message") ?? "")
        .normalize("NFKC")
        .replace(/\r\n?/g, "\n")
        .trim(),
    };
    const validationErrors = getFieldErrors(fields, content.validation);

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        throw new Error("Contact request failed.");
      }

      form.reset();
      setMessageLength(0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#191925]">
          {content.name}
          <input
            required
            name="name"
            autoComplete="name"
            autoCapitalize="words"
            maxLength={fieldLimits.name}
            placeholder={content.namePlaceholder}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            onChange={handleFieldChange}
            className={`h-14 border bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.name ? "border-red-600" : "border-[#C9C8D0]"}`}
          />
          <ValidationMessage id="contact-name-error" message={fieldErrors.name} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925]">
          {content.email}
          <input
            required
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            maxLength={fieldLimits.email}
            placeholder={content.emailPlaceholder}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            onChange={handleFieldChange}
            className={`h-14 border bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.email ? "border-red-600" : "border-[#C9C8D0]"}`}
          />
          <ValidationMessage id="contact-email-error" message={fieldErrors.email} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
          {content.phone}
          <input
            required
            type="tel"
            name="phone"
            inputMode="tel"
            pattern="\+?[0-9]{9,10}"
            autoComplete="tel"
            maxLength={fieldLimits.phone}
            placeholder={content.phonePlaceholder}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
            onChange={handleFieldChange}
            className={`h-14 border bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.phone ? "border-red-600" : "border-[#C9C8D0]"}`}
          />
          <ValidationMessage id="contact-phone-error" message={fieldErrors.phone} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
          {content.message}
          <textarea
            required
            name="message"
            rows={5}
            maxLength={fieldLimits.message}
            placeholder={content.messagePlaceholder}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={`contact-message-count${fieldErrors.message ? " contact-message-error" : ""}`}
            onChange={handleFieldChange}
            className={`resize-y border bg-white/55 px-4 py-4 font-normal leading-7 text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.message ? "border-red-600" : "border-[#C9C8D0]"}`}
          />
          <span className="flex items-start justify-between gap-4">
            <ValidationMessage
              id="contact-message-error"
              message={fieldErrors.message}
            />
            <span
              id="contact-message-count"
              className="ml-auto font-normal text-[#6B6B78]"
            >
              {messageLength} / {fieldLimits.message}
            </span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-8 flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {status === "submitting" ? content.submitting : content.submit}
        <ArrowRight
          aria-hidden="true"
          size={19}
          className="transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p className="mt-4 text-sm font-semibold text-green-700">
            {content.success}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm font-semibold text-red-700">
            {content.error}
          </p>
        )}
      </div>
    </form>
  );
}
