"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import DatePicker from "@/components/ui/DatePicker";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import {
  fieldLimits,
  validateQuoteForm as getFieldErrors,
} from "@/lib/validation/quote";
import Field from "./Field";
import FormSection from "./FormSection";

export default function QuoteForm({ content, locale }) {
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [additionalInfoLength, setAdditionalInfoLength] = useState(0);
  const [datePickerKey, setDatePickerKey] = useState(0);

  function handleFieldChange(event) {
    const { name, value } = event.currentTarget;

    if (name === "additionalInfo") {
      setAdditionalInfoLength(value.length);
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

  function handleDateChange() {
    if (fieldErrors.pickupDate) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        pickupDate: undefined,
      }));
    }

    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  }

  function getValidationProps(name) {
    return {
      error: fieldErrors[name],
      maxLength: fieldLimits[name],
      onChange: handleFieldChange,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(
      Object.keys(fieldLimits).map((field) => [
        field,
        field === "additionalInfo"
          ? String(formData.get(field) ?? "")
              .normalize("NFKC")
              .replace(/\r\n?/g, "\n")
              .trim()
          : String(formData.get(field) ?? "")
              .normalize("NFKC")
              .trim()
              .replace(/\s+/g, " "),
      ]),
    );
    const validationErrors = getFieldErrors(fields, content.validation);

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        throw new Error("Quote request failed.");
      }

      form.reset();
      setDatePickerKey((currentKey) => currentKey + 1);
      setAdditionalInfoLength(0);
      setFieldErrors({});
      setStatus("success");
      trackAnalyticsEvent("generate_lead", { form_name: "quote", locale });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FormSection eyebrow={content.contactEyebrow} title={content.contactTitle}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={content.company}
            name="company"
            placeholder={content.companyPlaceholder}
            autoComplete="organization"
            autoCapitalize="words"
            {...getValidationProps("company")}
          />
          <Field
            label={content.contactPerson}
            name="contactPerson"
            placeholder={content.contactPersonPlaceholder}
            autoComplete="name"
            autoCapitalize="words"
            {...getValidationProps("contactPerson")}
          />
          <Field
            label={content.phone}
            name="phone"
            type="tel"
            placeholder={content.phonePlaceholder}
            autoComplete="tel"
            inputMode="tel"
            pattern="\+?[0-9]{9,10}"
            {...getValidationProps("phone")}
          />
          <Field
            label={content.email}
            name="email"
            type="email"
            placeholder={content.emailPlaceholder}
            autoComplete="email"
            inputMode="email"
            {...getValidationProps("email")}
          />
        </div>
      </FormSection>

      <FormSection eyebrow={content.routeEyebrow} title={content.routeTitle}>
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <fieldset>
            <legend className="mb-5 text-lg font-extrabold text-[#313152]">
              {content.loadingLabel}
            </legend>
            <div className="grid gap-5">
              <Field
                label={content.loadingCountry}
                name="loadingCountry"
                placeholder={content.loadingCountryPlaceholder}
                autoComplete="country-name"
                autoCapitalize="words"
                {...getValidationProps("loadingCountry")}
              />
              <Field
                label={content.loadingCity}
                name="loadingCity"
                placeholder={content.loadingCityPlaceholder}
                autoComplete="address-level2"
                autoCapitalize="words"
                {...getValidationProps("loadingCity")}
              />
            </div>
          </fieldset>

          <div className="flex h-10 w-10 items-center justify-center text-[#AE2422]">
            <ArrowDown aria-hidden="true" size={22} className="md:hidden" />
            <ArrowRight aria-hidden="true" size={22} className="hidden md:block" />
          </div>

          <fieldset>
            <legend className="mb-5 text-lg font-extrabold text-[#313152]">
              {content.unloadingLabel}
            </legend>
            <div className="grid gap-5">
              <Field
                label={content.unloadingCountry}
                name="unloadingCountry"
                placeholder={content.unloadingCountryPlaceholder}
                autoComplete="country-name"
                autoCapitalize="words"
                {...getValidationProps("unloadingCountry")}
              />
              <Field
                label={content.unloadingCity}
                name="unloadingCity"
                placeholder={content.unloadingCityPlaceholder}
                autoComplete="address-level2"
                autoCapitalize="words"
                {...getValidationProps("unloadingCity")}
              />
            </div>
          </fieldset>
        </div>
      </FormSection>

      <FormSection eyebrow={content.cargoEyebrow} title={content.cargoTitle}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={content.cargoType}
            name="cargoType"
            placeholder={content.cargoTypePlaceholder}
            {...getValidationProps("cargoType")}
          />
          <Field
            label={content.weight}
            name="weight"
            placeholder={content.weightPlaceholder}
            inputMode="decimal"
            pattern="[0-9]+([.,][0-9]{1,3})? *(kg|t)?"
            {...getValidationProps("weight")}
          />
          <DatePicker
            key={datePickerKey}
            label={content.pickupDate}
            name="pickupDate"
            required={false}
            locale={locale}
            error={fieldErrors.pickupDate}
            onChange={handleDateChange}
          />
          <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
            {content.additionalInfo}
            <textarea
              name="additionalInfo"
              rows={5}
              maxLength={fieldLimits.additionalInfo}
              placeholder={content.additionalInfoPlaceholder}
              aria-invalid={Boolean(fieldErrors.additionalInfo)}
              aria-describedby={`quote-additionalInfo-count${fieldErrors.additionalInfo ? " quote-additionalInfo-error" : ""}`}
              onChange={handleFieldChange}
              className={`resize-y border bg-white/55 px-4 py-4 font-normal leading-7 text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.additionalInfo ? "border-red-600" : "border-[#C9C8D0]"}`}
            />
            <span className="flex items-start justify-between gap-4">
              {fieldErrors.additionalInfo && (
                <span
                  id="quote-additionalInfo-error"
                  role="alert"
                  className="font-normal text-red-700"
                >
                  {fieldErrors.additionalInfo}
                </span>
              )}
              <span
                id="quote-additionalInfo-count"
                className="ml-auto font-normal text-[#6B6B78]"
              >
                {additionalInfoLength} / {fieldLimits.additionalInfo}
              </span>
            </span>
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:items-start">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
          >
            {status === "submitting" ? content.submitting : content.submit}
            <ArrowRight
              aria-hidden="true"
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </button>
          <p className="text-xs leading-5 text-[#6F7080]">{content.submitNote}</p>
          <div aria-live="polite">
            {status === "success" && (
              <p className="text-sm font-semibold text-green-700">
                {content.success}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-semibold text-red-700">
                {content.error}
              </p>
            )}
          </div>
        </div>
      </FormSection>
    </form>
  );
}
