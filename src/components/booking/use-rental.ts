"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseRental, rentalToParams, type RentalState } from "./rental-state";

/**
 * Reads rental state from the URL and writes it back. There is no global provider —
 * the URL is the store, so refresh, back/forward and shared links all behave.
 *
 * Writes are shallow (scroll: false) so changing a duration never jumps the page.
 */
export function useRental(): [RentalState, (patch: Partial<RentalState>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = React.useMemo(() => parseRental(searchParams), [searchParams]);

  const set = React.useCallback(
    (patch: Partial<RentalState>) => {
      const next = { ...state, ...patch };
      const q = rentalToParams(next).toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [state, pathname, router],
  );

  return [state, set];
}
