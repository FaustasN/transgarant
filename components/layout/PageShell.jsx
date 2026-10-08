import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";

// Keep this inside each page so navigation retains the existing mount animations.
export default function PageShell({ locale, lang, children, avoidMobileBottomBar = false, structuredData }) {
  return (
    <div lang={lang} className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
      <ScrollToTop avoidMobileBottomBar={avoidMobileBottomBar} />
      {structuredData}
    </div>
  );
}
