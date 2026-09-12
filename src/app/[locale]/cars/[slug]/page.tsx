import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { vehicles, bySlug } from "@/content/vehicles";
import { isLocale, LOCALES } from "@/content/routes";
import { VehicleDetail } from "@/components/vehicle/vehicle-detail";
import { displayName } from "@/components/vehicle/vehicle-name";
import { toListItem } from "@/content/vehicle-list";

const CATEGORY = "auto" as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    vehicles.filter((v) => v.category === CATEGORY).map((v) => ({ locale, slug: v.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const v = bySlug(slug);
  if (!v || v.category !== CATEGORY) return {};
  const name = displayName(toListItem(v));
  return {
    title: `Аренда ${name} в Паттайе`,
    description: v.seoDescription ?? `${name} в аренду в Паттайе. Цена за выбранный срок, залог деньгами, паспорт остаётся у вас.`,
    alternates: { canonical: `/${locale}/cars/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const vehicle = bySlug(slug);
  if (!vehicle || vehicle.category !== CATEGORY) notFound();

  const related = vehicles
    .filter((x) => x.category === CATEGORY && x.slug !== vehicle.slug && x.segment === vehicle.segment)
    .slice(0, 4);

  return <VehicleDetail vehicle={vehicle} related={related} locale={locale} backLabel="Все авто" />;
}
