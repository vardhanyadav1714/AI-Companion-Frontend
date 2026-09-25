import Image from "next/image";
import type { Companion } from "@/lib/companions";

export function Portrait({ companion, small = false, priority = false }: { companion: Companion; small?: boolean; priority?: boolean }) {
  return <div className={small ? "e-avatar" : "e-portrait"}><Image src={companion.image.src!} alt={companion.name} fill sizes={small ? "48px" : "(max-width: 600px) 50vw, (max-width: 1100px) 40vw, 28vw"} priority={priority} style={{ objectFit: "cover", objectPosition: companion.image.focalPoint }} /></div>;
}
