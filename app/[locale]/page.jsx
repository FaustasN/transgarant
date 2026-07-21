import Header from "./globalComponents/Header";
import Footer from "./globalComponents/Footer";
import Hero from "./pageComponents/Hero";
import Services from "./pageComponents/Services";
import Destinations from "./pageComponents/Destinations";
import About from "./pageComponents/About";
import FinalCta from "./pageComponents/FinalCta";

export function generateStaticParams() {
  return [{ locale: "lt" }, { locale: "en" }, { locale: "pl" }, { locale: "ru" }];
}

export default async function Home({ params }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />

      <main>
        <Hero locale={locale} />

        <Services locale={locale} />

        <Destinations locale={locale} />

        <About locale={locale} />

        <FinalCta locale={locale} />
      </main>

      <Footer locale={locale} />
    </div>
  );
}
