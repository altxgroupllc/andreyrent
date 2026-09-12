import * as React from "react";
import { t, r } from "./tokens";

export function Card({
  children, className = "", style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card, ...style }}>
      {children}
    </div>
  );
}

/** Neutral chip. Yellow is never used for status or savings — see design-profile.yaml. */
export function Chip({
  children, tone = "neutral", className = "",
}: { children: React.ReactNode; tone?: "neutral" | "outline"; className?: string }) {
  const style: React.CSSProperties =
    tone === "outline"
      ? { border: `1px solid ${t.border}`, color: t.muted, background: "transparent" }
      : { background: t.surfaceSunken, color: t.muted };
  return (
    <span className={`px-1.5 py-0.5 text-[11px] font-500 ${className}`} style={{ borderRadius: r.badge, ...style }}>
      {children}
    </span>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[12.5px] font-500" style={{ color: t.muted }}>{children}</span>;
}

export function SectionHeading({
  title, sub, action,
}: { title: string; sub?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pb-3" style={{ borderBottom: `1px solid ${t.border}` }}>
      <div>
        <h2 className="text-[19px] font-600 leading-tight">{title}</h2>
        {sub && <p className="mt-1 text-[13px]" style={{ color: t.muted }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
