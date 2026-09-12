"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseRental, withRental } from "@/components/booking/rental-state";

/** Keeps the URL-owned rental choice intact when a customer changes site sections. */
export function HeaderNavigation({ nav }: { nav: { href: string; label: string }[] }) {
  const searchParams = useSearchParams();
  const rental = React.useMemo(() => parseRental(searchParams), [searchParams]);

  return (
    <nav className="ml-auto hidden items-center gap-4 lg:flex" aria-label="Основная навигация">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={withRental(item.href, rental)}
          className="inline-flex min-h-[32px] items-center text-[13px] transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,.62)" }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
