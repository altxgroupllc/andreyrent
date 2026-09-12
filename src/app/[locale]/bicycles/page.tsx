import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/routes";
import { CataloguePage } from "@/components/booking/catalogue-page";

export const metadata: Metadata = {
  title: "Аренда велосипедов в Паттайе",
  description: "Велосипед в аренду в Паттайе — для набережной, парков и спокойных прогулок.",
  alternates: { canonical: "/ru/bicycles" },
};

export default async function BicyclesPage({ params }: PageProps<"/[locale]/bicycles">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CataloguePage
      locale={locale}
      category="bicycle"
      title="Велосипеды в аренду"
      lede="Для набережной, парков и спокойных прогулок по городу."
    />
  );
}
