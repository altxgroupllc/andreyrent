"use client";

import * as React from "react";
import Image from "next/image";
import type { VehicleListItem } from "@/content/vehicle-list";
import { t, r } from "@/components/system/tokens";
import { NoPhoto } from "./no-photo";

export function VehicleGallery({
  vehicle, max = 5, sizes = "420px", aspect = "16/10", preload = false,
}: { vehicle: Pick<VehicleListItem, "slug" | "name" | "images">; max?: number; sizes?: string; aspect?: string; preload?: boolean }) {
  const [shot, setShot] = React.useState(0);
  React.useEffect(() => { setShot(0); }, [vehicle.slug]);

  const shots = vehicle.images.slice(0, max);

  return (
    <div>
      <div className="relative overflow-hidden" style={{ aspectRatio: aspect, background: t.plate, borderRadius: r.card }}>
        {shots[shot] ? (
          <Image
            src={shots[shot]}
            alt={`${vehicle.name} — фото ${shot + 1}`}
            fill
            sizes={sizes}
            preload={preload && shot === 0}
            className="object-contain p-2"
          />
        ) : (
          <NoPhoto tone="light" />
        )}
      </div>

      {shots.length > 1 && (
        <div className="rail mt-2 flex gap-1.5 overflow-x-auto">
          {shots.map((src, i) => (
            <button
              key={src}
              onClick={() => setShot(i)}
              aria-label={`Фото ${i + 1}`}
              aria-pressed={i === shot}
              className="relative h-11 w-[58px] shrink-0 overflow-hidden"
              style={{
                background: t.plate,
                borderRadius: r.control,
                outline: i === shot ? `2px solid ${t.text}` : "none",
                outlineOffset: -2,
                opacity: i === shot ? 1 : 0.6,
              }}
            >
              <Image src={src} alt="" fill sizes="58px" className="object-contain p-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
