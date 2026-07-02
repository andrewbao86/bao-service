import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type EnergyAiCalloutProps = {
  children: React.ReactNode;
  variant?: "light" | "brand" | "dark" | "onDark";
  className?: string;
};

const variantStyles = {
  light: "bg-teal-50/90 text-teal-950 ring-teal-200/70 [&_svg]:text-teal-600",
  brand: "bg-brand-50/90 text-brand-950 ring-brand-200/70 [&_svg]:text-brand-600",
  dark: "bg-white/[0.06] text-slate-200 ring-white/10 [&_svg]:text-teal-400",
  onDark: "bg-white/10 text-slate-100 ring-white/15 [&_svg]:text-teal-300",
} as const;

export function EnergyAiCallout({
  children,
  variant = "light",
  className,
}: EnergyAiCalloutProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl p-4 text-sm leading-relaxed ring-1",
        variantStyles[variant],
        className
      )}
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
