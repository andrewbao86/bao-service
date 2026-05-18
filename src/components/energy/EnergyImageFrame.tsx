import Image from "next/image";
import { cn } from "@/lib/utils";

export function EnergyImageFrame({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 768px) 100vw, 33vw",
  objectPosition = "object-center",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/[0.06]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", objectPosition)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
