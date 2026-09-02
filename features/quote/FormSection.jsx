export default function FormSection({ eyebrow, title, children, className = "" }) {
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
