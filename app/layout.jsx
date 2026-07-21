import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "TRANSGARANT GROUP | Tarptautinis kroviniu transportas",
  description:
    "UAB TRANSGARANT GROUP organizuoja keliu, juru ir oro kroviniu transporta Europoje, Baltijos, Skandinavijos ir NVS salyse.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="lt" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
