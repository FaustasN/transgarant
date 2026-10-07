"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import DatePicker from "@/components/ui/DatePicker";
import { trackAnalyticsEvent } from "@/lib/analytics/client";
import {
  fieldLimits,
  requiredFields,
  validateQuoteForm as getFieldErrors,
} from "@/lib/validation/quote";
import Field from "./Field";
import FormSection, { RailNode } from "./FormSection";

const sectionFields = [
  ["contactPerson", "phone"],
  ["loadingAddress", "unloadingAddress"],
  ["cargoType", "weight"],
];

export default function QuoteForm({ content, locale }) {
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [datePickerKey, setDatePickerKey] = useState(0);
  const [filled, setFilled] = useState([]);
  const [started, setStarted] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const formRef = useRef(null);
  const total = requiredFields.length;
  const completed = filled.length;
  const progressVisible = started && formInView;
  const sectionProgress = sectionFields.map(
    (names) => names.filter((name) => filled.includes(name)).length / names.length,
  );
  const sectionsDone = sectionProgress.filter((value) => value === 1).length;
  const currentSection = Math.min(sectionsDone, sectionFields.length - 1);
  const sectionLabels = [
    content.contactEyebrow,
    content.routeEyebrow,
    content.cargoEyebrow,
  ];

  useEffect(() => {
    const form = formRef.current;
    if (!form) return undefined;

    const observer = new IntersectionObserver(([entry]) =>
      setFormInView(entry.isIntersecting),
    );
    observer.observe(form);

    return () => observer.disconnect();
  }, []);

  function getFilledFields(form) {
    return requiredFields.filter((name) =>
      String(form.elements.namedItem(name)?.value ?? "").trim(),
    );
  }

  function handleFieldChange(event) {
    const { name, form } = event.currentTarget;

    if (form) {
      setFilled(getFilledFields(form));
      setStarted(true);
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
        String(formData.get(field) ?? "")
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
      setFilled([]);
      setStarted(false);
      setFieldErrors({});
      setStatus("success");
      trackAnalyticsEvent("generate_lead", { form_name: "quote", locale });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <FormSection
        eyebrow={content.contactEyebrow}
        title={content.contactTitle}
        progress={sectionProgress[0]}
        startDone
        first
      >
        <div className="grid gap-6 sm:grid-cols-2">
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
        </div>
      </FormSection>

      <FormSection
        eyebrow={content.routeEyebrow}
        title={content.routeTitle}
        progress={sectionProgress[1]}
        startDone={sectionProgress[0] === 1}
      >
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
          <fieldset>
            <legend className="mb-5 text-lg font-extrabold text-[#313152]">
              {content.loadingLabel}
            </legend>
            <div className="grid gap-5">
              <Field
                label={content.loadingAddress}
                name="loadingAddress"
                placeholder={content.loadingAddressPlaceholder}
                autoComplete="street-address"
                {...getValidationProps("loadingAddress")}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-5 text-lg font-extrabold text-[#313152]">
              {content.unloadingLabel}
            </legend>
            <div className="grid gap-5">
              <Field
                label={content.unloadingAddress}
                name="unloadingAddress"
                placeholder={content.unloadingAddressPlaceholder}
                autoComplete="street-address"
                {...getValidationProps("unloadingAddress")}
              />
            </div>
          </fieldset>
        </div>
      </FormSection>

      <FormSection
        eyebrow={content.cargoEyebrow}
        title={content.cargoTitle}
        progress={sectionProgress[2]}
        startDone={sectionProgress[1] === 1}
        className="pb-6 lg:pb-8"
      >
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
          <Field
            label={`${content.quantity} (${content.optional})`}
            name="quantity"
            required={false}
            placeholder={content.quantityPlaceholder}
            {...getValidationProps("quantity")}
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
        </div>
      </FormSection>

      <div className="relative pb-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:pb-16">
        <span
          aria-hidden="true"
          className={`absolute left-[312px] top-0 hidden h-7 w-px -translate-x-1/2 transition-colors duration-500 lg:block ${sectionsDone === sectionFields.length ? "bg-[#AE2422]" : "bg-[#D9D8DE]"}`}
        />
        <RailNode
          done={sectionsDone === sectionFields.length}
          position="top-7 -translate-y-1/2"
        />
    <div className="flex flex-col gap-3 sm:items-start lg:col-start-2">
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
      </div>
    </form>
    {mounted &&
      createPortal(
        <div
          aria-hidden={!progressVisible}
          inert={!progressVisible}
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out lg:hidden ${progressVisible ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="pointer-events-auto border-t border-[#E3E2E7] bg-white/92 px-5 pb-3 pt-2.5 backdrop-blur sm:px-7">
            <div
              role="progressbar"
              aria-label={content.progress}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={completed}
              className="flex gap-1.5"
            >
              {sectionProgress.map((value, index) => (
                <span key={index} className="h-1 flex-1 overflow-hidden bg-[#E3E2E7]">
                  <span
                    className={`block h-full transition-[width] duration-300 ease-out ${sectionsDone === sectionFields.length ? "bg-green-600" : "bg-[#AE2422]"}`}
                    style={{ width: `${value * 100}%` }}
                  />
                </span>
              ))}
            </div>
            <p
              role="status"
              className="mt-2 flex items-baseline justify-between gap-3 text-[11px] font-semibold tabular-nums text-[#6F7080]"
            >
              <span className="truncate uppercase tracking-[0.12em]">
                {sectionsDone === sectionFields.length
                  ? content.progressDone
                  : sectionLabels[currentSection]}
              </span>
              <span>
                {completed} / {total}
              </span>
            </p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
