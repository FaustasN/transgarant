import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/routes.mjs";

export default function LocaleProvider({ locale, children }) {
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return <div data-locale={locale}>{children}</div>;
}
