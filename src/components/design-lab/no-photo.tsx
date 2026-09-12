import { Scooter } from "./icons";

/**
 * Honda ADV 350cc New has no photographs on the live site (source-conflicts.md C-12).
 * We do not generate a stand-in image of a bike the business may not own in that trim —
 * the gap is shown as a gap, labelled.
 */
export function NoPhoto({ tone = "dark", label = "Фото пока нет" }: { tone?: "dark" | "light"; label?: string }) {
  const dark = tone === "dark";
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
      style={{ background: dark ? "#1A1A1A" : "#F1F1EE", color: dark ? "rgba(255,255,255,.32)" : "rgba(0,0,0,.32)" }}
    >
      <Scooter size={26} sw={1.5} />
      <span className="px-2 text-center text-[10px] uppercase tracking-[.1em]">{label}</span>
    </div>
  );
}
