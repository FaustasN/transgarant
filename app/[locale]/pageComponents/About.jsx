import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resources } from "@/lib/i18n";

const aboutImage =
  "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1400&q=85";

export default function About({ locale = "lt" }) {
  const about = (resources[locale] ?? resources.lt).common.about;

  return (
    <section className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">{about.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {about.title}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1100px] gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          <div className="relative min-h-[300px] overflow-hidden rounded-xl sm:min-h-[340px] lg:min-h-0">
            <Image
              src={aboutImage}
              alt={about.imageAlt}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center py-1">
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`${index === 0 ? "" : "mt-5"} text-base leading-8 text-[#6F7080] sm:text-lg`}
              >
                {paragraph}
              </p>
            ))}
            <Link
              href={`/${locale}/apie-mus`}
              className="mt-8 inline-flex min-h-12 w-fit self-center items-center gap-3 rounded-lg border border-[#313152] px-6 py-3 font-bold text-[#313152] transition-colors hover:bg-[#E9E9F0] lg:self-start"
            >
              {about.cta}
              <ArrowRight aria-hidden="true" size={18} className="text-[#AE2422]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
