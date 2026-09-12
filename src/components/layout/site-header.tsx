"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { WhatsApp } from "@/components/icons";
import { t, r } from "@/components/system/tokens";
import { PressableLink } from "@/components/system/pressable";
import { path, type Locale } from "@/content/routes";
import { whatsappPlain } from "@/components/booking/whatsapp-link";
import { ModelSearch } from "./model-search";
import { MobileNavigation } from "./mobile-navigation";
import { HeaderNavigation } from "./header-navigation";

/**
 * Compact 52px header — the approved C3 treatment. Logo sits on its required dark
 * plate; search collapses to an icon below 640px; WhatsApp keeps its channel green.
 * Deliberately not a large navigation bar.
 */
export function SiteHeader({
  locale, brandLine, labels, nav,
}: {
  locale: Locale;
  brandLine: string;
  labels: { search: string; searchModel: string; menu: string; closeMenu: string; whatsapp: string };
  nav: { href: string; label: string }[];
}) {
  return (
    <header
      className="sticky top-0 z-30"
      style={{ background: "rgba(21,21,21,0.93)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex h-[52px] max-w-[1320px] items-center gap-3 px-4">
        <Link href={path.home(locale)} aria-label="Andrei Motorbike Rent" className="flex h-9 shrink-0 items-center">
          <Logo height={26} />
        </Link>

        <span className="hidden truncate text-[12.5px] xl:inline" style={{ color: "rgba(255,255,255,.45)" }}>
          {brandLine}
        </span>

        <Suspense fallback={<div className="ml-auto hidden h-8 lg:block" aria-hidden />}>
          <HeaderNavigation nav={nav} />
        </Suspense>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <Suspense
            fallback={<div aria-hidden style={{ height: 36, width: 92, background: "rgba(255,255,255,0.09)", borderRadius: r.control }} />}
          >
            <ModelSearch locale={locale} labels={labels} />
          </Suspense>
          <Suspense fallback={<div className="h-9 w-9 lg:hidden" aria-hidden />}>
            <div className="lg:hidden">
              <MobileNavigation nav={nav} labels={{ menu: labels.menu, close: labels.closeMenu }} />
            </div>
          </Suspense>
          <PressableLink
            href={whatsappPlain()}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={labels.whatsapp}
            className="grid h-9 place-items-center px-3"
            style={{ background: t.green, color: "#FFFFFF", borderRadius: r.control }}
          >
            <span className="flex items-center gap-2 text-[13px] font-500">
              <WhatsApp size={16} />
              <span className="hidden sm:inline">{labels.whatsapp}</span>
            </span>
          </PressableLink>
        </div>
      </div>
    </header>
  );
}
