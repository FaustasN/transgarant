import { Check } from "lucide-react";

export default function DetailList({ label, items, className = "" }) {
  return (
    <div className={className}>
      <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#AE2422]">
        {label}
      </h3>
      <ul className="mt-5 grid gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-7 text-[#6F7080]">
            <Check aria-hidden="true" className="mt-1.5 shrink-0 text-[#313152]" size={15} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
