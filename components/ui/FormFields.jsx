"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const baseLabel = "grid gap-2 text-sm font-bold";
const fieldTail = "text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]";

export function ValidationMessage({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} role="alert" className="font-normal text-red-700">
      {message}
    </span>
  );
}

// `idPrefix` names the form ("contact", "quote", "career") for the error element ids;
// `labelClass` and `surface` carry each form's own label color and field background.
export function TextField({
  label,
  name,
  error,
  idPrefix,
  required = true,
  fullWidth = false,
  labelClass = "text-[#191925]",
  surface = "bg-white/55",
  className = "",
  ...inputProps
}) {
  const errorId = `${idPrefix}-${name}-error`;

  return (
    <label className={[baseLabel, labelClass, className].filter(Boolean).join(" ")}>
      {label}
      <input
        required={required}
        name={name}
        {...inputProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-14 ${fullWidth ? "w-full " : ""}border ${surface} px-4 font-normal ${fieldTail} ${error ? "border-red-600" : "border-[#C9C8D0]"}`}
      />
      <ValidationMessage id={errorId} message={error} />
    </label>
  );
}

// A textarea with a live "n / max" counter; the counter resets with the form.
export function TextAreaField({
  label,
  name,
  error,
  idPrefix,
  required = false,
  maxLength,
  labelClass = "text-[#191925]",
  surface = "bg-white/55",
  className = "",
  onChange,
  ...textareaProps
}) {
  const [length, setLength] = useState(0);
  const textareaRef = useRef(null);
  const errorId = `${idPrefix}-${name}-error`;
  const countId = `${idPrefix}-${name}-count`;

  useEffect(() => {
    const form = textareaRef.current?.form;
    const resetCount = () => setLength(0);

    form?.addEventListener("reset", resetCount);
    return () => form?.removeEventListener("reset", resetCount);
  }, []);

  return (
    <label className={[baseLabel, labelClass, className].filter(Boolean).join(" ")}>
      {label}
      <textarea
        ref={textareaRef}
        required={required}
        name={name}
        {...textareaProps}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={`${countId}${error ? ` ${errorId}` : ""}`}
        onChange={(event) => {
          setLength(event.currentTarget.value.length);
          onChange(event);
        }}
        className={`resize-y border ${surface} px-4 py-4 font-normal leading-7 ${fieldTail} ${error ? "border-red-600" : "border-[#C9C8D0]"}`}
      />
      <span className="flex items-start justify-between gap-4">
        <ValidationMessage id={errorId} message={error} />
        <span id={countId} className="ml-auto font-normal text-[#6B6B78]">
          {length} / {maxLength}
        </span>
      </span>
    </label>
  );
}

export function SubmitButton({ submitting, label, submittingLabel, className = "" }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className={`group ${className ? `${className} ` : ""}flex h-14 w-full items-center justify-center gap-3 bg-[#313152] px-6 font-extrabold text-white transition-colors hover:bg-[#252541] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto`}
    >
      {submitting ? submittingLabel : label}
      <ArrowRight
        aria-hidden="true"
        size={19}
        className="transition-transform duration-300 group-hover:translate-x-1.5"
      />
    </button>
  );
}

export function FormStatus({ status, success, error, className = "" }) {
  const text = (color) => `${className ? `${className} ` : ""}text-sm font-semibold ${color}`;

  return (
    <div aria-live="polite">
      {status === "success" && <p className={text("text-green-700")}>{success}</p>}
      {status === "error" && <p className={text("text-red-700")}>{error}</p>}
    </div>
  );
}
