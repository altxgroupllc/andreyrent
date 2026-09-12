import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/routes";
import { CataloguePage } from "@/components/booking/catalogue-page";

export const metadata: Metadata = {
  title: "Каталог байков и скутеров в Паттайе",
  description:
    "28 моделей Honda и Yamaha в аренду в Паттайе. Цена показана за выбранный срок аренды, а не «от». Залог деньгами, паспорт остаётся у вас.",
  alternates: { canonical: "/ru/bikes" },
};

export default async function BikesPage({ params }: PageProps<"/[locale]/bikes">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CataloguePage
      locale={locale}
      category="motorbike"
      title="Байки и скутеры в аренду"
      lede="Выберите срок — весь парк пересчитается. Цена под каждой моделью это сумма за выбранный период, а не минимальный тариф при долгой аренде."
    />
  );
}
