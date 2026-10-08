"use client";

import { FormStatus, SubmitButton, TextAreaField, TextField } from "@/components/ui/FormFields";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { fieldLimits, validateContactForm } from "@/lib/validation/contact";

export default function ContactForm({ content, locale }) {
  const { status, fieldErrors, handleChange, handleSubmit } = useFormSubmit({
    endpoint: "/api/contact",
    formName: "contact",
    locale,
    fieldLimits,
    multiline: ["message"],
    validate: (fields) => validateContactForm(fields, content.validation),
  });
  const fieldProps = (name) => ({
    idPrefix: "contact",
    name,
    error: fieldErrors[name],
    maxLength: fieldLimits[name],
    onChange: handleChange,
  });

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label={content.name}
          placeholder={content.namePlaceholder}
          autoComplete="name"
          autoCapitalize="words"
          {...fieldProps("name")}
        />
        <TextField
          label={content.email}
          type="email"
          placeholder={content.emailPlaceholder}
          inputMode="email"
          autoComplete="email"
          {...fieldProps("email")}
        />
        <TextAreaField
          label={content.message}
          required
          rows={5}
          className="sm:col-span-2"
          placeholder={content.messagePlaceholder}
          {...fieldProps("message")}
        />
      </div>

      <SubmitButton
        className="mt-8"
        submitting={status === "submitting"}
        label={content.submit}
        submittingLabel={content.submitting}
      />
      <FormStatus status={status} success={content.success} error={content.error} className="mt-4" />
    </form>
  );
}
