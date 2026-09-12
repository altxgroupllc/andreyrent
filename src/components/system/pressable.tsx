"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { dur, easeOut } from "./tokens";

type Common = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  title?: string;
};

/** Consistent interaction feedback: -1px lift, 0.985 press. Never more. */
export function Pressable({
  children, className = "", style, onClick, ariaPressed, ariaCurrent, disabled, ariaLabel, title, type = "button",
}: Common & {
  onClick?: () => void;
  ariaPressed?: boolean;
  ariaCurrent?: "page" | boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-pressed={ariaPressed}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      whileHover={reduce || disabled ? undefined : { y: -1 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: dur.control, ease: easeOut }}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}

export function PressableLink({
  children, className = "", style, href, ariaLabel, title, target, rel,
}: Common & { href: string; target?: string; rel?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      title={title}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ duration: dur.control, ease: easeOut }}
      className={className}
      style={style}
    >
      {children}
    </motion.a>
  );
}
