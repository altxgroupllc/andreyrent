import * as React from "react";
import { t, r } from "./tokens";

/**
 * Client islands that read rental state call useSearchParams(), which requires a
 * Suspense boundary for static prerendering. Fallbacks approximate the real geometry
 * so nothing shifts when the island hydrates.
 */
export function IslandFallback({ height, className = "" }: { height: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ height, background: t.surfaceSunken, borderRadius: r.card, opacity: 0.6 }}
    />
  );
}

export function Island({
  children, fallback,
}: { children: React.ReactNode; fallback: React.ReactNode }) {
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
}
