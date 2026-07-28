import Link from "next/link";
import Image from "next/image";
import { resources } from "@/lib/i18n";
import {
  getAboutPath,
  getCareersPath,
  getContactPath,
  getServicesPath,
} from "@/lib/routes.mjs";

export default function Footer({ locale = "lt" }) {
  const footer = (resources[locale] ?? resources.lt).common.footer;

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
            <a href="mailto:info@transgarant.lt">{footer.emailLabel}: info@transgarant.lt</a>
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

      <div className="mx-auto mt-5 flex max-w-[1200px] justify-center border-t border-white/14 pt-4 text-center text-sm text-white/58">
        <p>© {new Date().getFullYear()} {footer.copyright}</p>
      </div>
    </footer>
  );
}
