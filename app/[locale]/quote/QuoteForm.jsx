"use client";

import { ArrowDown, ArrowRight } from "lucide-react";

const inputClass =
  "h-14 w-full border border-[#C9C8D0] bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]";

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
  autoComplete,
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#191925]">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={inputClass}
      />
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

export default function QuoteForm({ content }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const field = (name) => formData.get(name) ?? "";
    const body = [
      `${content.company}: ${field("company")}`,
      `${content.contactPerson}: ${field("contactPerson")}`,
      `${content.phone}: ${field("phone")}`,
      `${content.email}: ${field("email")}`,
      "",
      `${content.loadingLabel}: ${field("loadingCity")}, ${field("loadingCountry")}`,
      `${content.unloadingLabel}: ${field("unloadingCity")}, ${field("unloadingCountry")}`,
      "",
      `${content.cargoType}: ${field("cargoType")}`,
      `${content.weight}: ${field("weight")}`,
      `${content.pickupDate}: ${field("pickupDate")}`,
      "",
      `${content.additionalInfo}:`,
      `${field("additionalInfo")}`,
    ].join("\n");

    window.location.href = `mailto:info@transgarant.lt?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection eyebrow={content.contactEyebrow} title={content.contactTitle}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={content.company}
            name="company"
            placeholder={content.companyPlaceholder}
            autoComplete="organization"
          />
          <Field
            label={content.contactPerson}
            name="contactPerson"
            placeholder={content.contactPersonPlaceholder}
            autoComplete="name"
          />
          <Field
            label={content.phone}
            name="phone"
            type="tel"
            placeholder={content.phonePlaceholder}
            autoComplete="tel"
          />
          <Field
            label={content.email}
            name="email"
            type="email"
            placeholder={content.emailPlaceholder}
            autoComplete="email"
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
              />
              <Field
                label={content.loadingCity}
                name="loadingCity"
                placeholder={content.loadingCityPlaceholder}
                autoComplete="address-level2"
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
              />
              <Field
                label={content.unloadingCity}
                name="unloadingCity"
                placeholder={content.unloadingCityPlaceholder}
                autoComplete="address-level2"
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
          />
          <Field
            label={content.weight}
            name="weight"
            placeholder={content.weightPlaceholder}
          />
          <Field
            label={content.pickupDate}
            name="pickupDate"
            type="date"
            required={false}
          />
          <label className="grid gap-2 text-sm font-bold text-[#191925] sm:col-span-2">
            {content.additionalInfo}
            <textarea
              name="additionalInfo"
              rows={5}
              placeholder={content.additionalInfoPlaceholder}
              className="resize-y border border-[#C9C8D0] bg-white/55 px-4 py-4 font-normal leading-7 text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:items-start">
          <button
            type="submit"
            className="group flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] sm:w-auto"
          >
            {content.submit}
            <ArrowRight
              aria-hidden="true"
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </button>
          <p className="text-xs leading-5 text-[#6F7080]">{content.submitNote}</p>
        </div>
      </FormSection>
    </form>
  );
}
