import Link from "next/link";
import { resources } from "@/lib/i18n";

export default function Footer({ locale = "lt" }) {
  const footer = (resources[locale] ?? resources.lt).common.footer;

  return (
    <footer className="bg-[#313152] px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <p className="text-xl font-extrabold tracking-[0.04em]">TRANSGARANT GROUP</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
            {footer.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/58">
            {footer.navigationTitle}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-white/76">
            <Link href={`/${locale}#paslaugos`}>{footer.links.services}</Link>
            <Link href={`/${locale}#kryptys`}>{footer.links.destinations}</Link>
            <Link href={`/${locale}/apie-mus`}>{footer.links.about}</Link>
            <Link href={`/${locale}/karjera`}>{footer.links.careers}</Link>
            <Link href={`/${locale}/kontaktai`}>{footer.links.contact}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/58">{footer.contactsTitle}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-white/76">
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

      <div className="mx-auto mt-10 flex max-w-[1280px] justify-center border-t border-white/14 pt-6 text-center text-sm text-white/58">
        <p>© {new Date().getFullYear()} {footer.copyright}</p>
      </div>
    </footer>
  );
}
