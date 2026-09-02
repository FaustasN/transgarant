import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/routing/paths.mjs";

export default function LocaleProvider({ locale, children }) {
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return <div data-locale={locale}>{children}</div>;
}
