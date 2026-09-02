"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import ValidationMessage from "@/components/ui/ValidationMessage";
import {
  fieldLimits,
  validateCareerForm as getFieldErrors,
} from "@/lib/validation/careers";
import DetailList from "./DetailList";

export default function CareerApplication({ content }) {
  const jobs = content.positions.items;
  const [selectedRole, setSelectedRole] = useState(jobs[0]?.id ?? "");
  const [activeRole, setActiveRole] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [messageLength, setMessageLength] = useState(0);
  const formSectionRef = useRef(null);

  useEffect(() => {
    const jobElements = document.querySelectorAll("[data-career-job]");
    const jobObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveRole(visibleEntry.target.dataset.careerJob);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: 0 },
    );

    jobElements.forEach((element) => jobObserver.observe(element));

    const formObserver = new IntersectionObserver(
      ([entry]) => {
        const formHasBeenReached =
          entry.isIntersecting || entry.boundingClientRect.top < 0;
        setFormVisible(formHasBeenReached);
      },
      { threshold: 0.12 },
    );
    if (formSectionRef.current) formObserver.observe(formSectionRef.current);

    return () => {
      jobObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  function applyFor(roleId) {
    setSelectedRole(roleId);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      role: undefined,
    }));
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  function handleFileChange(event) {
    const file = event.currentTarget.files?.[0];

    setFileName(file?.name ?? "");
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      cv: undefined,
    }));

    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(
      Object.keys(fieldLimits).map((field) => [
        field,
        field === "message"
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
    const validationErrors = getFieldErrors(
      fields,
      formData.get("cv"),
      new Set(jobs.map((job) => job.id)),
      content.application.validation,
    );

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Career application failed.");
      }

      form.reset();
      setFileName("");
      setMessageLength(0);
      setFieldErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const activeJob = jobs.find((job) => job.id === activeRole);

  return (
    <>
      <section className="px-5 pb-10 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14">
        <div className="mx-auto max-w-[1200px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
              {content.positions.eyebrow}
            </p>
            <div className="mt-3 border-t border-[#D9D8DE]" />
            <h2 className="mt-4 hidden max-w-2xl text-[clamp(24px,2.5vw,34px)] font-extrabold leading-[1.12] tracking-[-0.035em] lg:block">
              {content.positions.title}
            </h2>
          </div>

          {jobs.map((job) => (
            <article
              key={job.id}
              id={job.id}
              data-career-job={job.id}
              className="scroll-mt-24 border-b border-[#D9D8DE] py-14 sm:py-16 lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:py-20"
            >
              <div>
                <h2 className="max-w-sm text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-balance lg:-mt-1">
                  {job.title}
                </h2>
                <button
                  type="button"
                  onClick={() => applyFor(job.id)}
                  className="group mt-8 inline-flex items-center gap-3 py-2 text-base font-bold text-[#191925]"
                >
                  {content.positions.apply}
                  <ArrowRight
                    aria-hidden="true"
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </button>
              </div>

              <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:mt-0 lg:grid-cols-3 lg:gap-0">
                <DetailList
                  label={content.positions.responsibilitiesLabel}
                  items={job.responsibilities}
                  className="lg:pr-9 xl:pr-12"
                />
                <DetailList
                  label={content.positions.requirementsLabel}
                  items={job.requirements}
                  className="lg:border-l lg:border-[#D9D8DE] lg:px-9 xl:px-12"
                />
                <DetailList
                  label={content.positions.offerLabel}
                  items={job.offer}
                  className="lg:border-l lg:border-[#D9D8DE] lg:pl-9 xl:pl-12"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={formSectionRef}
        id="kandidatuoti"
        className="scroll-mt-20 border-t border-[#D9D8DE] bg-[#EDECF0] px-5 py-20 text-[#191925] sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
              {content.application.eyebrow}
            </p>
            <h2 className="mt-5 max-w-md text-[clamp(34px,4.2vw,54px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              {content.application.title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#6F7080]">
              {content.application.description}
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <fieldset>
              <legend className="text-sm font-bold text-[#191925]">
                {content.application.roleLegend}
              </legend>
              <div className="mt-4 grid gap-2">
                {jobs.map((job) => (
                  <label
                    key={job.id}
                    className={`flex cursor-pointer items-start gap-4 border px-4 py-4 transition-colors sm:items-center ${
                      selectedRole === job.id
                        ? "border-[#313152] bg-[#313152] text-white"
                        : "border-[#C9C8D0] bg-transparent text-[#313152] hover:border-[#313152]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={job.id}
                      checked={selectedRole === job.id}
                      onChange={() => {
                        setSelectedRole(job.id);
                        setFieldErrors((currentErrors) => ({
                          ...currentErrors,
                          role: undefined,
                        }));
                      }}
                      className="sr-only"
                    />
                    <span className="font-bold leading-6">{job.title}</span>
                  </label>
                ))}
              </div>
              <ValidationMessage
                id="career-role-error"
                message={fieldErrors.role}
              />
            </fieldset>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                {content.application.name}
                <input
                  required
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  maxLength={fieldLimits.name}
                  placeholder={content.application.namePlaceholder}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "career-name-error" : undefined}
                  onChange={handleFieldChange}
                  className={`h-14 border bg-white/45 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.name ? "border-red-600" : "border-[#C9C8D0]"}`}
                />
                <ValidationMessage
                  id="career-name-error"
                  message={fieldErrors.name}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                {content.application.email}
                <input
                  required
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={fieldLimits.email}
                  placeholder={content.application.emailPlaceholder}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "career-email-error" : undefined}
                  onChange={handleFieldChange}
                  className={`h-14 border bg-white/45 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.email ? "border-red-600" : "border-[#C9C8D0]"}`}
                />
                <ValidationMessage
                  id="career-email-error"
                  message={fieldErrors.email}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                {content.application.phone}
                <input
                  required
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  pattern="\+?[0-9]{9,10}"
                  autoComplete="tel"
                  maxLength={fieldLimits.phone}
                  placeholder={content.application.phonePlaceholder}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "career-phone-error" : undefined}
                  onChange={handleFieldChange}
                  className={`h-14 border bg-white/45 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.phone ? "border-red-600" : "border-[#C9C8D0]"}`}
                />
                <ValidationMessage
                  id="career-phone-error"
                  message={fieldErrors.phone}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                {content.application.message}
                <textarea
                  name="message"
                  rows={4}
                  maxLength={fieldLimits.message}
                  placeholder={content.application.messagePlaceholder}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={`career-message-count${fieldErrors.message ? " career-message-error" : ""}`}
                  onChange={handleFieldChange}
                  className={`resize-y border bg-white/45 px-4 py-4 font-normal leading-7 text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152] ${fieldErrors.message ? "border-red-600" : "border-[#C9C8D0]"}`}
                />
                <span className="flex items-start justify-between gap-4">
                  <ValidationMessage
                    id="career-message-error"
                    message={fieldErrors.message}
                  />
                  <span
                    id="career-message-count"
                    className="ml-auto font-normal text-[#6B6B78]"
                  >
                    {messageLength} / {fieldLimits.message}
                  </span>
                </span>
              </label>
            </div>

            <div
              className={`mt-6 border border-dashed bg-white/25 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 ${fieldErrors.cv ? "border-red-600" : "border-[#B9B8C2]"}`}
            >
              <label className="group flex cursor-pointer items-center gap-3">
                <FileText aria-hidden="true" size={20} />
                <span className="font-bold">
                  {fileName || content.application.cv}
                </span>
                <input
                  required
                  type="file"
                  name="cv"
                  accept="application/pdf,.pdf"
                  aria-invalid={Boolean(fieldErrors.cv)}
                  aria-describedby={`career-cv-hint${fieldErrors.cv ? " career-cv-error" : ""}`}
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <span
                id="career-cv-hint"
                className="mt-2 block text-xs text-[#6F7080] sm:mt-0"
              >
                {content.application.cvHint}
              </span>
            </div>
            <ValidationMessage id="career-cv-error" message={fieldErrors.cv} />
            <p className="mt-3 text-xs leading-5 text-[#6F7080]">
              {content.application.cvAttachNote}
            </p>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-8 flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
            >
              {status === "submitting"
                ? content.application.submitting
                : content.application.submit}
              <ArrowRight
                aria-hidden="true"
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>
            <div aria-live="polite">
              {status === "success" && (
                <p className="mt-4 text-sm font-semibold text-green-700">
                  {content.application.success}
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-sm font-semibold text-red-700">
                  {content.application.error}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {activeJob && !formVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3E2E7] bg-[#F6F5F2]/96 px-5 py-3 shadow-[0_-10px_30px_rgba(25,25,37,0.08)] backdrop-blur sm:px-7 lg:hidden">
          <button
            type="button"
            onClick={() => applyFor(activeJob.id)}
            className="flex w-full items-center justify-between gap-4 py-1 text-left"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#AE2422]">
                {content.application.stickyApply}
              </span>
              <span className="mt-0.5 block truncate text-sm font-bold text-[#191925]">
                {activeJob.title}
              </span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center">
              <ArrowRight aria-hidden="true" size={20} />
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
}
