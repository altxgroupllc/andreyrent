import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/routes";
import { getDictionary } from "@/content/i18n";
import { listByCategory } from "@/content/vehicle-list";
import type { VehicleListItem } from "@/content/vehicle-list";
import { RentalExperience } from "@/components/booking/rental-experience";
import { Island, IslandFallback } from "@/components/system/island";
import { Card, Chip } from "@/components/system/surfaces";
import { t, r } from "@/components/system/tokens";
import { path, vehiclePath } from "@/content/routes";

export const metadata: Metadata = {
  title: "Аренда байков, авто и скутеров в Паттайе",
  description:
    "Подберите транспорт в Паттайе: байк, скутер или автомобиль. Посмотрите стоимость на свой срок и пройдите пошаговое оформление заявки.",
  alternates: { canonical: "/ru" },
};

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const pools = {
    motorbike: listByCategory("motorbike"),
    auto: listByCategory("auto"),
    bicycle: listByCategory("bicycle"),
  };
  const featured = [
    { slug: "honda-adv-350cc-keyless", image: "/vehicles/honda-adv-350cc-keyless/honda-adv-350cc-keyless-3.jpg" },
    { slug: "honda-forza-350cc-new", image: "/vehicles/honda-forza-350cc-new/honda-forza-350cc-new-1.jpg" },
    { slug: "toyota-camry-2-4-cvt-hybrid-150", image: "/vehicles/toyota-camry-2-4-cvt-hybrid-150/toyota-camry-2-4-cvt-hybrid-150-batch1.jpg" },
  ].map((item) => {
    const vehicle = [...pools.motorbike, ...pools.auto].find((candidate) => candidate.slug === item.slug);
    return vehicle ? { ...item, vehicle } : null;
  }).filter((item): item is { slug: string; image: string; vehicle: VehicleListItem } => item !== null);

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 lg:pb-12">
      <section className="home-hero">
        <div className="relative z-[1] grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)] lg:gap-8">
          <div className="py-5 sm:py-10 lg:py-14">
            <Chip>Аренда транспорта в Паттайе</Chip>
            <h1 className="mt-5 max-w-[13ch] text-[38px] font-600 leading-[1.04] tracking-[-.04em] sm:text-[52px]">Понятная аренда — от выбора до QR-заявки.</h1>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-6 sm:text-[16px]" style={{ color: t.muted }}>Выберите байк или автомобиль, посмотрите стоимость на свой срок и пройдите оформление по шагам. Без регистрации и без реальной оплаты в прототипе.</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link href="#подбор" className="min-h-11 px-4 py-3 text-[14px] font-600" style={{ background: t.yellow, color: t.text, borderRadius: r.button }}>Подобрать транспорт</Link>
              <Link href={path.howItWorks(locale)} className="min-h-11 px-4 py-3 text-[14px] font-500" style={{ border: `1px solid ${t.borderStrong}`, borderRadius: r.button }}>Как проходит аренда</Link>
            </div>
          </div>
          <Card className="overflow-hidden p-4 sm:p-5" style={{ background: t.dark, color: "#fff", borderColor: t.dark }}>
            <p className="text-[12px] font-600 uppercase tracking-[.12em]" style={{ color: "rgba(255,255,255,.55)" }}>Оформление по шагам</p>
            <ol className="mt-6 space-y-4">
              {[["01", "Подберите технику", "Сравните модели и цену на свой срок."], ["02", "Заполните заявку", "Паспорт, контакты и способ залога — в понятной очередности."], ["03", "Получите QR", "В финале будет номер заявки и связь с менеджером."]].map(([n, title, text]) => <li key={n} className="grid grid-cols-[32px_1fr] gap-3"><span className="text-[12px] font-600" style={{ color: t.yellow }}>{n}</span><div><strong className="text-[15px] font-500">{title}</strong><p className="mt-1 text-[13px] leading-5" style={{ color: "rgba(255,255,255,.62)" }}>{text}</p></div></li>)}
            </ol>
          </Card>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="featured-title">
        <div className="flex items-end justify-between gap-4"><div><h2 id="featured-title" className="text-[24px] font-600 tracking-[-.02em]">Популярная техника</h2><p className="mt-1 text-[14px]" style={{ color: t.muted }}>Байки и автомобили, которые можно открыть и сразу оформить.</p></div><div className="flex gap-3 text-[13px] font-600"><Link href={path.bikes(locale)} className="underline">Байки</Link><Link href={path.cars(locale)} className="underline">Авто</Link></div></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {featured.map(({ vehicle, image }) => <Link key={vehicle.slug} href={vehiclePath(vehicle.category, vehicle.slug, locale)} className="group overflow-hidden" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card }}><div className="relative h-52 overflow-hidden" style={{ background: vehicle.category === "auto" ? t.dark : t.plate }}><Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className={`transition duration-500 group-hover:scale-[1.035] ${vehicle.category === "auto" ? "object-cover" : "object-contain mix-blend-multiply"}`} /></div><div className="flex items-end justify-between gap-4 p-4"><div><p className="text-[11px] font-600 uppercase tracking-[.1em]" style={{ color: t.faint }}>{vehicle.category === "auto" ? "Автомобиль" : "Байк"}</p><p className="mt-1.5 text-[16px] font-600 leading-5">{vehicle.name}</p></div><span className="shrink-0 text-[13px] font-600" style={{ color: t.muted }}>Открыть →</span></div></Link>)}
        </div>
      </section>

      <section id="подбор" className="mt-14 scroll-mt-24">
        <div className="mb-5 max-w-[54ch]"><p className="text-[12px] font-600 uppercase tracking-[.12em]" style={{ color: t.faint }}>Шаг 1</p><h2 className="mt-2 text-[27px] font-600 tracking-[-.025em]">Подберите транспорт под свою поездку</h2><p className="mt-2 text-[14px] leading-6" style={{ color: t.muted }}>После выбора модели внизу появится следующий понятный шаг: посмотреть детали или сразу перейти к оформлению.</p></div>
        <Island fallback={<IslandFallback height={620} />}>
          <RentalExperience pools={pools} locale={locale} dict={dict} showHeading={false} />
        </Island>
      </section>
    </div>
  );
}
