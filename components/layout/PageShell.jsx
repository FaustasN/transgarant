import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";
import { resources } from "@/lib/i18n/resources";
import { getStructuredData, serializeStructuredData } from "@/lib/seo/structuredData.mjs";

// Keep this inside each page so navigation retains the existing mount animations.
// Pass `page` and `content` to emit the page's JSON-LD.
export default function PageShell({ locale, lang, children, avoidMobileBottomBar = false, page, content }) {
  const common = resources[locale].common;

  return (
    <div lang={lang} className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} nav={common.nav} labels={common.header} />
      {children}
      <Footer locale={locale} content={common.footer} />
      <ScrollToTop avoidMobileBottomBar={avoidMobileBottomBar} />
      {page && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(getStructuredData(page, locale, content)) }}
        />
      )}
    </div>
  );
}
