"use client";

import { useRef, useState } from "react";
import DatePicker from "@/components/ui/DatePicker";
import { FormStatus, SubmitButton, TextField } from "@/components/ui/FormFields";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { fieldLimits, validateQuoteForm } from "@/lib/validation/quote";
import FormSection, { RailNode } from "./FormSection";
import QuoteProgress, { useQuoteProgress } from "./QuoteProgress";

export default function QuoteForm({ content, locale }) {
  const [datePickerKey, setDatePickerKey] = useState(0);
  const formRef = useRef(null);
  const progress = useQuoteProgress(formRef);
  const { status, fieldErrors, touch, handleChange, handleSubmit } = useFormSubmit({
    endpoint: "/api/quote",
    formName: "quote",
    locale,
    fieldLimits,
    focusFirstError: true,
    validate: (fields) => validateQuoteForm(fields, content.validation),
    onSuccess: () => {
      setDatePickerKey((currentKey) => currentKey + 1);
      progress.reset();
    },
  });
  const { sectionProgress } = progress;
  const fieldProps = (name) => ({
    idPrefix: "quote",
    fullWidth: true,
    name,
    error: fieldErrors[name],
    maxLength: fieldLimits[name],
    onChange: (event) => {
      progress.update(event.currentTarget.form);
      handleChange(event);
    },
  });

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
            <TextField
              label={content.contactPerson}
              placeholder={content.contactPersonPlaceholder}
              autoComplete="name"
              autoCapitalize="words"
              {...fieldProps("contactPerson")}
            />
            <TextField
              label={content.phone}
              type="tel"
              placeholder={content.phonePlaceholder}
              autoComplete="tel"
              inputMode="tel"
              pattern="\+?[0-9]{9,10}"
              {...fieldProps("phone")}
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
            {[
              ["loading", content.loadingLabel],
              ["unloading", content.unloadingLabel],
            ].map(([direction, legend]) => (
              <fieldset key={direction}>
                <legend className="mb-5 text-lg font-extrabold text-[#313152]">{legend}</legend>
                <div className="grid gap-5">
                  <TextField
                    label={content[`${direction}Address`]}
                    placeholder={content[`${direction}AddressPlaceholder`]}
                    autoComplete="street-address"
                    {...fieldProps(`${direction}Address`)}
                  />
                </div>
              </fieldset>
            ))}
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
            <TextField
              label={content.cargoType}
              placeholder={content.cargoTypePlaceholder}
              {...fieldProps("cargoType")}
            />
            <TextField
              label={content.weight}
              placeholder={content.weightPlaceholder}
              inputMode="decimal"
              pattern="[0-9]+([.,][0-9]{1,3})? *(kg|t)?"
              {...fieldProps("weight")}
            />
            <TextField
              label={`${content.quantity} (${content.optional})`}
              required={false}
              placeholder={content.quantityPlaceholder}
              {...fieldProps("quantity")}
            />
            <DatePicker
              key={datePickerKey}
              label={content.pickupDate}
              name="pickupDate"
              required={false}
              locale={locale}
              error={fieldErrors.pickupDate}
              onChange={() => touch("pickupDate")}
            />
          </div>
        </FormSection>

        <div className="relative pb-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:pb-16">
          <span
            aria-hidden="true"
            className={`absolute left-[312px] top-0 hidden h-7 w-px -translate-x-1/2 transition-colors duration-500 lg:block ${progress.allDone ? "bg-[#AE2422]" : "bg-[#D9D8DE]"}`}
          />
          <RailNode done={progress.allDone} position="top-7 -translate-y-1/2" />
          <div className="flex flex-col gap-3 sm:items-start lg:col-start-2">
            <SubmitButton
              submitting={status === "submitting"}
              label={content.submit}
              submittingLabel={content.submitting}
            />
            <p className="text-xs leading-5 text-[#6F7080]">{content.submitNote}</p>
            <FormStatus status={status} success={content.success} error={content.error} />
          </div>
        </div>
      </form>
      <QuoteProgress progress={progress} content={content} />
    </>
  );
}
