import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/routes";
import { CataloguePage } from "@/components/booking/catalogue-page";

export const metadata: Metadata = {
  title: "Аренда авто в Паттайе",
  description: "Toyota и Ford в аренду в Паттайе. Цена за выбранный срок аренды, залог деньгами.",
  alternates: { canonical: "/ru/cars" },
};

export default async function CarsPage({ params }: PageProps<"/[locale]/cars">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CataloguePage
      locale={locale}
      category="auto"
      title="Авто в аренду"
      lede="Восемь автомобилей с публичными тарифами. Стоимость показана за выбранный срок аренды."
    />
  );
}
