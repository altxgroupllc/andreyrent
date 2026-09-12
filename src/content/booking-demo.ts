import type { VehicleListItem } from "./vehicle-list";

/**
 * Presentation-only values for the booking prototype. Inventory is not connected yet,
 * so these values must never be represented as a live allocation.
 */
export function demoUnit(vehicle: VehicleListItem) {
  const seed = [...vehicle.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = vehicle.category === "auto"
    ? ["Белый", "Серый", "Чёрный"]
    : vehicle.category === "bicycle"
      ? ["Чёрный", "Красный", "Серый"]
      : ["Чёрный", "Белый", "Серый"];

  return {
    color: palette[seed % palette.length],
    plate: `ДЕМО ${String(1000 + (seed % 8999))}`,
    mileage: `${(1_800 + (seed % 32_000)).toLocaleString("ru-RU")} км`,
  };
}

export const bookingDemo = {
  deposit: 5000,
  managerNumber: "+66 88 520 5496",
  rules: [
    "Транспорт выдаётся при наличии действующего загранпаспорта.",
    "Залог передаётся оператору выбранным в заявке способом.",
    "Клиент отвечает за сохранность транспорта на срок аренды.",
    "Залог возвращается после возврата без повреждений; штрафы и повреждения оплачивает клиент.",
  ],
} as const;

export type DemoDepositCurrency = "THB" | "EUR" | "RUB" | "USD" | "USDT";

/** Display-only conversion from the 5 000 ฿ prototype deposit. Not a payment quote. */
export function demoDepositIn(currency: DemoDepositCurrency) {
  const perCurrency: Record<DemoDepositCurrency, number> = {
    THB: 1,
    EUR: 39.5,
    RUB: 0.39,
    USD: 35.5,
    USDT: 35.5,
  };
  return Math.round(bookingDemo.deposit / perCurrency[currency]);
}
