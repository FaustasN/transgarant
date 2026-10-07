import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "TRANSGARANT GROUP | Tarptautinis krovinių transportas",
  description:
    "UAB „TRANSGARANT GROUP“ organizuoja krovinių gabenimą kelių, jūrų ir oro transportu Lietuvoje ir visoje Europoje.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="lt" className={manrope.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
