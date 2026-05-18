import { cn } from "@/lib/utils";

export function EvidenceVizCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.06] sm:p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
