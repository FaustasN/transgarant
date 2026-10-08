import LocaleProvider from "@/components/layout/LocaleProvider";
import Analytics from "@/components/analytics/Analytics";
import { normalizeMeasurementId } from "@/lib/analytics/core.mjs";
import { resources } from "@/lib/i18n/resources";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const measurementId = normalizeMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const consentContent = (resources[locale] ?? resources.lt).common.analyticsConsent;

  return (
    <LocaleProvider locale={locale}>
      {children}
      <Analytics
        measurementId={measurementId}
        locale={locale}
        content={consentContent}
      />
    </LocaleProvider>
  );
}
