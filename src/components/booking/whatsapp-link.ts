import { bookingChannels } from "@/content/business";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { thb } from "@/lib/rental";
import { zoneNameOf } from "./rental-state";

const phone = bookingChannels.find((c) => c.kind === "whatsapp")?.value ?? "";

/**
 * Composes the message a customer would send and returns a wa.me deep link.
 * This opens the customer's own WhatsApp with the text prefilled — it does not
 * submit anything to any backend. No booking system is connected in this phase.
 */
export function buildWhatsAppLink(opts: { vehicle?: Pick<VehicleListItem, "name" | "prices" | "category"> | null; days?: number; zone?: string } = {}) {
  const { vehicle, days, zone } = opts;
  const q = vehicle && days ? quote(vehicle, days) : null;
  const pickup = zone ? zoneNameOf(zone) : null;

  const lines = [
    vehicle
      ? `Здравствуйте! Хочу арендовать ${vehicle.category === "auto" ? "автомобиль" : vehicle.category === "bicycle" ? "велосипед" : "байк"}.`
      : "Здравствуйте! Хочу арендовать транспорт.",
    vehicle ? `Модель: ${vehicle.name}` : null,
    days ? `Срок: ${days} дн.` : null,
    q ? `Тариф: ${thb(q.perDay)} ฿/день · итого ${thb(q.total)} ฿` : null,
    `Получение: ${pickup ?? "в офисе"}`,
  ].filter(Boolean);

  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export const whatsappPlain = () => `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
