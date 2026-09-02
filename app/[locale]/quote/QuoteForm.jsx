"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import DatePicker from "../globalComponents/DatePicker";

const inputClass =
  "h-14 w-full border bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]";

const fieldLimits = {
  company: 150,
  contactPerson: 120,
  phone: 11,
  email: 254,
  loadingCountry: 100,
  loadingCity: 100,
  unloadingCountry: 100,
  unloadingCity: 100,
  cargoType: 200,
  weight: 50,
  pickupDate: 10,
  additionalInfo: 500,
};

const requiredFields = [
  "company",
  "contactPerson",
  "phone",
  "email",
  "loadingCountry",
  "loadingCity",
  "unloadingCountry",
  "unloadingCity",
  "cargoType",
  "weight",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\p{M}\s]+$/u;
const phonePattern = /^\+?\d{9,10}$/;
const companyPattern = /^[\p{L}\p{M}\p{N}\s&.,'’"()\/-]+$/u;
const locationPattern = /^[\p{L}\p{M}\s'’-]+$/u;
const weightPattern = /^(\d+(?:[.,]\d{1,3})?)\s*(kg|t)?$/i;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidWeight(value) {
  const match = weightPattern.exec(value);
  return Boolean(match && Number(match[1].replace(",", ".")) > 0);
}

function getFieldErrors(fields, validation) {
  const errors = {};

  for (const field of requiredFields) {
    if (!fields[field]) {
      errors[field] = validation.required;
    }
  }

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (fields[field].length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = validation.email;
  }

  if (
    fields.contactPerson &&
    fields.contactPerson.replace(/\s/g, "").length < 3
  ) {
    errors.contactPerson = validation.nameMin;
  } else if (fields.contactPerson && !namePattern.test(fields.contactPerson)) {
    errors.contactPerson = validation.nameFormat;
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = validation.phone;
  }

  if (fields.company && fields.company.replace(/\s/g, "").length < 2) {
    errors.company = validation.companyMin;
  } else if (fields.company && !companyPattern.test(fields.company)) {
    errors.company = validation.companyFormat;
  }

  for (const field of [
    "loadingCountry",
    "loadingCity",
    "unloadingCountry",
    "unloadingCity",
  ]) {
    if (fields[field] && fields[field].replace(/\s/g, "").length < 2) {
      errors[field] = validation.locationMin;
    } else if (fields[field] && !locationPattern.test(fields[field])) {
      errors[field] = validation.locationFormat;
    }
  }

  if (fields.cargoType && fields.cargoType.length < 2) {
    errors.cargoType = validation.cargoMin;
  } else if (
    fields.cargoType &&
    controlCharacterPattern.test(fields.cargoType)
  ) {
    errors.cargoType = validation.invalidText;
  }

  if (fields.weight && !isValidWeight(fields.weight)) {
    errors.weight = validation.weight;
  }

  if (fields.pickupDate && fields.pickupDate < toDateValue(new Date())) {
    errors.pickupDate = validation.pastDate;
  }

  if (
    fields.additionalInfo &&
    controlCharacterPattern.test(fields.additionalInfo)
  ) {
    errors.additionalInfo = validation.invalidText;
  }

  return errors;
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
  autoComplete,
  inputMode,
  pattern,
  autoCapitalize,
  maxLength,
  error,
  onChange,
}) {
  const errorId = `quote-${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-bold text-[#191925]">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
        className={`${inputClass} ${error ? "border-red-600" : "border-[#C9C8D0]"}`}
      />
      {error && (
        <span id={errorId} role="alert" className="font-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

function FormSection({ eyebrow, title, children, className = "" }) {
  return (
    <section className={`grid gap-8 border-t border-[#D9D8DE] py-12 lg:grid-cols-[280px_1fr] lg:gap-16 lg:py-16 ${className}`}>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-sm text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

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
