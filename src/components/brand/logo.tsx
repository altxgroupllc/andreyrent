import Image from "next/image";
import { logo } from "@/content/brand";

/**
 * The existing logo, used as-is. It carries white knockout text ("FOR RENT"), so it is
 * only ever placed on a dark plate — see brandRules.logoRequiresDarkPlate.
 */
export function Logo({ height = 28, className = "" }: { height?: number; className?: string }) {
  const width = Math.round((logo.width / logo.height) * height);
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
