import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/routes";
import { CataloguePage } from "@/components/booking/catalogue-page";

export const metadata: Metadata = {
  title: "Аренда байков, скутеров и авто в Паттайе",
  description:
    "Каталог транспорта в аренду в Паттайе: байки, скутеры и автомобили. Цена пересчитывается под выбранный срок аренды.",
  alternates: { canonical: "/ru/bikes" },
};

export default async function BikesPage({ params }: PageProps<"/[locale]/bikes">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CataloguePage
      locale={locale}
      category="motorbike"
      title="Байки, скутеры и авто в аренду"
      lede="Переключайтесь между байками, автомобилями и велосипедами, выбирайте срок — стоимость пересчитается под выбранный период."
    />
  );
}
