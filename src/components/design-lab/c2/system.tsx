"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { brand } from "@/content/brand";

/* ------------------------------------------------------------------ *
 * C2 — PRECISION RENTAL · design system
 *
 * Same product logic as C. What changes is the surface: a calmer neutral system
 * derived from the locked black/white core, one modern Cyrillic UI face, a
 * consistent radius scale, and motion that reports state instead of decorating.
 * ------------------------------------------------------------------ */

export const t = {
  page: "#F5F5F3",
  surface: brand.white,
  surfaceSunken: "#F0F0ED",
  dark: "#151515",
  darkElevated: "#1F1F1F",
  text: "#171717",
  muted: "#6B6B68",
  faint: "#9A9A96",
  border: "rgba(17,17,17,0.08)",
  borderStrong: "rgba(17,17,17,0.16)",
  yellow: brand.yellow,
  red: brand.red,
  green: brand.green,
  lineGreen: brand.lineGreen,
} as const;

/** One radius scale, applied by role. Pills only where the shape means something. */
export const r = {
  container: 20,
  card: 16,
  control: 12,
  button: 12,
  badge: 8,
} as const;

/** Durations, in the bands the brief specifies. */
export const dur = { control: 0.2, card: 0.24, panel: 0.42 } as const;
export const easeOut = [0.22, 0.61, 0.36, 1] as const;

/** Restrained spring: high damping, no overshoot, fast settle. */
export const spring = { type: "spring", stiffness: 420, damping: 40, mass: 0.8 } as const;
export const panelSpring = { type: "spring", stiffness: 260, damping: 34, mass: 0.9 } as const;

/**
 * A number that travels to its new value instead of flashing. Used for every price,
 * so changing the duration reads as the same figure moving, not a different figure
 * appearing. Falls back to a plain value under prefers-reduced-motion.
 */
export function SmoothNumber({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const sp = useSpring(mv, { stiffness: 320, damping: 38, mass: 0.6 });
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString("ru-RU").replace(/ /g, " "));

  React.useEffect(() => { mv.set(value); }, [value, mv]);

  if (reduce) return <span className={`tnum ${className}`}>{value.toLocaleString("ru-RU").replace(/ /g, " ")}</span>;
  return <motion.span className={`tnum ${className}`}>{text}</motion.span>;
}

/** Text button / control with consistent feedback. */
export function Pressable({
  as = "button", children, className = "", style, onClick, ariaPressed, ariaLabel, disabled, title,
}: {
  as?: "button" | "a";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  ariaPressed?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = as === "a" ? motion.a : motion.button;
  return (
    <Comp
      onClick={onClick}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      title={title}
      disabled={as === "button" ? disabled : undefined}
      whileHover={reduce || disabled ? undefined : { y: -1 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: dur.control, ease: easeOut }}
      className={className}
      style={style}
    >
      {children}
    </Comp>
  );
}

/** Section label — sentence case, not shouting. */
export const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12.5px] font-500" style={{ color: t.muted }}>{children}</span>
);

export const Card = ({
  children, className = "", style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={className}
    style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card, ...style }}
  >
    {children}
  </div>
);
