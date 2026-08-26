import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import HomeBarberProvider from "../components/HomeBarberProvider";
import SiteNav from "../components/SiteNav";
import PrototypeNotice from "../components/PrototypeNotice";
import { getCities, getAllBarbers, getDefaultHomeBarberId } from "../lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "azn brbr — find a barber who already knows your hair",
  description:
    "Vouch-based barber discovery for Asian hair, built for travelers and new arrivals.",
};

export default function RootLayout({ children }) {
  const cities = getCities();
  const allBarbers = getAllBarbers();
  const defaultHomeBarberId = getDefaultHomeBarberId();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-shell font-sans text-ink">
        <HomeBarberProvider defaultHomeBarberId={defaultHomeBarberId}>
          <div className="mx-auto max-w-[1180px] px-6 py-6">
            <div className="overflow-hidden rounded-[6px] bg-paper">
              <SiteNav cities={cities} allBarbers={allBarbers} />
              <PrototypeNotice />
              {children}
            </div>
          </div>
        </HomeBarberProvider>
      </body>
    </html>
  );
}
