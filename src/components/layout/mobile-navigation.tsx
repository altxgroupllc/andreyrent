"use client";

import Link from "next/link";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Close, Menu } from "@/components/icons";
import { parseRental, withRental } from "@/components/booking/rental-state";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { r, t } from "@/components/system/tokens";

/**
 * The desktop header is intentionally compact; below its breakpoint, this gives every
 * production route an explicit, keyboard-accessible way in without turning the header
 * into a second navigation bar.
 */
export function MobileNavigation({
  nav, labels,
}: {
  nav: { href: string; label: string }[];
  labels: { menu: string; close: string };
}) {
  const searchParams = useSearchParams();
  const rental = React.useMemo(() => parseRental(searchParams), [searchParams]);
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label={labels.menu}
          className="grid h-9 w-9 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,.8)", borderRadius: r.control }}
        >
          <Menu size={18} />
        </button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby={undefined}
        className="w-[min(320px,calc(100%-2rem))] border-0 p-4"
        style={{ background: t.surface, borderTopLeftRadius: r.container, borderBottomLeftRadius: r.container }}
      >
        <div className="flex items-center justify-between gap-4">
          <DrawerTitle className="text-[17px] font-600" style={{ color: t.text }}>{labels.menu}</DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className="grid h-9 w-9 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.control }}
            >
              <Close size={18} />
            </button>
          </DrawerClose>
        </div>

        <nav className="mt-5 flex flex-col gap-1" aria-label={labels.menu}>
          {nav.map((item) => (
            <DrawerClose key={item.href} asChild>
              <Link
                href={withRental(item.href, rental)}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center px-3 text-[15px] font-500 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.control }}
              >
                {item.label}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
