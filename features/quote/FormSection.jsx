import { Check } from "lucide-react";

const railLeft = "lg:left-[312px]";

export function RailNode({ done, position }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-colors duration-300 lg:flex ${railLeft} ${position} ${
        done
          ? "border-[#AE2422] bg-[#AE2422] text-white"
          : "border-[#C9C8D0] bg-[#F6F5F2] text-transparent"
      }`}
    >
      <Check size={9} strokeWidth={4} />
    </span>
  );
}

export default function FormSection({
  eyebrow,
  title,
  children,
  className = "",
  progress,
  startDone = false,
  first = false,
}) {
  const hasRail = typeof progress === "number";

  return (
    <section
      className={`relative grid gap-8 ${first ? "" : "border-t border-[#D9D8DE]"} py-12 lg:grid-cols-[280px_1fr] lg:gap-16 lg:border-t-0 lg:py-16 ${className}`}
    >
      {!first && (
        <span
          aria-hidden="true"
          className="absolute left-[312px] right-0 top-0 hidden h-px bg-[#D9D8DE] lg:block"
        />
      )}
      {hasRail && (
        <>
          <span
            aria-hidden="true"
            className={`absolute bottom-0 ${first ? "lg:top-[72px]" : "top-0"} hidden w-px -translate-x-1/2 bg-[#D9D8DE] lg:block ${railLeft}`}
          >
            <span
              className="absolute left-0 top-0 block w-full bg-[#AE2422] transition-[height] duration-500 ease-out"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          </span>
          <RailNode
            done={startDone}
            position={`${first ? "top-[72px]" : "top-0"} -translate-y-1/2`}
          />
        </>
      )}
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
