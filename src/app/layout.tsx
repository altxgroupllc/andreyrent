import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { RouteBackground } from "@/components/layout/route-background";
import "./globals.css";

/** Onest — the approved C3 typeface. One modern Cyrillic-native UI face, no mono. */
const onest = Onest({
  variable: "--font-c2",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentmotorbike.org"),
  title: {
    default: "Аренда байков и скутеров в Паттайе — Andrei Motorbike Rent",
    template: "%s — Andrei Motorbike Rent",
  },
  description:
    "Прокат мотобайков, скутеров, авто и велосипедов в Паттайе. Честная цена за ваш срок аренды, доставка по городу, паспорт остаётся у вас.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${onest.variable} h-full antialiased`}>
      <body className="min-h-full">
        <RouteBackground />
        <div className="relative z-10 min-h-full">{children}</div>
      </body>
    </html>
  );
}
