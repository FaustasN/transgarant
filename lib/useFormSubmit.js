"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/core.mjs";
import { normalizeField } from "@/lib/validation/rules";

/**
 * State and submit flow shared by the contact, quote and careers forms.
 *
 * - fieldLimits: its keys are the fields read from the form and sent to the API
 * - validate(fields, formData) returns an object of field errors
 * - json: send the fields as JSON (default) or the raw FormData
 * - onSuccess(fields): form-specific resets after the form itself was reset
 * - trackParams(fields): extra `generate_lead` analytics parameters
 */
export function useFormSubmit({
  endpoint,
  formName,
  locale,
  fieldLimits,
  multiline = [],
  validate,
  json = true,
  focusFirstError = false,
  onSuccess,
  trackParams,
}) {
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});

  function resetStatus() {
    if (status === "success" || status === "error") setStatus("idle");
  }

  function clearError(name) {
    if (fieldErrors[name]) {
      setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    }
  }

  // Call when a field changed: clears its error and any previous result message.
  function touch(name) {
    clearError(name);
    resetStatus();
  }

  function handleChange(event) {
    touch(event.currentTarget.name);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(
      Object.keys(fieldLimits).map((field) => [
        field,
        normalizeField(formData.get(field), { multiline: multiline.includes(field) }),
      ]),
    );
    const validationErrors = validate(fields, formData);

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      if (focusFirstError) form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        ...(json
          ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) }
          : { body: formData }),
      });

      if (!response.ok) {
        throw new Error(`${formName} request failed.`);
      }

      form.reset();
      onSuccess?.(fields);
      setFieldErrors({});
      setStatus("success");
      trackAnalyticsEvent("generate_lead", { form_name: formName, locale, ...trackParams?.(fields) });
    } catch {
      setStatus("error");
    }
  }

  return { status, fieldErrors, clearError, touch, handleChange, handleSubmit };
}
