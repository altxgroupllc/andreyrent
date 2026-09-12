"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { brand } from "@/content/brand";

/* ------------------------------------------------------------------ *
 * C3 — PRECISION RENTAL, refinement pass
 *
 * Inherits C2's neutral system unchanged. Only three things are added:
 * a selection language, a price hierarchy that follows the chosen duration,
 * and a little more room for the motorcycles themselves.
 * ------------------------------------------------------------------ */

export const t = {
  page: "#F5F5F3",
  surface: brand.white,
  surfaceSunken: "#F0F0ED",
  plate: "#EEEEEA",
  dark: "#151515",
  text: "#171717",
  muted: "#6B6B68",
  faint: "#9A9A96",
  border: "rgba(17,17,17,0.08)",
  borderStrong: "rgba(17,17,17,0.16)",
  borderSelected: "rgba(17,17,17,0.55)",
  yellow: brand.yellow,
  red: brand.red,
  green: brand.green,
  lineGreen: brand.lineGreen,
} as const;

export const r = { container: 20, card: 16, control: 12, button: 12, badge: 8 } as const;
export const dur = { control: 0.2, card: 0.24, panel: 0.42 } as const;
export const easeOut = [0.22, 0.61, 0.36, 1] as const;
export const spring = { type: "spring", stiffness: 420, damping: 40, mass: 0.8 } as const;
export const panelSpring = { type: "spring", stiffness: 260, damping: 34, mass: 0.9 } as const;

export function SmoothNumber({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const sp = useSpring(mv, { stiffness: 320, damping: 38, mass: 0.6 });
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString("ru-RU").replace(/ /g, " "));
  React.useEffect(() => { mv.set(value); }, [value, mv]);
  if (reduce) return <span className={`tnum ${className}`}>{value.toLocaleString("ru-RU").replace(/ /g, " ")}</span>;
  return <motion.span className={`tnum ${className}`}>{text}</motion.span>;
}

export function Pressable({
  as = "button", children, className = "", style, onClick, ariaPressed, ariaLabel, disabled, title,
}: {
  as?: "button" | "a";
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  onClick?: () => void; ariaPressed?: boolean; ariaLabel?: string; disabled?: boolean; title?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = as === "a" ? motion.a : motion.button;
  return (
    <Comp
      onClick={onClick} aria-pressed={ariaPressed} aria-label={ariaLabel} title={title}
      disabled={as === "button" ? disabled : undefined}
      whileHover={reduce || disabled ? undefined : { y: -1 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: dur.control, ease: easeOut }}
      className={className} style={style}
    >
      {children}
    </Comp>
  );
}

export const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12.5px] font-500" style={{ color: t.muted }}>{children}</span>
);

export const Card = ({
  children, className = "", style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={className} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card, ...style }}>
    {children}
  </div>
);

/**
 * Price hierarchy follows the decision being made. On a one-day rental the daily
 * rate IS the price. On anything longer the customer is committing to a total, so
 * the total leads and the per-day rate becomes the explanation underneath it.
 */
export function PriceBlock({
  perDay, total, days, saving, size = "row",
}: { perDay: number; total: number; days: number; saving: number | null; size?: "row" | "hero" }) {
  const multiDay = days > 1;
  const big = size === "hero" ? "text-[34px]" : "text-[20px]";
  const small = size === "hero" ? "text-[14px]" : "text-[12.5px]";

  return (
    <div className={size === "hero" ? "" : "text-right"}>
      <div className={`flex items-baseline gap-1 ${size === "hero" ? "" : "justify-end"}`}>
        <SmoothNumber value={multiDay ? total : perDay} className={`${big} font-600 leading-none`} />
        <span className={`${size === "hero" ? "text-[16px]" : "text-[13px]"} font-500`} style={{ color: t.muted }}>
          ฿{multiDay ? "" : "/день"}
        </span>
      </div>
      <div className={`mt-1 flex items-center gap-1.5 ${size === "hero" ? "" : "justify-end"} ${small}`} style={{ color: t.muted }}>
        {multiDay ? (
          <span className="whitespace-nowrap"><SmoothNumber value={perDay} /> ฿/день</span>
        ) : (
          <span className="whitespace-nowrap">за один день</span>
        )}
        {saving !== null && multiDay && (
          <span className="shrink-0 px-1.5 py-0.5 text-[11px] font-500"
            style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}>
            −{saving}%
          </span>
        )}
      </div>
    </div>
  );
}

export const plural = (n: number) =>
  n === 1 ? "день" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "дня" : "дней";
