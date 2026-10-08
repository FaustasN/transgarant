const inputClass =
  "h-14 w-full border bg-white/55 px-4 font-normal text-[#191925] outline-none placeholder:text-[#8B8B98] focus:border-[#313152]";

export default function Field({
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
