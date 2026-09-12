import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bySlug, vehicles } from "@/content/vehicles";
import { toListItem } from "@/content/vehicle-list";
import { isLocale, LOCALES } from "@/content/routes";
import { Island, IslandFallback } from "@/components/system/island";
import { BookingExperience } from "@/components/booking/booking-experience";
import { displayName } from "@/components/vehicle/vehicle-name";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => vehicles.map((vehicle) => ({ locale, slug: vehicle.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const vehicle = bySlug(slug);
  if (!vehicle || !isLocale(locale)) return {};
  return {
    title: `Оформление аренды — ${displayName(toListItem(vehicle))}`,
    description: `Пошаговая заявка на аренду ${displayName(toListItem(vehicle))}.`,
    alternates: { canonical: `/${locale}/booking/${slug}` },
  };
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const vehicle = bySlug(slug);
  if (!vehicle) notFound();
  return <Island fallback={<div className="mx-auto h-[680px] max-w-[1080px] px-4 py-10"><IslandFallback height={620} /></div>}><BookingExperience vehicle={toListItem(vehicle)} locale={locale} /></Island>;
}
