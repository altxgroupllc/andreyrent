import * as React from "react";
import type { VehicleListItem } from "@/content/vehicle-list";
import { Car, Engine, KeyFob, Scooter, Shield, Pin } from "@/components/icons";
import { useCases } from "@/lib/rental";
import { t } from "@/components/system/tokens";

export interface Attribute { key: string; icon: React.ReactNode; text: string }

/**
 * Attributes read off published specs — never invented. Engine size, keyless, ABS,
 * then a use-case tag. Callers cap the count: two above 640px, one on a phone, because
 * a clipped half-word is worse than showing less.
 */
export function vehicleAttributes(v: VehicleListItem, max = 3): Attribute[] {
  const out: Attribute[] = [];
  if (v.category === "auto") {
    out.push({ key: "category", icon: <Car size={13} sw={1.6} />, text: "Автомобиль" });
    if (v.abs && out.length < max) out.push({ key: "abs", icon: <Shield size={13} sw={1.6} />, text: "ABS" });
    return out.slice(0, max);
  }
  if (v.category === "bicycle") {
    return [{ key: "category", icon: <Scooter size={13} sw={1.6} />, text: "Велосипед" }];
  }
  if (v.engineCc) out.push({ key: "cc", icon: <Engine size={13} sw={1.6} />, text: `${v.engineCc} см³` });
  if (v.keyless) out.push({ key: "keyless", icon: <KeyFob size={13} sw={1.6} />, text: "Keyless" });
  if (v.abs && out.length < max) out.push({ key: "abs", icon: <Shield size={13} sw={1.6} />, text: "ABS" });
  if (out.length < max) {
    const tag = useCases(v).find((c) => c === "Вдвоём" || c === "Трасса" || c === "Город");
    if (tag) out.push({ key: "use", icon: <Pin size={13} sw={1.6} />, text: tag });
  }
  return out.slice(0, max);
}

export function AttributeRow({ items, responsive = true }: { items: Attribute[]; responsive?: boolean }) {
  return (
    <>
      {items.map((a, i) => (
        <span
          key={a.key}
          className={`shrink-0 items-center gap-1 whitespace-nowrap text-[12px] ${
            responsive && i > 0 ? "hidden sm:flex" : "flex"
          }`}
          style={{ color: t.muted }}
        >
          {a.icon}
          {a.text}
        </span>
      ))}
    </>
  );
}
