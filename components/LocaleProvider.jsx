import { notFound } from "next/navigation";

const supportedLocales = ["lt", "en", "pl", "ru"];

export default function LocaleProvider({ locale, children }) {
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return <div data-locale={locale}>{children}</div>;
}
