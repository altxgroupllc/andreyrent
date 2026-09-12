import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { offices } from "@/content/locations";
import { path, type Locale } from "@/content/routes";
import { t } from "@/components/system/tokens";

export function SiteFooter({
  locale, labels, nav,
}: {
  locale: Locale;
  labels: { rights: string; hours: string };
  nav: { href: string; label: string }[];
}) {
  return (
    <footer style={{ background: t.dark, color: "rgba(255,255,255,.7)" }}>
      <div className="mx-auto max-w-[1320px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-[15px] font-600" style={{ color: "#FFFFFF" }}>{business.legalName}</div>
            <p className="mt-2 text-[13px] leading-[1.6]">{labels.hours}</p>
            <a href={`mailto:${business.email}`} className="mt-1.5 inline-flex min-h-[32px] items-center text-[13px] underline-offset-2 hover:underline">
              {business.email}
            </a>
          </div>

          {offices.map((o) => (
            <div key={o.id}>
              <div className="text-[14px] font-600" style={{ color: "#FFFFFF" }}>{o.name}</div>
              {/* C-14: the street address is published four different ways — not printed here */}
              <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className="tnum mt-1.5 inline-flex min-h-[32px] items-center text-[13.5px] font-500" style={{ color: "#FFFFFF" }}>
                {o.phone}
              </a>
              <Link href={path.contacts(locale)} className="inline-flex min-h-[32px] items-center text-[13px] underline-offset-2 hover:underline">
                Как доехать
              </Link>
            </div>
          ))}

          <nav className="flex flex-col">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="inline-flex min-h-[34px] items-center text-[13px] underline-offset-2 hover:underline">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(255,255,255,.1)" }}>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,.4)" }}>
            © {business.foundedYear}–2026 «{business.legalName}». {labels.rights}
          </p>
          <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "rgba(255,255,255,.48)" }}>
            <Image src="/brand/altx-studio-mark.png" alt="" width={26} height={23} className="h-[20px] w-auto opacity-80" />
            <span>Created by <strong className="font-600" style={{ color: "rgba(255,255,255,.78)" }}>ALTX Studio</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
