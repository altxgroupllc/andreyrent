import * as React from "react";
import { listByCategory } from "@/content/vehicle-list";
import type { VehicleCategory } from "@/content/vehicles";
import type { Locale } from "@/content/routes";
import { getDictionary } from "@/content/i18n";
import { RentalExperience } from "./rental-experience";
import { Island, IslandFallback } from "@/components/system/island";
import { t } from "@/components/system/tokens";

/**
 * Shared catalogue shell for bikes, cars and bicycles. The three routes differ only in
 * which pool opens first — the interaction model, pricing and components are identical,
 * so the product reads as one thing rather than three sections.
 */
export function CataloguePage({
  locale, category, title, lede,
}: { locale: Locale; category: VehicleCategory; title: string; lede: string }) {
  const dict = getDictionary(locale);
  const pools = {
    motorbike: listByCategory("motorbike"),
    auto: listByCategory("auto"),
    bicycle: listByCategory("bicycle"),
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 lg:pb-12">
      <div className="mb-6 max-w-[60ch]">
        <h1 className="text-[31px] font-600 leading-[1.15] tracking-[-.015em]">{title}</h1>
        <p className="mt-2.5 text-[15px] leading-[1.55]" style={{ color: t.muted }}>{lede}</p>
      </div>
      <Island fallback={<IslandFallback height={640} />}>
        <RentalExperience
          pools={pools}
          locale={locale}
          dict={dict}
          showChooser={false}
          initialCategory={category}
        />
      </Island>
    </div>
  );
}
