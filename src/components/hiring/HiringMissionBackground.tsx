"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type HiringMissionBackgroundProps = {
  className?: string;
  showScanLine?: boolean;
};

export function HiringMissionBackground({
  className,
  showScanLine = true,
}: HiringMissionBackgroundProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className={cn(
          "absolute inset-0 opacity-50",
          !reduced && "max-md:opacity-40"
        )}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {!reduced && (
        <>
          <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl max-md:hidden hiring-orb-drift" />
          <div className="absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl max-md:hidden hiring-orb-drift-reverse" />
        </>
      )}
      {showScanLine && !reduced && (
        <div className="absolute inset-x-0 top-0 h-px bg-teal-400/30 max-md:hidden hiring-scan-line" />
      )}
    </div>
  );
}
