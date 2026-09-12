import { DirectionA } from "@/components/design-lab/a";
import { DirectionB } from "@/components/design-lab/b";
import { DirectionC } from "@/components/design-lab/c";
import { DirectionC2 } from "@/components/design-lab/c2";
import { DirectionC3 } from "@/components/design-lab/c3";

export const metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "c2" }, { id: "c3" }];
}

/** Bare direction, rendered at the real viewport width so media queries behave. */
export default async function FramePage({ params }: PageProps<"/design-lab/frame/[id]">) {
  const { id } = await params;
  if (id === "b") return <DirectionB />;
  if (id === "c") return <DirectionC />;
  if (id === "c2") return <DirectionC2 />;
  if (id === "c3") return <DirectionC3 />;
  return <DirectionA />;
}
