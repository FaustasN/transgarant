import Analytics from "@/components/analytics/Analytics";
import { normalizeMeasurementId } from "@/lib/analytics/core.mjs";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const measurementId = normalizeMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <div data-locale={locale}>
      {children}
      <Analytics
        measurementId={measurementId}
        locale={locale}
        content={resources[locale].common.analyticsConsent}
      />
    </div>
  );
}
