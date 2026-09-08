import Link from "next/link";
import Image from "next/image";
import { resources } from "@/lib/i18n/resources";
import {
  getAboutPath,
  getCareersPath,
  getContactPath,
  getServicesPath,
} from "@/lib/routing/paths.mjs";
import { AnalyticsPreferencesButton } from "@/components/analytics/Analytics";
import { normalizeMeasurementId } from "@/lib/analytics/core.mjs";

export default function Footer({ locale = "lt" }) {
  const common = (resources[locale] ?? resources.lt).common;
  const footer = common.footer;
  const analyticsEnabled = Boolean(normalizeMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID));

  return (
    <footer className="bg-[#313152] px-5 py-7 text-white sm:px-8 sm:py-8 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-7 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <Image
            src="/logo_footer.png"
            alt="TRANSGARANT GROUP"
            width={157}
            height={54}
            className="h-auto w-[150px] sm:w-[200px]"
          />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
            {footer.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/58">
            {footer.navigationTitle}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-white/76 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-white [&_a:focus-visible]:text-white">
            <Link href={getServicesPath(locale)}>{footer.links.services}</Link>
            <Link href={`/${locale}#kryptys`}>{footer.links.destinations}</Link>
            <Link href={getAboutPath(locale)}>{footer.links.about}</Link>
            <Link href={getCareersPath(locale)}>{footer.links.careers}</Link>
            <Link href={getContactPath(locale)}>{footer.links.contact}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/58">{footer.contactsTitle}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-white/76 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-white [&_a:focus-visible]:text-white">
            <a
              href="mailto:info@transgarant.lt"
              data-analytics-event="contact_click"
              data-analytics-contact-id="general_email"
              data-analytics-method="email"
              data-analytics-placement="footer"
            >
              {footer.emailLabel}: info@transgarant.lt
            </a>
            <span>{footer.hours}</span>
            <a
              href="https://rekvizitai.vz.lt/imone/uab_transgarant_group/"
              target="_blank"
              rel="noreferrer"
            >
              {footer.companyDetails}
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-[1200px] flex-col items-center gap-3 border-t border-white/14 pt-4 text-center text-sm text-white/58 sm:block">
        <p>© {new Date().getFullYear()} {footer.copyright}</p>
        <AnalyticsPreferencesButton
          enabled={analyticsEnabled}
          label={common.analyticsConsent.settings}
          className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:text-white sm:absolute sm:right-0 sm:top-4"
        />
      </div>
    </footer>
  );
}
