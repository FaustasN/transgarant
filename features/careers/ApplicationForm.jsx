"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import {
  FormStatus,
  SubmitButton,
  TextAreaField,
  TextField,
  ValidationMessage,
} from "@/components/ui/FormFields";
import { fieldLimits } from "@/lib/validation/careers";

// `form` is the useFormSubmit result owned by CareerApplication, so the job
// list and the sticky apply bar can select a position and clear its error.
export default function ApplicationForm({ content, jobs, selectedRole, onSelectRole, form, sectionRef }) {
  const [fileName, setFileName] = useState("");
  const { status, fieldErrors } = form;
  const fieldProps = (name) => ({
    idPrefix: "career",
    name,
    error: fieldErrors[name],
    maxLength: fieldLimits[name],
    labelClass: "",
    surface: "bg-white/45",
    onChange: form.handleChange,
  });

  return (
    <section
      ref={sectionRef}
      id="kandidatuoti"
      className="scroll-mt-20 border-t border-[#D9D8DE] bg-[#EDECF0] px-5 py-20 text-[#191925] sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 max-w-md text-[clamp(34px,4.2vw,54px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            {content.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-[#6F7080]">
            {content.description}
          </p>
        </div>

        <form noValidate onSubmit={form.handleSubmit} onReset={() => setFileName("")}>
          <fieldset>
            <legend className="text-sm font-bold text-[#191925]">{content.roleLegend}</legend>
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
                    onChange={() => onSelectRole(job.id)}
                    className="sr-only"
                  />
                  <span className="font-bold leading-6">{job.title}</span>
                </label>
              ))}
            </div>
            <ValidationMessage id="career-role-error" message={fieldErrors.role} />
          </fieldset>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
              rows={4}
              className="sm:col-span-2"
              placeholder={content.messagePlaceholder}
              {...fieldProps("message")}
            />
          </div>

          <div
            className={`mt-6 border border-dashed bg-white/25 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 ${fieldErrors.cv ? "border-red-600" : "border-[#B9B8C2]"}`}
          >
            <label className="group flex cursor-pointer items-center gap-3">
              <FileText aria-hidden="true" size={20} />
              <span className="font-bold">{fileName || content.cv}</span>
              <input
                required
                type="file"
                name="cv"
                accept="application/pdf,.pdf"
                aria-invalid={Boolean(fieldErrors.cv)}
                aria-describedby={`career-cv-hint${fieldErrors.cv ? " career-cv-error" : ""}`}
                className="sr-only"
                onChange={(event) => {
                  setFileName(event.currentTarget.files?.[0]?.name ?? "");
                  form.touch("cv");
                }}
              />
            </label>
            <span id="career-cv-hint" className="mt-2 block text-xs text-[#6F7080] sm:mt-0">
              {content.cvHint}
            </span>
          </div>
          <ValidationMessage id="career-cv-error" message={fieldErrors.cv} />
          <p className="mt-3 text-xs leading-5 text-[#6F7080]">{content.cvAttachNote}</p>

          <SubmitButton
            className="mt-8"
            submitting={status === "submitting"}
            label={content.submit}
            submittingLabel={content.submitting}
          />
          <FormStatus status={status} success={content.success} error={content.error} className="mt-4" />
        </form>
      </div>
    </section>
  );
}
