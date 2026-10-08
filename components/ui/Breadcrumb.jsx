import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Extra props (such as the page's reveal data attribute) go on the <nav>.
export default function Breadcrumb({ locale, hero, ...props }) {
  return (
    <nav
      {...props}
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-[#6F7080]"
    >
      <Link href={`/${locale}`} className="transition-colors hover:text-[#AE2422]">
        {hero.breadcrumbHome}
      </Link>
      <ChevronRight aria-hidden="true" size={14} />
      <span aria-current="page" className="font-semibold text-[#313152]">
        {hero.breadcrumbCurrent}
      </span>
    </nav>
  );
}
