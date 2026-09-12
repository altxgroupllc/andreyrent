"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { numericSpring } from "./tokens";

/**
 * A figure that travels to its new value instead of flashing. Every price, total and
 * day count in the product goes through this, so changing the duration reads as the
 * same number moving rather than a different number appearing.
 */
export function SmoothNumber({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const sp = useSpring(mv, numericSpring);
  const text = useTransform(sp, (v) => Math.round(v).toLocaleString("ru-RU").replace(/ /g, " "));

  React.useEffect(() => { mv.set(value); }, [value, mv]);

  if (reduce) {
    return <span className={`tnum ${className}`}>{value.toLocaleString("ru-RU").replace(/ /g, " ")}</span>;
  }
  return <motion.span className={`tnum ${className}`}>{text}</motion.span>;
}
