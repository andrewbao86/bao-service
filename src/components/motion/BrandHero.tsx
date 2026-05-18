import Image from "next/image";
import { heroGradient } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

type BrandHeroProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  backgroundImage?: string;
};

export function BrandHero({ children, className = "", align = "left", backgroundImage }: BrandHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden text-white",
        !backgroundImage && heroGradient,
        className
      )}
    >
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-900/75" aria-hidden />
        </>
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-6xl px-4 py-28 md:py-32 lg:py-36",
          align === "center" && "text-center"
        )}
      >
        <div className={align === "left" ? "max-w-3xl" : "mx-auto max-w-3xl"}>{children}</div>
      </div>
    </section>
  );
}
