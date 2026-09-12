"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { vehicles, quote } from "@/content/vehicles";
import { vehiclePath, type Locale } from "@/content/routes";
import { thb } from "@/lib/rental";
import { t, r, days as pluralDays } from "@/components/system/tokens";
import { Pressable } from "@/components/system/pressable";
import { useRental } from "@/components/booking/use-rental";
import { withRental } from "@/components/booking/rental-state";
import { displayName } from "@/components/vehicle/vehicle-name";

/** ⌘K model search for people who already know what they want. */
export function ModelSearch({
  locale, labels,
}: { locale: Locale; labels: { search: string; searchModel: string } }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [rental] = useRental();

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  return (
    <>
      <Pressable
        onClick={() => setOpen(true)}
        ariaLabel={labels.searchModel}
        className="grid h-9 place-items-center px-3"
        style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,.8)", borderRadius: r.control }}
      >
        <span className="flex items-center gap-2 text-[13px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">{labels.search}</span>
        </span>
      </Pressable>

      <CommandDialog open={open} onOpenChange={setOpen} title={labels.searchModel} description={labels.searchModel}>
        <CommandInput placeholder="Honda Click, Forza, PCX…" />
        <CommandList>
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          <CommandGroup heading={`Цены на ${rental.days} ${pluralDays(rental.days)}`}>
            {vehicles.map((v) => {
              const q = quote(v, rental.days);
              return (
                <CommandItem
                  key={v.slug}
                  value={v.name}
                  onSelect={() => {
                    setOpen(false);
                    router.push(withRental(vehiclePath(v.category, v.slug, locale), rental));
                  }}
                >
                  <span className="flex-1">{displayName(v)}</span>
                  <span className="tnum text-[13px]" style={{ color: t.muted }}>
                    {q ? `${thb(q.total)} ฿` : "—"}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
