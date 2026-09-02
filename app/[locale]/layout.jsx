import LocaleProvider from "@/components/layout/LocaleProvider";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
